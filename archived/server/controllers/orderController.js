const { Order, OrderItem, Product, User } = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    // If user is admin, return all orders, otherwise only return user's orders
    const orders = req.user.role === 'admin' 
      ? await Order.findAll({
          include: [
            { model: OrderItem, include: [Product] },
            { model: User, attributes: ['id', 'name', 'email'] }
          ]
        })
      : await Order.findAll({
          where: { userId: req.user.id },
          include: [{ model: OrderItem, include: [Product] }]
        });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is allowed to view this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, total, status } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one product' });
    }
    
    // Create the order
    const order = await Order.create({
      total: parseFloat(total),
      status: status || 'pending',
      userId: req.user.id
    });
    
    // Create order items with full product details
    const orderItems = await Promise.all(items.map(async (item) => {
      // Get full product details
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      // Calculate item total
      const itemTotal = parseFloat(product.price) * parseInt(item.quantity);
      
      // Store full product details in the order item
      return OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        productSku: product.sku || '',
        productDescription: product.description || '',
        itemTotal: itemTotal
      });
    }));
    
    // Return the created order with items
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });
    
    res.status(201).json(fullOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permissions (admin or order owner)
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    const { status } = req.body;
    
    // Update order
    await order.update({ status });
    
    // Get updated order with items
    const updatedOrder = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, include: [Product] }]
    });
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permissions (admin only or order owner)
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }
    
    // Delete related order items first
    await OrderItem.destroy({ where: { orderId: order.id } });
    
    // Delete the order
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate PDF document for an order
const generateOrderDocument = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    // Fetch order with details
    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem },
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'address'] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is allowed to view this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    // Create temporary file path
    const tempFilePath = path.join(os.tmpdir(), `order-${orderId}-${Date.now()}.pdf`);
    
    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(tempFilePath);
    
    // Set up PDF pipeline
    doc.pipe(writeStream);
    
    // Add company logo or header
    doc.fontSize(20).text('Stock Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('ORDER INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Order info
    doc.fontSize(12).text(`Order #: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();
    
    // Customer info
    doc.fontSize(14).text('Customer Information');
    doc.fontSize(12);
    doc.text(`Name: ${order.User.name}`);
    doc.text(`Email: ${order.User.email}`);
    if (order.User.phone) doc.text(`Phone: ${order.User.phone}`);
    if (order.User.address) doc.text(`Address: ${order.User.address}`);
    doc.moveDown();
    
    // Order items
    doc.fontSize(14).text('Order Items');
    doc.moveDown();
    
    // Create table for items
    const itemsTable = {
      headers: ['Item', 'Price', 'Quantity', 'Total'],
      rows: []
    };
    
    let tableTop = doc.y + 10;
    let tableWidth = 500;
    
    // Draw table headers
    doc.font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Price', 240, tableTop, { width: 90, align: 'right' });
    doc.text('Quantity', 330, tableTop, { width: 90, align: 'right' });
    doc.text('Total', 420, tableTop, { width: 90, align: 'right' });
    doc.moveDown();
    
    tableTop = doc.y + 10;
    doc.font('Helvetica');
    
    // Calculate subtotal
    let subtotal = 0;
    
    // Draw table rows
    order.OrderItems.forEach((item, i) => {
      const itemName = item.productName || `Product #${item.productId}`;
      const price = parseFloat(item.productPrice || 0).toFixed(2);
      const quantity = item.quantity;
      const total = (price * quantity).toFixed(2);
      
      // Add to subtotal
      subtotal += parseFloat(total);
      
      // Define row position
      const y = tableTop + (i * 25);
      
      // Check if we need a new page
      if (y > doc.page.height - 100) {
        doc.addPage();
        tableTop = 50;
      }
      
      // Write row
      doc.text(itemName, 50, y, { width: 180 });
      doc.text(`$${price}`, 240, y, { width: 90, align: 'right' });
      doc.text(`${quantity}`, 330, y, { width: 90, align: 'right' });
      doc.text(`$${total}`, 420, y, { width: 90, align: 'right' });
    });
    
    // Draw a line
    doc.moveDown(2);
    const summaryTop = doc.y + 10;
    doc.moveTo(50, summaryTop).lineTo(550, summaryTop).stroke();
    doc.moveDown();
    
    // Order summary
    const tax = parseFloat(order.total) - subtotal;
    
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 350, doc.y, { align: 'right' });
    doc.text(`Tax: $${tax.toFixed(2)}`, 350, doc.y + 20, { align: 'right' });
    doc.text(`Total: $${parseFloat(order.total).toFixed(2)}`, 350, doc.y + 40, { align: 'right' });
    
    // Footer
    doc.font('Helvetica');
    doc.moveDown(4);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
    doc.text('This is a computer-generated document. No signature is required.', { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
    // Wait for the PDF to be created
    writeStream.on('finish', () => {
      // Send file as download
      res.download(tempFilePath, `order-${orderId}.pdf`, (err) => {
        // Delete temporary file after download
        fs.unlinkSync(tempFilePath);
        
        if (err) {
          console.error('Error sending PDF:', err);
        }
      });
    });
    
  } catch (error) {
    console.error('Error generating order document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  generateOrderDocument
};
