import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMobileAlt, FaMapMarkerAlt, FaPhone, FaClock, FaArrowRight, FaStore, FaTabletAlt, FaLaptop, FaHeadphones, FaRegCheckCircle, FaStar, FaFire, FaTags, FaShoppingCart, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useSite } from '../../contexts/SiteContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';


const Home = () => {
  const { siteName } = useSite();
  const { t } = useLanguage() || {};
  const { theme } = useTheme();

  const navigate = useNavigate();
  
  // Fallback translation function
  const translate = (key) => {
    if (typeof t === 'function') {
      return t(key);
    }
    // Fallback translations
    const fallbacks = {
      'addToCart': 'Add to Cart',
      'viewMore': 'View More',
      'outOfStock': 'Out of Stock',
      'addedToCart': 'Product added to cart!',
      'addToCartError': 'Failed to add product to cart'
    };
    return fallbacks[key] || key;
  };
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    document.title = siteName ? `${siteName} - Home` : 'Brothers Phone Shop - Your Trusted Mobile Store';
  }, [siteName]);
  
  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5050/api/products/public');
        // Get up to 8 products with images as featured products
        const productsWithImages = response.data.filter(product => product.imageUrl && product.quantity > 0);
        setFeaturedProducts(productsWithImages.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  const addToCart = async (productId) => {
    try {
      toast.success(translate('addedToCart'));
      navigate(`/checkout/${productId}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(translate('addToCartError'));
    }
  };



  // Featured Product Card Component
  const FeaturedProductCard = ({ product, translate, addToCart, isDark }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Get all product images
    const getAllImages = () => {
      const images = [];
      
      // Add main image
      if (product.imageUrl) {
        images.push(product.imageUrl);
      }
      
      // Add additional images from JSON field
      if (product.images) {
        try {
          const additionalImages = JSON.parse(product.images);
          if (Array.isArray(additionalImages)) {
            images.push(...additionalImages);
          }
        } catch (e) {
          console.error('Error parsing additional images:', e);
        }
      }
      
      return images.filter(Boolean);
    };

    const allImages = getAllImages();

    // Auto-cycle through images when hovered (for portfolio demonstration)
    useEffect(() => {
      if (isHovered && allImages.length > 0) {
        const interval = setInterval(() => {
          setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }, 2000); // Change image every 2 seconds
        
        return () => clearInterval(interval);
      }
    }, [isHovered, allImages.length]);

    // Start with a random image for portfolio variety
    useEffect(() => {
      if (allImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * allImages.length);
        setCurrentImageIndex(randomIndex);
      }
    }, [product.id, allImages.length]); // Reset when product changes

    return (
      <div className={`group rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {allImages.length > 0 ? (
            <>
              <img
                src={getUploadedImageUrl(allImages[currentImageIndex])}
                alt={`${product.name} ${currentImageIndex + 1}`}
                className="w-full h-48 sm:h-48 object-cover group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/product-md.jpg';
                }}
              />
              
              {/* Image Navigation for Home - Shop style arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    ›
                  </button>
                  
                  {/* Image Dots for Home - More visible on mobile */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-black/30 px-2 py-1 rounded-full">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Image counter for mobile */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full sm:hidden">
                    {currentImageIndex + 1}/{allImages.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <FaStore className="text-gray-400 text-3xl" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            {product.quantity <= 5 ? (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                Last {product.quantity}!
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                In Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className={`font-bold mb-2 group-hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h3>
          <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-green-600">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <div className="ml-2 flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-3 h-3" />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => addToCart(product.id)}
              disabled={product.quantity <= 0}
              className={`group/btn w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden ${
                product.quantity <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                  : isDark
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50 focus:ring-blue-500 hover:-translate-y-0.5 hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50 focus:ring-blue-500 hover:-translate-y-0.5 hover:scale-[1.02]'
              } h-10 px-4 py-2`}
            >
              {/* Glassy overlay effect */}
              {product.quantity > 0 && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              )}
              <FaShoppingCart className="mr-2 w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">{product.quantity <= 0 ? translate('outOfStock') : translate('addToCart')}</span>
            </button>
            <Link
              to={`/checkout/${product.id}`}
              className={`group/view w-full inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 h-10 px-4 py-2 relative overflow-hidden ${
                isDark
                  ? 'border border-gray-600/50 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm text-gray-200 hover:border-cyan-500/50 hover:text-white focus:ring-gray-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5'
                  : 'border border-gray-300/50 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm text-gray-700 hover:border-blue-400/50 hover:text-gray-900 focus:ring-gray-500 hover:shadow-lg hover:shadow-blue-400/20 hover:-translate-y-0.5'
              }`}
            >
              {/* Animated gradient border effect */}
              <span className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
                isDark 
                  ? 'from-cyan-500/0 via-cyan-500/30 to-cyan-500/0' 
                  : 'from-blue-500/0 via-blue-500/30 to-blue-500/0'
              } opacity-0 group-hover/view:opacity-100 transition-opacity duration-300`} />
              <FaEye className="w-4 h-4 mr-2 relative z-10 group-hover/view:scale-110 transition-transform duration-300" />
              <span className="relative z-10">View Details</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  // Define phone store locations
  const storeLocations = [
    {
      id: 1,
      name: 'Brothers Phone - Downtown',
      address: '123 Main Street, Downtown',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      features: ['New & Used Phones', 'Repairs', 'Accessories']
    },
    {
      id: 2, 
      name: 'Brothers Phone - Mall Plaza',
      address: '456 Mall Plaza Drive, Shopping Center',
      phone: '+1 (555) 234-5678',
      hours: 'Mon-Sun: 10AM-9PM',
      features: ['Latest Models', 'Trade-ins', 'Phone Plans']
    },
    {
      id: 3,
      name: 'Brothers Phone - Westside',
      address: '789 West Avenue, Westside District',
      phone: '+1 (555) 345-6789',
      hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM',
      features: ['Business Solutions', 'Bulk Orders', 'Tech Support']
    },
    {
      id: 4,
      name: 'Brothers Phone - North City',
      address: '321 North Boulevard, North City',
      phone: '+1 (555) 456-7890',
      hours: 'Mon-Sat: 8AM-8PM, Sun: 11AM-5PM',
      features: ['Express Repairs', 'Screen Replacement', 'Data Recovery']
    }
  ];

  // Define phone categories with vibrant colors
  const categories = [
    {
      icon: <FaMobileAlt className="w-8 h-8 text-white" />,
      title: 'Smartphones',
      description: 'Latest iPhones, Samsung Galaxy, Google Pixel and more. New and pre-owned devices available.',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      shadow: 'hover:shadow-purple-500/50'
    },
    {
      icon: <FaTabletAlt className="w-8 h-8 text-white" />,
      title: 'Tablets',
      description: 'iPads, Android tablets and e-readers for work, study and entertainment.',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      shadow: 'hover:shadow-cyan-500/50'
    },
    {
      icon: <FaLaptop className="w-8 h-8 text-white" />,
      title: 'Laptops',
      description: 'MacBooks, Windows laptops and Chromebooks for all your computing needs.',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      shadow: 'hover:shadow-orange-500/50'
    },
    {
      icon: <FaHeadphones className="w-8 h-8 text-white" />,
      title: 'Accessories',
      description: 'Cases, chargers, headphones, screen protectors and all mobile accessories.',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      shadow: 'hover:shadow-green-500/50'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
        {/* Animated Colorful Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Animated Badge with Gradient */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full text-white text-sm font-semibold mb-8 shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 animate-pulse">
              <FaMobileAlt className="mr-2 h-4 w-4 animate-bounce" />
              #1 Phone Store in Your Area ⭐⭐⭐⭐⭐
                </div>
            
            {/* Main Title with Animation */}
            <h1 className={`text-5xl sm:text-7xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className="block mb-2">Brothers Phone</span>
              <span 
                className={`bg-gradient-to-r ${isDark ? 'from-purple-400 via-pink-400 via-cyan-400 to-orange-400' : 'from-purple-600 via-pink-600 via-cyan-600 to-orange-600'} bg-clip-text text-transparent animate-gradient`}
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient-shift 3s ease infinite'
                }}
              >
                Shop
              </span>
                </h1>
            
            <p className={`max-w-3xl mx-auto text-xl sm:text-2xl mb-10 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              🔥 <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Unbeatable Deals</span> on smartphones, tablets & accessories!<br/>
              <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>New & Pre-owned devices • Expert repairs • 4 convenient locations</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/products">
                <button className="group/hero relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  {/* Animated background gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient" style={{ backgroundSize: '200% auto' }}></span>
                  {/* Glassy shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/hero:translate-x-[100%] transition-transform duration-1000 ease-in-out"></span>
                  <FaArrowRight className="mr-2 relative z-10 group-hover/hero:translate-x-1 transition-transform duration-300" />
                  <span className="relative z-10">Shop Now - Best Deals! 💯</span>
                </button>
              </Link>
              <Link to="#locations">
                <button className={`group/location relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark 
                    ? 'border-2 border-cyan-500/50 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm text-white hover:border-cyan-400 hover:shadow-cyan-500/30 focus:ring-cyan-500' 
                    : 'border-2 border-blue-400/50 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm text-gray-900 hover:border-blue-500 hover:shadow-blue-400/30 focus:ring-blue-500'
                }`}>
                  {/* Gradient glow effect */}
                  <span className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-cyan-500/0 via-cyan-500/20 to-cyan-500/0' : 'from-blue-500/0 via-blue-500/20 to-blue-500/0'} opacity-0 group-hover/location:opacity-100 transition-opacity duration-300`}></span>
                  <span className="relative z-10">📍 Find Store Near You</span>
                </button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className={`flex flex-wrap justify-center items-center gap-8 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="flex items-center">
                <FaRegCheckCircle className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                25,000+ Happy Customers
              </div>
              <div className="flex items-center">
                <FaRegCheckCircle className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                100K+ Devices Sold
                </div>
              <div className="flex items-center">
                <FaRegCheckCircle className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                10+ Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories - Mobile App Style with Colorful Design */}
      <div className="relative -mt-12 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to="/products"
                className={`group rounded-2xl p-6 shadow-xl ${category.shadow} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                } overflow-hidden relative`}
              >
                {/* Colorful gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className={`relative w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {category.icon}
                </div>
                <h3 className={`relative font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text' : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text'} group-hover:${category.gradient}`}>{category.title}</h3>
                <p className={`relative text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Deals Section */}
      <div className={`py-20 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 to-slate-900' : 'bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30'}`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full text-sm font-bold mb-4 shadow-lg shadow-orange-500/50 animate-pulse">
              <FaFire className="mr-2 animate-bounce" />
              HOT DEALS 🔥
            </div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Featured Products
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover our handpicked selection of smartphones and accessories at amazing prices!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
              <FeaturedProductCard 
                key={product.id} 
                product={product} 
                translate={translate}
                addToCart={addToCart}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Store Locations Section */}
      <div id="locations" className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold mb-4 shadow-lg shadow-green-500/50 hover:scale-105 transition-transform duration-300">
              <FaMapMarkerAlt className="mr-2" />
              VISIT US 📍
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              4 Convenient Locations
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find the nearest Brothers Phone Shop for expert service, repairs, and the latest mobile devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeLocations.map((location) => (
              <div key={location.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaStore className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">{location.name}</h3>
      </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{location.address}</p>
      </div>
      
                  <div className="flex items-center">
                    <FaPhone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <a href={`tel:${location.phone}`} className="text-sm text-blue-400 hover:text-blue-300">
                      {location.phone}
                    </a>
        </div>
        
                  <div className="flex items-start">
                    <FaClock className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{location.hours}</p>
              </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1">
                    {location.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 via-orange-500 to-yellow-500 py-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 via-orange-500 to-yellow-500 animate-gradient" style={{ backgroundSize: '200% auto' }}></div>
        
        {/* Floating shapes */}
        <div className="absolute top-5 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-5 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce animation-delay-2000"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Find Your Perfect Device?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of smartphones, tablets, and accessories. Expert advice and unbeatable prices guaranteed!
          </p>
          <Link to="/products">
            <button className="group/cta relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50">
              {/* Glassy shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
              <FaTags className="mr-2 relative z-10 group-hover/cta:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Shop All Products</span>
            </button>
          </Link>
        </div>
      </div>
      

    </div>
  );
};

export default Home;
