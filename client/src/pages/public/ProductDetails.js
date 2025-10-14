import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUploadedImageUrl } from '../../utils/imageUtils';
import { useTheme } from '../../contexts/ThemeContext';
import OrderForm from '../../components/OrderForm';

const ProductDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Helper function to get color class for color display
  const getColorClass = (color) => {
    const colorLower = color?.toLowerCase() || '';
    const colorMap = {
      'black': 'bg-black',
      'white': 'bg-white',
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
      'gray': 'bg-gray-500',
      'grey': 'bg-gray-500',
      'silver': 'bg-gray-300',
      'gold': 'bg-yellow-400',
      'rose': 'bg-rose-400',
      'natural': 'bg-amber-100',
      'titanium': 'bg-gray-400',
      'midnight': 'bg-gray-900',
      'starlight': 'bg-gray-100',
      'graphite': 'bg-gray-700',
    };
    
    // Find matching color or default to gray
    for (const [key, value] of Object.entries(colorMap)) {
      if (colorLower.includes(key)) {
        return value;
      }
    }
    return 'bg-gray-400'; // default color
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5050/api/products/${id}/public`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const handleOrderSuccess = (orderData) => {
    console.log('Order placed successfully:', orderData);
    // You could save to localStorage or send to backend here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
        
        <div className={`rounded-lg shadow-sm overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-4">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={getUploadedImageUrl(product.imageUrl)}
                  alt={product.name} 
                  className="object-contain h-full w-full rounded-lg" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/product-md.jpg/400x300?text=Phone';
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h1>
            
            {product.category && (
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                  {product.category.name}
                </span>
              </div>
            )}
            
            <div className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${parseFloat(product.price).toFixed(2)}
            </div>
            
            <div className="mb-6">
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{product.description || 'No description available'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className={`text-md font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Disponibilité</h3>
              {product.quantity > 0 ? (
                <p className="text-green-600">{product.quantity} en stock</p>
              ) : (
                <p className="text-red-600">Rupture de stock</p>
              )}
            </div>
            
            <div className="mb-6">
              <button
                onClick={handleOrderNow}
                disabled={product.quantity <= 0}
                className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition-colors ${
                  product.quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <FaShoppingBag className="mr-3 h-6 w-6" />
                {product.quantity > 0 ? 'Commander maintenant' : 'Rupture de stock'}
              </button>
            </div>
            
            {/* Enhanced Product Details */}
            <div className={`mt-8 pt-6 space-y-6 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              {/* Device Specifications */}
              {(product.condition || product.storage || product.color || product.model || product.batteryHealth) && (
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📱 Device Information
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {product.condition && (
                      <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                        <span className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                          ⚡ Condition:
                        </span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          product.condition === 'new' ? 'bg-green-100 text-green-800' :
                          product.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    {product.storage && (
                      <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                        <span className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                          💾 Storage:
                        </span>
                        <span className="font-semibold text-blue-600">{product.storage}</span>
                      </div>
                    )}
                    
                    {product.color && (
                      <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                        <span className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                          🎨 Color:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full border-2 border-gray-300 ${getColorClass(product.color)}`}></div>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.color}</span>
                        </div>
                      </div>
                    )}
                    
                    {product.model && (
                      <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                        <span className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                          📋 Model:
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.model}</span>
                      </div>
                    )}
                    
                    {/* Battery Health - Show for all devices that have it */}
                    {product.batteryHealth && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600 flex items-center">
                          🔋 Battery Health:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                product.batteryHealth >= 90 ? 'bg-green-500' : 
                                product.batteryHealth >= 80 ? 'bg-yellow-500' : 
                                product.batteryHealth >= 60 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${product.batteryHealth}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${
                            product.batteryHealth >= 90 ? 'text-green-600' : 
                            product.batteryHealth >= 80 ? 'text-yellow-600' : 
                            product.batteryHealth >= 60 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {product.batteryHealth}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {product.sku && (
                <div>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Order Form Modal */}
      {showOrderForm && product && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay with animation */}
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
                showOrderForm ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setShowOrderForm(false)}
            ></div>

            {/* Modal panel with slide-up animation */}
            <div 
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                showOrderForm ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
              }`}
            >
              <OrderForm
                product={product}
                onClose={() => setShowOrderForm(false)}
                onOrderSuccess={handleOrderSuccess}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductDetails;
