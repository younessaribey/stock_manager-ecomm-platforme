import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaDownload, FaEye } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ordersAPI } from '../../utils/api';
import APP_CONFIG from '../../config/appConfig';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch orders from the real API endpoint
        const response = await ordersAPI.getAll();
        setOrders(response.data);
        console.log('Orders fetched:', response.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadInvoice = (orderId) => {
    try {
      toast.info(`Preparing invoice for order ${orderId}...`);
      
      // Create the API URL for document download
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const downloadUrl = `${APP_CONFIG.API_URL}/orders/${orderId}/document`;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Add the authorization header
      if (token) {
        // For direct downloads, we need to open in a new tab with the token
        window.open(`${downloadUrl}?token=${token}`, '_blank');
      } else {
        toast.error('You need to be logged in to download invoices');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-indigo-500 mb-4">
            <FaBox className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Browse our products and place your first order</p>
          <Link 
            to="/user/products" 
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => {
          const isExpanded = expandedOrders[order.id] || false;
          const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date';
          return (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed on {orderDate}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status || 'Processing'}
                  </span>
                  <span className="ml-4 text-lg font-semibold text-gray-900">
                    ${!isNaN(Number(order.total)) ? Number(order.total).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <button 
                  onClick={() => toggleOrderDetails(order.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            
            {/* Order Details Section - Shown only when expanded */}
            {isExpanded && (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Order Information</h4>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600">Date: {orderDate}</p>
                    <p className="text-sm text-gray-600">Status: {order.status || 'Processing'}</p>
                    <p className="text-sm text-gray-600">Total: ${!isNaN(Number(order.total)) ? Number(order.total).toFixed(2) : '0.00'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Shipping Information</h4>
                    <p className="text-sm text-gray-600">Shipping Method: Standard Shipping</p>
                    <p className="text-sm text-gray-600">Tracking Number: {order.trackingNumber || 'Not available yet'}</p>
                    <p className="text-sm text-gray-600">Expected Delivery: {order.expectedDelivery || 'To be determined'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Items */}
            <ul className="divide-y divide-gray-200">
              {/* Check for OrderItems from the API response, fall back to items property */}
              {(order.OrderItems && order.OrderItems.length > 0) ? (
                order.OrderItems.map((item) => (
                  <li key={item.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        {item.productImage && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={item.productImage} 
                              alt={item.productName || 'Product'} 
                            />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{item.productName || `Product #${item.productId}`}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity} × ${!isNaN(Number(item.productPrice)) ? Number(item.productPrice).toFixed(2) : '0.00'}
                          </p>
                          {item.productSku && (
                            <p className="mt-1 text-xs text-gray-400">SKU: {item.productSku}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${!isNaN(Number(item.itemTotal)) ? Number(item.itemTotal).toFixed(2) : 
                           (!isNaN(Number(item.productPrice)) ? (Number(item.quantity || 1) * Number(item.productPrice)).toFixed(2) : '0.00')}
                      </div>
                    </div>
                    {isExpanded && item.productDescription && (
                      <div className="mt-2 ml-3 text-xs text-gray-500">
                        <p>Description: {item.productDescription}</p>
                      </div>
                    )}
                  </li>
                ))
              ) : (order.items && order.items.length > 0) ? (
                order.items.map((item) => (
                  <li key={item.id || Math.random()} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity} × ${!isNaN(Number(item.price)) ? Number(item.price).toFixed(2) : '0.00'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${!isNaN(Number(item.price)) ? (Number(item.quantity || 1) * Number(item.price)).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-gray-500">No items in this order</li>
              )}
            </ul>
            
            {/* Order Summary - Shown when expanded */}
            {isExpanded && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end">
                  <div className="w-full sm:w-64">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${!isNaN(Number(order.total)) ? (Number(order.total) * 0.9).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">${!isNaN(Number(order.total)) ? (Number(order.total) * 0.1).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>${!isNaN(Number(order.total)) ? Number(order.total).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Actions */}
            <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Invoice button - uses the download function that opens in new tab */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default behavior
                    downloadInvoice(order.id);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaDownload className="mr-1.5 -ml-0.5 h-4 w-4" />
                  Download Invoice
                </button>
                
                {/* Convert Link to button to avoid redirect */}
                <button 
                  onClick={() => toggleOrderDetails(order.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaEye className="mr-1.5 -ml-0.5 h-4 w-4" />
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default OrderHistory;
