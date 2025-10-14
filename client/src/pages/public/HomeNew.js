import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaMapMarkerAlt, FaPhone, FaClock, FaShoppingCart, FaHeart, FaArrowRight, FaStore, FaTabletAlt, FaLaptop, FaHeadphones, FaRegCheckCircle, FaStar, FaFire, FaTags } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSite } from '../../contexts/SiteContext';
import { useAuth } from '../../contexts/AuthContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const Home = () => {
  const { siteName } = useSite();
  const { currentUser } = useAuth();
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
    if (!currentUser) {
      toast.info('Please sign in to add items to your cart');
      return;
    }
    
    try {
      await axios.post('http://localhost:5050/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };
  
  const addToWishlist = async (productId) => {
    if (!currentUser) {
      toast.info('Please sign in to add items to your wishlist');
      return;
    }
    
    try {
      await axios.post('http://localhost:5050/api/wishlist', {
        productId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      toast.success('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
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

  // Define phone categories
  const categories = [
    {
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      title: 'Smartphones',
      description: 'Latest iPhones, Samsung Galaxy, Google Pixel and more. New and pre-owned devices available.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <FaTabletAlt className="w-8 h-8 text-green-600" />,
      title: 'Tablets',
      description: 'iPads, Android tablets and e-readers for work, study and entertainment.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: <FaLaptop className="w-8 h-8 text-purple-600" />,
      title: 'Laptops',
      description: 'MacBooks, Windows laptops and Chromebooks for all your computing needs.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: <FaHeadphones className="w-8 h-8 text-orange-600" />,
      title: 'Accessories',
      description: 'Cases, chargers, headphones, screen protectors and all mobile accessories.',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Hero Section - eBay/Mobile App Style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-8 h-8 bg-blue-300 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-10 right-1/4 w-6 h-6 bg-green-400 rounded-full opacity-20 animate-bounce delay-1000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8 animate-pulse border border-white/20">
              <FaMobileAlt className="mr-2 h-4 w-4 animate-bounce" />
              #1 Phone Store in Your Area ⭐⭐⭐⭐⭐
            </div>
            
            {/* Main Title with Animation */}
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
              <span className="block mb-2">Brothers Phone</span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                Shop
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
              🔥 <span className="font-bold text-yellow-300">Unbeatable Deals</span> on smartphones, tablets & accessories!<br/>
              <span className="text-lg">New & Pre-owned devices • Expert repairs • 4 convenient locations</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/products"
                className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-10 py-5 rounded-2xl text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-500"></div>
                <FaArrowRight className="mr-3 group-hover:translate-x-2 transition-transform relative z-10" />
                <span className="relative z-10">Shop Now - Best Deals! 💯</span>
              </Link>
              <Link
                to="#locations"
                className="bg-white/10 backdrop-blur-sm text-white font-semibold px-10 py-5 rounded-2xl text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
              >
                📍 Find Store Near You
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center">
                <FaRegCheckCircle className="mr-2 text-green-400" />
                25,000+ Happy Customers
              </div>
              <div className="flex items-center">
                <FaRegCheckCircle className="mr-2 text-green-400" />
                100K+ Devices Sold
              </div>
              <div className="flex items-center">
                <FaRegCheckCircle className="mr-2 text-green-400" />
                10+ Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories - Mobile App Style */}
      <div className="relative -mt-12 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to="/products"
                className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Deals Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold mb-4 animate-pulse">
              <FaFire className="mr-2" />
              HOT DEALS 🔥
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of smartphones and accessories at amazing prices!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative">
                  <img
                    src={getUploadedImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Phone';
                    }}
                  />
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
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => addToWishlist(product.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FaHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-black text-blue-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <div className="ml-2 flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-3 h-3" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Locations Section */}
      <div id="locations" className="bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold mb-4">
              <FaMapMarkerAlt className="mr-2" />
              VISIT US
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Find Your Perfect Device?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of smartphones, tablets, and accessories. Expert advice and unbeatable prices guaranteed!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-10 py-5 bg-yellow-400 text-black font-bold rounded-2xl text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <FaTags className="mr-3" />
            Shop All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
