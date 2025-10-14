import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaHistory, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../utils/api';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    recentOrders: [],
    wishlistItems: 0,
    cartItems: 0,
    totalSpent: 0
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data for user dashboard from the API
        const response = await dashboardAPI.getUserStats();
        const data = response.data;
        
        setStats({
          recentOrders: data.recentOrders || [],
          wishlistItems: data.wishlistItems || 0,
          cartItems: data.cartItems || 0,
          totalSpent: data.totalSpent || 0
        });
        
        setFeaturedProducts(data.featuredProducts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
        // Set default values in case of error
        setStats({
          recentOrders: [],
          wishlistItems: 0,
          cartItems: 0,
          totalSpent: 0
        });
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {currentUser?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
              <FaShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Items in Cart</p>
              <p className="text-xl font-semibold text-gray-800">{stats.cartItems}</p>
            </div>
          </div>
          <Link to="/cart" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View cart →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-500 mr-4">
              <FaHeart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Wishlist Items</p>
              <p className="text-xl font-semibold text-gray-800">{stats.wishlistItems}</p>
            </div>
          </div>
          <Link to="/wishlist" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View wishlist →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaHistory className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Orders</p>
              <p className="text-xl font-semibold text-gray-800">{stats.recentOrders.length}</p>
            </div>
          </div>
          <Link to="/orders" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View orders →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaChartLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <p className="text-xl font-semibold text-gray-800">${stats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <Link to="/orders" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View purchase history →
          </Link>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View all
          </Link>
        </div>
        
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <Link to="/products" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
      
      {/* Featured Products */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recommended For You</h2>
          <Link to="/products" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View all products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="block group">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 mb-4">
                <img 
                  src={getUploadedImageUrl(product.imageUrl)} 
                  alt={product.name} 
                  className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                {product.name}
              </h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
