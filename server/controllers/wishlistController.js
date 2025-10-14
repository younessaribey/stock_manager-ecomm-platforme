const { Wishlist, Product, User } = require('../config/db');

// Get wishlist by userId
async function getWishlistByUserId(userId) {
  try {
    // Find all wishlist items for this user
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    
    // Format response
    const items = wishlistItems.map(item => ({
      productId: item.productId,
      product: item.Product
    }));
    
    return { userId, items };
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return { userId, items: [] };
  }
}

// Update wishlist for userId
async function updateWishlist(userId, items) {
  try {
    // Check if this is a removal operation for a specific item
    const hasRemovalOperation = items && items.some(item => item.operation === 'remove');
    
    if (hasRemovalOperation && items.length === 1) {
      // This is a single item removal request
      const itemToRemove = items[0];
      await Wishlist.destroy({ 
        where: { 
          userId, 
          productId: itemToRemove.productId 
        } 
      });
    } else {
      // This is a full wishlist update
      // First delete all existing wishlist items for this user
      await Wishlist.destroy({ where: { userId } });
      
      // Then create new wishlist items
      if (items && items.length > 0) {
        await Promise.all(items.filter(item => !item.operation).map(item => {
          return Wishlist.create({
            userId,
            productId: item.productId
          });
        }));
      }
    }
    
    // Return updated wishlist
    return await getWishlistByUserId(userId);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
}

module.exports = {
  getWishlistByUserId,
  updateWishlist
};
