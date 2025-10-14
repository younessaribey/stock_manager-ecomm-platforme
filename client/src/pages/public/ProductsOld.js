import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Add this line to get navigate function

  useEffect(() => {
    const loadRealData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5050/api/products/public');
        setProducts(response.data);
        
        // Get unique categories
        const uniqueCategories = [...new Set(response.data.map(product => 
          product.category ? product.category.name : 'Uncategorized'
        ))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products from database');
        // If there's an error, we still want to stop loading
        setLoading(false);
      }
    };

    // Load real data from API
    loadRealData();
    
  }, []);

  const addToCart = async (productId) => {
    if (!currentUser) {
      // Redirect to login page instead of just showing a notification
      toast.info('Please sign in to add items to your cart');
      navigate('/login', { state: { from: `/products` } }); // Redirect with state to return after login
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
      // Redirect to login page instead of just showing a notification
      toast.info('Please sign in to add items to your wishlist');
      navigate('/login', { state: { from: `/products` } }); // Redirect with state to return after login
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

  const filteredProducts = products
    .filter(product => !selectedCategory || 
      (product.category && product.category.name === selectedCategory) || 
      (!product.category && selectedCategory === 'Uncategorized'))
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                {product.imageUrl ? (
                  <>
                    <img 
                      src={getUploadedImageUrl(product.imageUrl)} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // If image fails to load, replace with local placeholder
                        e.target.onerror = null;
                        e.target.src = '/assets/product-md.jpg';
                        console.log('Image failed to load:', product.imageUrl);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {product.quantity <= 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                    Out of Stock
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 h-12 overflow-hidden">
                  {product.description || 'No description available'}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.quantity <= 0}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      product.quantity > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart className="mr-2 -ml-1 h-4 w-4" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => addToWishlist(product.id)}
                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <FaHeart className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
