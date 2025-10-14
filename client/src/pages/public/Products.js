import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaShoppingBag, 
  FaSearch, 
  FaFilter, 
  FaTh, 
  FaList,
  FaMobileAlt,
  FaTabletAlt,
  FaLaptop,
  FaClock,
  FaPlug,
  FaBox,
  FaBatteryFull,
  FaEye,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaShoppingCart,
  FaHeart
} from 'react-icons/fa';
import { getUploadedImageUrl } from '../../utils/imageUtils';

// OrderForm import removed - now redirecting to product details

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Fixed to show all products including high-value items
  const [priceFilterEnabled, setPriceFilterEnabled] = useState(false); // Price filter disabled by default
  // const [showFilters, setShowFilters] = useState(false); // Unused for now
  const [expandedCategories, setExpandedCategories] = useState({});

  // Removed selectedProduct and showOrderForm since we redirect to product details

  // Add to cart function
  const addToCart = (productId) => {
    // For now, redirect to checkout page - you can implement cart logic later
    window.location.href = `/checkout/${productId}`;
  };

  // Add to wishlist function
  const addToWishlist = (productId) => {
    // Placeholder for wishlist functionality
    toast.success('Added to wishlist!');
    console.log('Added to wishlist:', productId);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load products and categories from API - FORCE API USAGE
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5050/api/products/public'),
          axios.get('http://localhost:5050/api/categories')
        ]);
        
        // Use real API data
        setProducts(productsResponse.data);
        
        // Organize categories with subcategories
        const mainCategories = categoriesResponse.data.filter(cat => !cat.parentId);
        const organizedCategories = mainCategories.map(mainCat => ({
          ...mainCat,
          subcategories: categoriesResponse.data.filter(cat => cat.parentId === mainCat.id)
        }));
        
        setCategories(organizedCategories);
        
        console.log(`✅ Loaded ${productsResponse.data.length} products from API`);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ API Error:', error);
        toast.error('Failed to load products. Please check if the server is running.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

<<<<<<< Updated upstream
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase();
    if (name?.includes('smartphone') || name?.includes('phone')) return <FaMobileAlt />;
    if (name?.includes('tablet')) return <FaTabletAlt />;
    if (name?.includes('laptop')) return <FaLaptop />;
    if (name?.includes('watch')) return <FaClock />;
    if (name?.includes('accessoire')) return <FaPlug />;
    return <FaBox />;
=======
  const addToCart = async (productId) => {
    // If not logged in, show login prompt
    if (!currentUser) {
      // Redirect to login page instead of just showing a notification
      toast.info('Please sign in to add items to your cart');
      navigate('/login', { state: { from: `/products` } }); // Redirect with state to return after login
      return;
    }
    
    try {
      // The server expects an items array in the format the updateCart controller requires
      await axios.put('http://localhost:5050/api/cart', {
        items: [{
          productId,
          quantity: 1
        }]
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
>>>>>>> Stashed changes
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleOrderNow = (product) => {
    // Redirect to product details page instead of opening order form directly
    window.location.href = `/products/${product.id}`;
  };

  const handleOrderSuccess = (orderData) => {
    console.log('Order placed successfully:', orderData);
    // You could save to localStorage or send to backend here
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      // Category filter - Enhanced logic with better debugging
      if (selectedMainCategory) {
        const mainCategoryId = parseInt(selectedMainCategory);
        
        if (selectedSubcategory) {
          // Filter by specific subcategory
          const subcategoryId = parseInt(selectedSubcategory);
          const productCategoryId = product.categoryId || product.category?.id;
          return productCategoryId === subcategoryId;
        } else {
          // Filter by main category and all its subcategories
          const mainCat = categories.find(cat => cat.id === mainCategoryId);
          if (mainCat) {
            const categoryIds = [mainCat.id];
            if (mainCat.subcategories && mainCat.subcategories.length > 0) {
              categoryIds.push(...mainCat.subcategories.map(sub => sub.id));
            }
            const productCategoryId = product.categoryId || product.category?.id;
            return categoryIds.includes(productCategoryId);
          }
        }
      }
      
      return true;
    })
    .filter(product => {
      // Search filter
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(term) ||
             (product.description && product.description.toLowerCase().includes(term));
    })
    .filter(product => {
      // Price filter - only apply if enabled
      if (priceFilterEnabled) {
        const price = parseFloat(product.price);
        return price >= priceRange[0] && price <= priceRange[1];
      }
      return true; // Show all products if price filter is disabled
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSelectedMainCategory('');
    setSelectedSubcategory('');
    setSearchTerm('');
    setPriceRange([0, 1000000]); // Updated to match default
    setPriceFilterEnabled(false); // Disable price filter
    setSortBy('name');
  };

  const getSelectedMainCategory = () => {
    return categories.find(cat => cat.id === parseInt(selectedMainCategory));
  };

  const getSelectedSubcategories = () => {
    const mainCat = getSelectedMainCategory();
    return mainCat?.subcategories || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Brothers Phone Shop
              </h1>
              <p className="text-gray-600">Discover our amazing collection of devices</p>
            </div>
            
            {/* View Toggle & Sort */}
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  <FaList />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Horizontal Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          {/* Filter Header Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaFilter className="mr-3" />
                Filters & Search
              </h2>
              {(selectedMainCategory || selectedSubcategory || searchTerm || priceFilterEnabled) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center transition-all"
                >
                  <FaTimes className="mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-6">
            {/* Top Row: Search and Price Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Price Filter with Toggle */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-800 flex items-center">
                    <FaFilter className="mr-2 text-blue-600" />
                    Price Filter
                  </label>
                  <button
                    onClick={() => setPriceFilterEnabled(!priceFilterEnabled)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${
                      priceFilterEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                      priceFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {priceFilterEnabled ? (
                  <>
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => {
                          setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]);
                          setPriceFilterEnabled(true);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => {
                          setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000]);
                          setPriceFilterEnabled(true);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Toggle on to filter by price
                  </p>
                )}
              </div>
            </div>

            {/* Categories Row */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (selectedMainCategory === category.id.toString()) {
                        setSelectedMainCategory('');
                        setSelectedSubcategory('');
                      } else {
                        setSelectedMainCategory(category.id.toString());
                        setSelectedSubcategory('');
                      }
                    }}
                    className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                      selectedMainCategory === category.id.toString() 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2 text-xl">
                      {getCategoryIcon(category.name)}
                    </span>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Subcategories - Only show if main category is selected */}
              {selectedMainCategory && getSelectedMainCategory() && getSelectedMainCategory().subcategories && getSelectedMainCategory().subcategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {getSelectedMainCategory().name} Subcategories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedMainCategory().subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          setSelectedSubcategory(
                            selectedSubcategory === subcategory.id.toString() ? '' : subcategory.id.toString()
                          );
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSubcategory === subcategory.id.toString()
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredAndSortedProducts.length} Products Found
                </h3>
                {(selectedMainCategory || selectedSubcategory) && (
                  <p className="text-sm text-gray-600 mt-1">
                    in {selectedSubcategory ? 
                      getSelectedSubcategories().find(sub => sub.id.toString() === selectedSubcategory)?.name :
                      getSelectedMainCategory()?.name
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl text-gray-300 mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                    onOrderNow={handleOrderNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, viewMode, onOrderNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const isOutOfStock = product.quantity <= 0;
  const isAppleProduct = product.category?.name?.toLowerCase().includes('apple');

  // Function to get all available images
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
        console.log('Error parsing additional images:', e);
      }
    }
    
    return images.filter(Boolean);
  };

  const allImages = getAllImages();

  // Add to cart function
  const addToCart = (productId) => {
    // For now, redirect to checkout page - you can implement cart logic later
    window.location.href = `/checkout/${productId}`;
  };

  // Add to wishlist function
  const addToWishlist = (productId) => {
    // Placeholder for wishlist functionality
    toast.success('Added to wishlist!');
    console.log('Added to wishlist:', productId);
  };

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
  }, [product.id]); // Reset when product changes

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex">
          <div 
            className="relative w-48 h-32 group"
            onMouseEnter={() => {
              setIsHovered(true);
              setShowButtons(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setShowButtons(false);
            }}
          >
            {allImages.length > 0 ? (
              <>
                <img 
                  src={getUploadedImageUrl(allImages[currentImageIndex])} 
                  alt={`${product.name} ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/product-md.jpg';
                  }}
                />
                
                {/* Navigation arrows for multiple images - Mobile responsive */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
                      }}
                      className="!absolute !left-2 !top-1/2 !-translate-y-1/2 !bg-white !text-black !rounded-full !w-10 !h-10 !flex !items-center !justify-center !shadow-xl !border-2 !border-gray-800 hover:!bg-gray-100 !transition-all !duration-300 !text-2xl !font-bold !z-50 !opacity-100 !visible"
                      style={{ 
                        display: 'flex !important',
                        visibility: 'visible !important',
                        opacity: '1 !important',
                        pointerEvents: 'auto !important'
                      }}
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
                      }}
                      className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !bg-white !text-black !rounded-full !w-10 !h-10 !flex !items-center !justify-center !shadow-xl !border-2 !border-gray-800 hover:!bg-gray-100 !transition-all !duration-300 !text-2xl !font-bold !z-50 !opacity-100 !visible"
                      style={{ 
                        display: 'flex !important',
                        visibility: 'visible !important',
                        opacity: '1 !important',
                        pointerEvents: 'auto !important'
                      }}
                    >
                      →
                    </button>
                    
                    {/* Image counter - Always visible */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1}/{allImages.length}
                    </div>
                    
                    {/* Dot indicators for list view */}
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
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <FaBox className="text-gray-400 text-2xl" />
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                Out of Stock
              </div>
            )}
            
            {/* Hover Overlay with Action Buttons for List View */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
              showButtons ? 'opacity-100' : 'opacity-0'
            } md:opacity-0 md:group-hover:opacity-100`}>
              <div className="flex space-x-2 px-2">
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  disabled={isOutOfStock}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600'
                  }`}
                >
                  <FaShoppingCart className="mr-1 w-3 h-3" />
                  {isOutOfStock ? 'Out' : 'Cart'}
                </button>
                
                {/* See More Button */}
                <Link
                  to={`/checkout/${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-xs transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700"
                >
                  <FaEye className="mr-1 w-3 h-3" />
                  More
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 flex justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description || 'No description available'}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {product.storage && <span>📱 {product.storage}</span>}
                {product.color && <span>🎨 {product.color}</span>}
                {product.condition && <span>📦 {product.condition}</span>}
                {isAppleProduct && product.batteryHealth && (
                  <span className="flex items-center">
                    <FaBatteryFull className="mr-1 text-green-500" />
                    {product.batteryHealth}%
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-between items-end ml-4">
              <div className="text-right mb-2">
                <div className="text-2xl font-bold text-gray-900">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </div>
              </div>
              
              <div className="space-y-2">
                {/* Primary Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={isOutOfStock}
                  className={`w-full font-bold py-2 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-md text-center flex items-center justify-center ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-yellow-500/25'
                  }`}
                >
                  <FaShoppingCart className="mr-2 w-4 h-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                {/* Secondary Buttons Row */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToWishlist(product.id)}
                    className="flex-1 bg-gray-100 text-gray-700 font-medium py-1.5 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <FaHeart className="mr-1 w-3 h-3" />
                    Wishlist
                  </button>
                  
                  <Link
                    to={`/checkout/${product.id}`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-1.5 rounded-md hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center"
                  >
                    <FaEye className="mr-1 w-3 h-3" />
                    See More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      <div 
        className="relative h-48 bg-gray-100 overflow-hidden group"
        onMouseEnter={() => {
          setIsHovered(true);
          setShowButtons(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowButtons(false);
        }}
      >
        {allImages.length > 0 ? (
          <>
            <img 
              src={getUploadedImageUrl(allImages[currentImageIndex])} 
              alt={`${product.name} ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/product-md.jpg';
              }}
            />
            
            {/* Navigation arrows - always render when image exists */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
                  }}
                  className="!absolute !left-2 !top-1/2 !-translate-y-1/2 !bg-white !text-black !rounded-full !w-10 !h-10 !flex !items-center !justify-center !shadow-xl !border-2 !border-gray-800 hover:!bg-gray-100 !transition-all !duration-300 !text-2xl !font-bold !z-50 !opacity-100 !visible"
                  style={{ 
                    display: 'flex !important',
                    visibility: 'visible !important',
                    opacity: '1 !important',
                    pointerEvents: 'auto !important'
                  }}
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
                  }}
                  className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !bg-white !text-black !rounded-full !w-10 !h-10 !flex !items-center !justify-center !shadow-xl !border-2 !border-gray-800 hover:!bg-gray-100 !transition-all !duration-300 !text-2xl !font-bold !z-50 !opacity-100 !visible"
                  style={{ 
                    display: 'flex !important',
                    visibility: 'visible !important',
                    opacity: '1 !important',
                    pointerEvents: 'auto !important'
                  }}
                >
                  →
                </button>
                
                {/* Dot indicators - Mobile responsive */}
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
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <FaBox className="text-gray-400 text-3xl" />
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Hover Overlay with Action Buttons */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          showButtons ? 'opacity-100' : 'opacity-0'
        } md:opacity-0 md:group-hover:opacity-100`}>
          <div className="flex flex-col space-y-3 px-4">
            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              disabled={isOutOfStock}
              className={`px-6 py-3 rounded-xl font-bold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 hover:shadow-yellow-500/25'
              }`}
            >
              <FaShoppingCart className="mr-2 w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            {/* See More Button */}
            <Link
              to={`/checkout/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700"
            >
              <FaEye className="mr-2 w-4 h-4" />
              See More
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {product.storage && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              📱 {product.storage}
            </span>
          )}
          {product.color && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              🎨 {product.color}
            </span>
          )}
          {isAppleProduct && product.batteryHealth && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
              <FaBatteryFull className="mr-1" />
              {product.batteryHealth}%
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-auto">
          {/* Primary Add to Cart Button */}
          <button
            onClick={() => addToCart(product.id)}
            disabled={isOutOfStock}
            className={`w-full font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg text-center flex items-center justify-center ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-yellow-500/25'
            }`}
          >
            <FaShoppingCart className="mr-2 w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          {/* Secondary Buttons Row */}
          <div className="flex space-x-2">
            <button
              onClick={() => addToWishlist(product.id)}
              className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <FaHeart className="mr-2 w-4 h-4" />
              Wishlist
            </button>
            
            <Link
              to={`/checkout/${product.id}`}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center"
            >
              <FaEye className="mr-2 w-4 h-4" />
              See More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
