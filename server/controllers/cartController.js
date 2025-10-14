const { Cart, Product, User } = require('../config/db');

// Get current user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all cart items for this user with product details
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    
    // Format the response
    const items = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.Product
    }));
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update current user's cart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    // Check if this is a removal operation for a specific item
    const hasRemovalOperation = items.some(item => item.operation === 'remove');
    
    if (hasRemovalOperation && items.length === 1) {
      // This is a single item removal request
      const itemToRemove = items[0];
      await Cart.destroy({ 
        where: { 
          userId, 
          productId: itemToRemove.productId 
        } 
      });
    } else {
      // This is a full cart update
      // Delete existing cart items for this user
      await Cart.destroy({ where: { userId } });
      
      // Create new cart items
      if (items.length > 0) {
        await Promise.all(items.filter(item => !item.operation).map(item => {
          return Cart.create({
            userId,
            productId: item.productId,
            quantity: item.quantity || 1
          });
        }));
      }
    }
    
    // Get updated cart
    const updatedCartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    
    // Format the response
    const updatedItems = updatedCartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.Product
    }));
    
    res.json({ items: updatedItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCart,
  updateCart
};
