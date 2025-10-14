import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
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
  FaChevronUp
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const Products = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false); // Filters collapsed by default

  const [expandedCategories, setExpandedCategories] = useState({});

  const { t } = useLanguage() || {};
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5050/api/products/public'),
          axios.get('http://localhost:5050/api/categories')
        ]);
        
        setProducts(productsResponse.data);
        
        // Organize categories with subcategories
        const mainCategories = categoriesResponse.data.filter(cat => !cat.parentId);
        const organizedCategories = mainCategories.map(mainCat => ({
          ...mainCat,
          subcategories: categoriesResponse.data.filter(cat => cat.parentId === mainCat.id)
        }));
        
        setCategories(organizedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase();
    if (name?.includes('smartphone') || name?.includes('phone')) return <FaMobileAlt />;
    if (name?.includes('tablet')) return <FaTabletAlt />;
    if (name?.includes('laptop')) return <FaLaptop />;
    if (name?.includes('watch')) return <FaClock />;
    if (name?.includes('accessoire')) return <FaPlug />;
    return <FaBox />;
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const addToCart = async (productId) => {
    try {
      // For now, just show success message and redirect to checkout
      toast.success(translate('addedToCart'));
      navigate(`/checkout/${productId}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(translate('addToCartError'));
    }
  };



  const filteredAndSortedProducts = products
    .filter(product => {
      // Category filter
      if (selectedMainCategory) {
        if (selectedSubcategory) {
          return product.categoryId === parseInt(selectedSubcategory);
        } else {
          const mainCat = categories.find(cat => cat.id === parseInt(selectedMainCategory));
          const categoryIds = [mainCat?.id, ...(mainCat?.subcategories?.map(sub => sub.id) || [])];
          return categoryIds.includes(product.categoryId);
        }
      }
      
      return true;
    })
    .filter(product => {
      // Search filter
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .filter(product => {
      // Price filter
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
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
    setPriceRange([0, 2000]);
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
      <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      {/* Header */}
      <div className={`shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Brothers Phone Shop</h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Discover our amazing collection of devices</p>
            </div>
            
            {/* View Toggle & Sort */}
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Filter Toggle Button - Mobile & Desktop */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <FaFilter />
                <span className="hidden sm:inline">Filters</span>
                {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
              </button>

              <div className={`flex items-center rounded-lg p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? (isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm text-blue-600') : (isDark ? 'text-gray-300' : 'text-gray-600')}`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? (isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm text-blue-600') : (isDark ? 'text-gray-300' : 'text-gray-600')}`}
                >
                  <FaList />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Collapsible Sidebar Filters */}
          {showFilters && (
            <div className="lg:w-80 animate-in slide-in-from-left duration-300">
              <div className={`rounded-xl shadow-sm p-6 sticky top-24 z-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-lg font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <FaFilter className="mr-2 text-blue-600" />
                    Filters
                  </h2>
                  {(selectedMainCategory || selectedSubcategory || searchTerm || priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Clear All
                    </button>
                  )}
                </div>

              {/* Search */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Search</label>
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Categories - Shadcn Style */}
              <div className="mb-6">
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Categories</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className={`rounded-lg border overflow-hidden ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
                      <button
                        onClick={() => {
                          if (selectedMainCategory === category.id.toString()) {
                            setSelectedMainCategory('');
                            setSelectedSubcategory('');
                          } else {
                            setSelectedMainCategory(category.id.toString());
                            setSelectedSubcategory('');
                          }
                          toggleCategoryExpansion(category.id);
                        }}
                        className={`w-full flex items-center justify-between p-3 text-left transition-all ${
                          isDark
                            ? selectedMainCategory === category.id.toString()
                              ? 'bg-gray-600 text-white border-l-4 border-l-blue-600'
                              : 'text-gray-300 hover:bg-gray-600'
                            : selectedMainCategory === category.id.toString()
                              ? 'bg-slate-100 text-slate-900 border-l-4 border-l-blue-600'
                              : 'text-gray-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`mr-3 text-lg ${selectedMainCategory === category.id.toString() ? 'text-blue-600' : ''}`}>
                            {getCategoryIcon(category.name)}
                          </span>
                          <span className="font-semibold text-sm">{category.name}</span>
                        </div>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <span className={`text-xs ${selectedMainCategory === category.id.toString() ? 'text-blue-600' : (isDark ? 'text-gray-400' : 'text-gray-400')}`}>
                            {expandedCategories[category.id] ? <FaChevronUp /> : <FaChevronDown />}
                          </span>
                        )}
                      </button>
                      
                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && 
                       (selectedMainCategory === category.id.toString() || expandedCategories[category.id]) && (
                        <div className={`border-t p-2 space-y-1 ${isDark ? 'border-gray-600 bg-gray-600' : 'border-gray-100 bg-slate-50'}`}>
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => {
                                setSelectedMainCategory(category.id.toString());
                                setSelectedSubcategory(
                                  selectedSubcategory === subcategory.id.toString() ? '' : subcategory.id.toString()
                                );
                              }}
                              className={`w-full text-left px-4 py-2 rounded-md text-xs font-medium transition-all ${
                                selectedSubcategory === subcategory.id.toString()
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : isDark
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                              }`}
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {filteredAndSortedProducts.length} Products Found
                </h3>
                {(selectedMainCategory || selectedSubcategory) && (
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
              <div className={`rounded-xl shadow-sm p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-6xl text-gray-300 mb-4">📱</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No products found</h3>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters or search terms</p>
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
                    onAddToCart={addToCart}
                    isDark={isDark}
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

const ProductCard = ({ product, viewMode, onAddToCart, isDark }) => {
  const { t } = useLanguage() || {};
  const isOutOfStock = product.quantity <= 0;
  
  // Fallback translation function
  const translate = (key) => {
    if (typeof t === 'function') {
      return t(key);
    }
    // Fallback translations
    const fallbacks = {
      'addToCart': 'Add to Cart',
      'viewMore': 'View More',
      'outOfStock': 'Out of Stock'
    };
    return fallbacks[key] || key;
  };
  const isAppleProduct = product.category?.name?.toLowerCase().includes('apple');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all product images
  const getAllImages = () => {
    const images = [product.imageUrl];
    if (product.images) {
      try {
        const additionalImages = JSON.parse(product.images);
        images.push(...additionalImages);
      } catch (e) {
        console.error('Error parsing additional images:', e);
      }
    }
    return images.filter(Boolean);
  };

  const allImages = getAllImages();

  if (viewMode === 'list') {
    return (
      <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex">
          <div className="relative w-48 h-32 group">
            {allImages.length > 0 ? (
              <>
                <img 
                  src={getUploadedImageUrl(allImages[currentImageIndex])} 
                  alt={`${product.name} ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/product-md.jpg';
                  }}
                />
                
                {/* Image Navigation - List View */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ›
                    </button>
                    
                    {/* Image Dots */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {allImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
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
          </div>
          
          <div className="flex-1 p-4 flex justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
              <p className={`text-sm mb-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {product.description || 'No description available'}
              </p>
              
              <div className={`flex items-center space-x-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${parseFloat(product.price).toFixed(2)}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </div>
              </div>
              
              <div className="space-y-2">
                {/* Primary Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product.id)}
                  disabled={isOutOfStock}
                  className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isOutOfStock 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                      : isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md'
                  } h-9 px-4 py-2`}
                >
                  <FaShoppingCart className="mr-2 w-3.5 h-3.5" />
                  {isOutOfStock ? translate('outOfStock') : translate('addToCart')}
                </button>
                
                {/* See More Button */}
                <Link
                  to={`/checkout/${product.id}`}
                  className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 h-9 px-4 py-2 ${
                    isDark
                      ? 'border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500'
                  }`}
                >
                  <FaEye className="w-3.5 h-3.5 mr-2" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border h-full flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        {allImages.length > 0 ? (
          <>
            <img 
              src={getUploadedImageUrl(allImages[currentImageIndex])} 
              alt={`${product.name} ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/product-md.jpg';
              }}
            />
            
            {/* Image Navigation - Grid View */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ›
                </button>
                
                {/* Image Dots - Grid View */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
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
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {product.storage && (
            <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              📱 {product.storage}
            </span>
          )}
          {product.color && (
            <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
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
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${parseFloat(product.price).toFixed(2)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-auto">
          {/* Primary Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={isOutOfStock}
            className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isOutOfStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                : isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md'
            } h-10 px-4 py-2`}
          >
            <FaShoppingCart className="mr-2 w-4 h-4" />
            {isOutOfStock ? translate('outOfStock') : translate('addToCart')}
          </button>
          
          {/* See More Button */}
          <Link
            to={`/checkout/${product.id}`}
            className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 h-10 px-4 py-2 ${
              isDark
                ? 'border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500'
            }`}
          >
            <FaEye className="w-4 h-4 mr-2" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
