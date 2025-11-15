// Simple order controller for Algeria website
const fs = require('fs');
const path = require('path');

// Store orders in a simple JSON file for now
const ordersFilePath = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ordersFilePath)) {
  fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
}

// Get all orders
const getAllOrders = (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    res.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ message: 'Error reading orders', error: error.message });
  }
};

// Create new order
const createOrder = (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      wilaya,
      address,
      productId,
      productName,
      productPrice,
      quantity,
      totalPrice
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !wilaya || !address || !productId || !quantity) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis',
        missingFields: {
          firstName: !firstName,
          lastName: !lastName,
          phone: !phone,
          wilaya: !wilaya,
          address: !address,
          productId: !productId,
          quantity: !quantity
        }
      });
    }

    // Validate Algerian phone number
    const phoneRegex = /^(0[5-7][0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: 'Numéro de téléphone algérien invalide' 
      });
    }

    // Read existing orders
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));

    // Create new order
    const newOrder = {
      id: Date.now().toString(), // Simple ID generation
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phone,
      wilaya,
      address,
      productId,
      productName,
      productPrice: parseFloat(productPrice),
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice),
      status: 'pending', // pending, confirmed, shipped, delivered, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to orders array
    orders.push(newOrder);

    // Save back to file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    console.log('New order created:', newOrder);

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la commande', 
      error: error.message 
    });
  }
};

// Get order by ID
const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
  }
};

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Statut invalide', 
        validStatuses 
      });
    }

    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Update order
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Save back to file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    res.json({
      message: 'Statut de la commande mis à jour',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
  }
};

// Get orders statistics
const getOrdersStats = (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalPrice, 0),
      topWilayas: getTopWilayas(orders)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
};

// Helper function to get top wilayas by order count
const getTopWilayas = (orders) => {
  const wilayaCounts = {};
  orders.forEach(order => {
    wilayaCounts[order.wilaya] = (wilayaCounts[order.wilaya] || 0) + 1;
  });

  return Object.entries(wilayaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([wilaya, count]) => ({ wilaya, count }));
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrdersStats
};
