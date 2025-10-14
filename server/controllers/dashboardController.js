const { Product, User, Order, OrderItem, Category, Wishlist, Cart, sequelize } = require('../config/dbSequelize');
const { Op } = require('sequelize');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts from database
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const pendingApprovals = await User.count({ where: { approved: false, role: 'user' } });
    
    // Find low stock products (less than 10 items)
    const lowStockProducts = await Product.findAll({
      where: { quantity: { [Op.lt]: 10 } },
      include: [{ model: Category, attributes: ['name'] }]
    });
    
    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    
    // Format recent orders for frontend
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      user: order.User ? order.User.name : 'Unknown',
      date: new Date(order.createdAt).toLocaleDateString(),
      total: parseFloat(order.total),
      status: order.status
    }));
    
    // Get sales data for charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const orders = await Order.findAll({
      where: { createdAt: { [Op.gte]: sixMonthsAgo } },
      order: [['createdAt', 'ASC']],
      include: [{ model: OrderItem, include: [{ model: Product, include: [Category] }] }]
    });
    
    // Prepare chart data
    const monthLabels = [];
    const salesData = [];
    const ordersData = [];
    
    // Create month labels for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthLabels.push(d.toLocaleString('default', { month: 'short' }));
      salesData.push(0);
      ordersData.push(0);
    }
    
    // Calculate sales and orders per month
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthIndex = 5 - (new Date().getMonth() - orderDate.getMonth() + 
        (new Date().getFullYear() - orderDate.getFullYear()) * 12);
      
      if (monthIndex >= 0 && monthIndex < 6) {
        salesData[monthIndex] += parseFloat(order.total) || 0;
        ordersData[monthIndex] += 1;
      }
    });
    
    // Category sales data for doughnut chart
    const categories = {};
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        const categoryName = item.Product?.Category?.name || 'Uncategorized';
        if (!categories[categoryName]) {
          categories[categoryName] = 0;
        }
        categories[categoryName] += (parseFloat(item.Product?.price) * item.quantity) || 0;
      });
    });
    
    const categoryNames = Object.keys(categories);
    const categorySalesValues = categoryNames.map(name => categories[name]);
    
    // Format chart data for ChartJS
    const salesChartData = {
      labels: monthLabels,
      datasets: [{
        label: 'Monthly Sales',
        data: salesData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }]
    };
    
    const ordersChartData = {
      labels: monthLabels,
      datasets: [{
        label: 'Orders',
        data: ordersData,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }]
    };
    
    const categorySalesData = {
      labels: categoryNames,
      datasets: [{
        label: 'Sales by Category',
        data: categorySalesValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ]
      }]
    };
    
    // Return formatted data for frontend
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      pendingApprovals,
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        imageUrl: p.imageUrl || '/resources/images/product-lg.jpg',
        category: p.Category?.name || 'Uncategorized'
      })),
      recentOrders: formattedRecentOrders,
      salesChartData,
      categorySalesData,
      ordersChartData
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent activities/transactions
const getRecentActivity = async (req, res) => {
  try {
    // Get recent orders and user registrations
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name'] }]
    });
    
    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    
    // Format activity feed
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        date: order.createdAt,
        message: `New order #${order.id} placed by ${order.User?.name || 'Unknown'}`,
        amount: parseFloat(order.total),
        id: order.id
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        date: user.createdAt,
        message: `New user registered: ${user.name}`,
        id: user.id
      }))
    ];
    
    // Sort by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      activities: activities.slice(0, 10)
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user dashboard statistics
const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }
    
    // Get user's orders
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: OrderItem, include: [Product] }]
    });
    
    // Get wishlist and cart counts
    const wishlistCount = await Wishlist.count({ where: { userId } });
    const cartCount = await Cart.count({ where: { userId } });
    
    // Calculate total spent
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    
    // Get featured products
    const featuredProducts = await Product.findAll({
      limit: 4,
      order: sequelize.random(),
      include: [{ model: Category, attributes: ['name'] }]
    });
    
    // Format recent orders for frontend
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      date: new Date(order.createdAt).toLocaleDateString(),
      total: parseFloat(order.total),
      status: order.status,
      items: order.OrderItems.map(item => ({
        productId: item.productId,
        name: item.Product?.name || 'Unknown Product',
        quantity: item.quantity,
        price: parseFloat(item.Product?.price || 0)
      }))
    }));
    
    res.json({
      recentOrders,
      wishlistItems: wishlistCount,
      cartItems: cartCount,
      totalSpent,
      featuredProducts: featuredProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        imageUrl: p.imageUrl || '/resources/images/product-lg.jpg',
        category: p.Category?.name || 'Uncategorized'
      }))
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getUserDashboardStats
};
