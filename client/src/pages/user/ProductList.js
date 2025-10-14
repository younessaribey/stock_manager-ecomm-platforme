import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaHeart, FaShoppingCart, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { productsAPI, categoriesAPI, wishlistAPI, cartAPI } from '../../utils/api';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const ProductList = () => {
  // Don't block product fetching for guests
// Removed unused currentUser
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  // const [fullPriceRange, setFullPriceRange] = useState({ min: 0, max: 1000 }); // Not used, remove or re-add if needed
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch categories from backend
        const categoriesRes = await categoriesAPI.getAll();
        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        } else if (categoriesRes.data && categoriesRes.data.categories) {
          setCategories(categoriesRes.data.categories);
        }
        // Fetch products from backend
        const productsRes = await productsAPI.getAll();
        setProducts(productsRes.data);
        // Dynamically set price range based on fetched products
        if (productsRes.data.length > 0) {
          const prices = productsRes.data.map(p => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          // setFullPriceRange({ min, max }); // Removed: fullPriceRange not used
          setPriceRange({ min, max });
        }
      } catch (error) {
        // Removed debug log
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products
    .filter(product => {
      // Search term filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      
      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      // Sort order
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortBy === 'quantity') {
        return sortOrder === 'asc' 
          ? a.quantity - b.quantity 
          : b.quantity - a.quantity;
      }
      return 0;
    });

  // Add to cart handler

const handleAddToCart = async (productId) => {
    try {
      // Get current cart from backend
      const cartRes = await cartAPI.get();
      const currentItems = cartRes.data.items || [];
      const existing = currentItems.find(item => item.productId === productId);
      let updatedItems;
      if (existing) {
        updatedItems = currentItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...currentItems, { productId, quantity: 1 }];
      }
      await cartAPI.update(updatedItems);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart.');
    }
  };

  // Add to wishlist handler
  const handleAddToWishlist = async (productId) => {
    try {
      // Get current wishlist
      const wishlistRes = await wishlistAPI.get();
      const currentItems = wishlistRes.data.items || [];
      // Add new product if not already in wishlist
      if (!currentItems.some(item => item.productId === productId)) {
        const updatedItems = [...currentItems, { productId }];
        await wishlistAPI.update(updatedItems);
        toast.success('Added to wishlist!');
      } else {
        toast.info('Product is already in your wishlist.');
      }
    } catch (error) {
      toast.error('Failed to add to wishlist.');
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">
          Products
          {selectedCategory && <span className="ml-2 text-indigo-600">/ {selectedCategory}</span>}
        </h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-amber-100 text-gray-800 rounded-md hover:bg-amber-200"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange.min} - ${priceRange.max}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange({ min: 0, max: 1000 });
                  setSearchTerm('');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link to={`/products/${product.id}`}>
                <div className="relative h-48">
                  <img 
                    src={getUploadedImageUrl(product.imageUrl)} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Industrial+Equipment';
                    }}
                  />
                  {product.quantity < 10 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                      Low Stock: {product.quantity}
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 mr-2 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product.id)}
                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 bg-white hover:bg-gray-50"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setPriceRange({ min: 0, max: 1000 });
              setSearchTerm('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
