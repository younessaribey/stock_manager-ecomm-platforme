import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  FaBox, 
  FaUsers, 
  FaClipboardList, 
  FaExclamationTriangle, 
  FaPlus, 
  FaChartBar, 
  FaFolder, 
  FaTag,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';
import { dashboardAPI } from '../../utils/api';

function AdminDashboard() {
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingApprovals: 0,
    lowStockProducts: [],
    recentOrders: [],
    salesChartData: { labels: [], datasets: [] },
    categorySalesData: { labels: [], datasets: [] },
    ordersChartData: { labels: [], datasets: [] }
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClientInfo, setShowClientInfo] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch both stats and categories
        const [statsResponse, categoriesResponse] = await Promise.all([
          dashboardAPI.getStats().catch(err => {
            console.error('❌ Stats API error:', err);
            return { data: {} };
          }),
          fetch('http://localhost:5050/api/categories')
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
              }
              return res.json();
            })
            .catch(err => {
              console.error('❌ Categories API error:', err);
              return [];
            })
        ]);
        
        setStats(statsResponse.data);
        setCategories(categoriesResponse || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Chart data will be generated from stats
  const salesChartData = stats.salesChartData || { labels: [], datasets: [] };
  const categorySalesData = stats.categorySalesData || { labels: [], datasets: [] };
  const ordersChartData = stats.ordersChartData || { labels: [], datasets: [] };

  // Separate main categories and subcategories
  const mainCategories = categories.filter(cat => cat.parentId === null);
  const subcategories = categories.filter(cat => cat.parentId !== null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Client Info Popup */}
      {showClientInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📱 Brothers Phone - Client Info</h3>
              <button 
                onClick={() => setShowClientInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🏪 Store Information</h4>
                <p className="text-sm text-blue-700">Brothers Phone - Your trusted mobile device store in Algeria</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
                  <div className="text-xs text-green-700">Products</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalOrders}</div>
                  <div className="text-xs text-purple-700">Orders</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-1">📞 Contact</h4>
                <p className="text-sm text-yellow-700">Visit our website: brothers-phone.com</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowClientInfo(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin dashboard. Here's an overview of your store.</p>
          </div>
          <button 
            onClick={() => setShowClientInfo(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaInfoCircle className="mr-2" />
            Client Info
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FaBox className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts ?? 0}</p>
            </div>
          </div>
          <Link to="/admin/products" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View all →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers ?? 0}</p>
            </div>
          </div>
          <Link to="/admin/users" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View all →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders ?? 0}</p>
            </div>
          </div>
          <Link to="/admin/orders" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            View all →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Admin Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals ?? 0}</p>
            </div>
          </div>
          <Link to="/admin/pending-approvals" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:text-indigo-800">
            Review →
          </Link>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-64">
            <Line 
              data={salesChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders This Week</h2>
          <div className="h-64">
            <Bar 
              data={ordersChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">📱 Brothers Phone Categories</h2>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>📂 {mainCategories.length} main categories</span>
              <span>•</span>
              <span>🏷️ {subcategories.length} subcategories</span>
              <span className="text-xs text-red-500">({categories.length} total)</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/admin/categories" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Edit Categories →
            </Link>
            <Link to="/admin/categories-enhanced" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Enhanced View →
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Categories */}
          <div>
            <div className="flex items-center mb-3">
              <FaFolder className="text-blue-600 mr-2" />
              <h3 className="text-md font-medium text-gray-800">Main Categories</h3>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {mainCategories.length}
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mainCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {category.name === 'Occasions' ? '🔋' :
                       category.name === 'Smartphones' ? '📱' :
                       category.name === 'Smartwatches' ? '⌚' :
                       category.name === 'Tablets' ? '📱' :
                       category.name === 'Laptop' ? '💻' :
                       category.name === 'Affaire du jour' ? '💰' :
                       category.name === 'Accessoires' ? '🔌' :
                       category.name === "Brother's Packs" ? '📦' :
                       category.name === 'Livraison Gratuite' ? '🚚' : '📂'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {subcategories.filter(c => c.parentId === category.id).length} subs
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <div className="flex items-center mb-3">
              <FaTag className="text-green-600 mr-2" />
              <h3 className="text-md font-medium text-gray-800">Subcategories</h3>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {subcategories.length}
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {subcategories.slice(0, 8).map((subcategory) => {
                const parent = mainCategories.find(c => c.id === subcategory.parentId);
                return (
                  <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">
                        {subcategory.name === 'Apple' ? '🍎' :
                         subcategory.name === 'Samsung' ? '📱' :
                         subcategory.name === 'Huawei' ? '🌟' :
                         subcategory.name === 'Google' ? '🔍' :
                         subcategory.name === 'Dell' ? '🖥️' :
                         subcategory.name === 'HP' ? '💻' :
                         subcategory.name === 'IPAD' ? '📱' : '🏷️'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{subcategory.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      under {parent?.name || 'Unknown'}
                    </span>
                  </div>
                );
              })}
              {subcategories.length > 8 && (
                <div className="text-center py-2">
                  <Link to="/admin/categories-enhanced" className="text-xs text-indigo-600 hover:text-indigo-800">
                    +{subcategories.length - 8} more subcategories
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="h-64 flex justify-center items-center">
            <div className="w-full max-w-xs">
              <Doughnut 
                data={categorySalesData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Products</h2>
            <Link to="/admin/products" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              View all
            </Link>
          </div>
          
          {stats.lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
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
                  {(stats.lowStockProducts || []).map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={`http://localhost:5050/resources/images/${product.imageUrl}`} alt={product.name} onError={(e) => {e.target.src = '/assets/product-md.jpg'}} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Update Stock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No low stock products at the moment.</p>
          )}
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View all
          </Link>
        </div>
        
        {(stats.recentOrders && stats.recentOrders.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(stats.recentOrders || []).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total?.toFixed ? order.total.toFixed(2) : order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders at the moment.</p>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products/wizard"
            className="flex items-center justify-center p-4 border border-blue-200 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <span className="mr-2">🧙‍♂️</span>
            Smart Wizard
          </Link>
          <Link
            to="/admin/products/add"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            <FaPlus className="mr-2" />
            Add Product
          </Link>
          <Link
            to="/admin/categories-enhanced"
            className="flex items-center justify-center p-4 border border-green-200 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
          >
            <FaFolder className="mr-2" />
            Manage Categories
          </Link>
          <Link
            to="/admin/statistics"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            <FaChartBar className="mr-2" />
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
