import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBoxOpen, 
  FaHeart, 
  FaShoppingCart, 
  FaClipboardList, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const UserLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define sidebar menu items
  const menuItems = [
    { path: '/dashboard', icon: <FaHome size={20} />, label: 'Dashboard' },
    { path: '/user/products', icon: <FaBoxOpen size={20} />, label: 'Products' },
    { path: '/wishlist', icon: <FaHeart size={20} />, label: 'Wishlist' },
    { path: '/cart', icon: <FaShoppingCart size={20} />, label: 'Cart' },
    { path: '/orders', icon: <FaClipboardList size={20} />, label: 'Orders' },
    { path: '/profile', icon: <FaUser size={20} />, label: 'Profile' },
    { path: '/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed overflow-scroll inset-y-0 left-0 z-10 w-64 bg-indigo-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-white">
            StockManager
          </Link>
        </div>
        <div className="mt-10">
          <div className="px-6 py-4 border-b border-indigo-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-xl font-semibold">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{currentUser?.name || 'User'}</p>
                <p className="text-sm text-indigo-300">{currentUser?.email || ''}</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-700 hover:text-white transition-colors"
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
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-gray-600 text-xl" />
                </Link>
                <Link to="/wishlist" className="relative">
                  <FaHeart className="text-gray-600 text-xl" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
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
    </div>
  );
};

export default UserLayout;
