import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaLayerGroup, 
  FaClipboardList, 
  FaChartLine,
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaExternalLinkAlt,
  FaNewspaper
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useSite } from '../contexts/SiteContext';
import Footer from '../components/Footer';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { siteName } = useSite();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = 'Admin Panel - ' + (siteName || 'Brothers Phone');
  }, [siteName]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Define sidebar menu items
  const menuItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBoxes size={20} />, label: 'Products' },
    { path: '/admin/categories', icon: <FaLayerGroup size={20} />, label: 'Categories' },
    { path: '/admin/news', icon: <FaNewspaper size={20} />, label: 'News Page' },
    { path: '/admin/orders', icon: <FaClipboardList size={20} />, label: 'Algeria Orders' },
    { path: '/admin/statistics', icon: <FaChartLine size={20} />, label: 'Statistics' },
    { path: '/admin/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle - Moved to header */}

      {/* Sidebar */}
      <div 
        className={`fixed overflow-scroll inset-y-0 left-0 z-10 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-white flex items-center">
            <FaUserShield className="mr-2" />
            <span>Admin Panel</span>
          </Link>
        </div>
        <div className="mt-10">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-semibold">{currentUser?.name || 'Admin'}</p>
                <p className="text-sm text-gray-400">{currentUser?.email || 'Administrator'}</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${location.pathname === item.path ? 'bg-amber-600 text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 mt-8 rounded-lg text-amber-500 hover:bg-gray-800 hover:text-amber-400 transition duration-200"
                >
                  <span className="mr-4">
                    <FaSignOutAlt size={20} />
                  </span>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              {/* Mobile burger menu */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md bg-amber-600 text-gray-900 focus:outline-none mr-3"
                >
                  {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Back to Website */}
                <Link
                  to="/"
                  className="hidden sm:inline-flex px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:px-4"
                >
                  View Website
                </Link>
                
                {/* Mobile View Website Button */}
                <Link
                  to="/"
                  className="sm:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="View Website"
                >
                  <FaExternalLinkAlt size={16} />
                </Link>
                
                {/* Admin Profile */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-700 font-medium hidden sm:inline">{currentUser?.name || 'Admin'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Developer Signature */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
