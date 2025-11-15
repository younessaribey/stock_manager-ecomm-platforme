import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../utils/api';
import { getUploadedImageUrl } from '../../utils/imageUtils';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaExclamationTriangle, FaMobile, FaClock, FaBoxes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'instock', 'lowstock', 'outofstock'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch categories from server (with subcategories)
        const categoriesResponse = await categoriesAPI.getAll();
        console.log('Categories loaded:', categoriesResponse.data);
        setCategories(categoriesResponse.data);

        // Fetch products from server
        const productsResponse = await productsAPI.getAll();
        console.log('Products loaded:', productsResponse.data);
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback to mock data if API fails
        try {
          const { mockCategories, mockProducts } = await import('../../utils/mockData');
          console.log('Using mock data - Categories:', mockCategories, 'Products:', mockProducts);
          setCategories(mockCategories);
          setProducts(mockProducts);
          toast.error('Using demo data - API connection failed');
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
          toast.error('Failed to load products and categories');
        }
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Helper function to get category and subcategory info for a product
  const getProductCategoryInfo = (product) => {
    let mainCategory = null;
    let subcategory = null;
    
    // Find the category this product belongs to
    for (const category of categories) {
      // Check if product is in main category
      if (category.id === product.categoryId) {
        mainCategory = category;
        break;
      }
      // Check if product is in subcategory
      if (category.subcategories) {
        const foundSubcategory = category.subcategories.find(sub => sub.id === product.categoryId);
        if (foundSubcategory) {
          mainCategory = category;
          subcategory = foundSubcategory;
          break;
        }
      }
    }
    
    return { mainCategory, subcategory };
  };

  // Filter products based on search, category, and stock
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower) ||
      (product.model && product.model.toLowerCase().includes(searchLower)) ||
      (product.imei && product.imei.toLowerCase().includes(searchLower)) ||
      (product.serialNumber && product.serialNumber.toLowerCase().includes(searchLower));
    
    const { mainCategory, subcategory } = getProductCategoryInfo(product);
    
    const matchesCategory = selectedCategory ? 
      (mainCategory && mainCategory.name === selectedCategory) : true;
    
    const matchesSubcategory = selectedSubcategory ? 
      (subcategory && subcategory.name === selectedSubcategory) : true;
    
    const matchesStock = (() => {
      switch (stockFilter) {
        case 'instock': return product.quantity > 10;
        case 'lowstock': return product.quantity > 0 && product.quantity <= 10;
        case 'outofstock': return product.quantity === 0;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesStock;
  });

  // Group products by category for better organization
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const { mainCategory, subcategory } = getProductCategoryInfo(product);
    const groupKey = subcategory ? 
      `${mainCategory?.name} > ${subcategory.name}` : 
      mainCategory?.name || 'Uncategorized';
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(product);
    return groups;
  }, {});

  // Get available subcategories for selected main category
  const availableSubcategories = selectedCategory ? 
    categories.find(cat => cat.name === selectedCategory)?.subcategories || [] : [];

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete product with ID: ${id}`);
      
      // Call API to delete the product from the database
      const response = await productsAPI.delete(id);
      console.log('Delete API response:', response);
      
      // Update local state after successful deletion
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message || error);
      toast.error(`Failed to delete product: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      setConfirmDelete(null); // Close dialog even on error
    }
  };

  // Handle status change
  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productsAPI.update(productId, { status: newStatus });
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      ));
      
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your phone inventory and product listings</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, model, brand, IMEI, SN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FaBoxes className="mr-2" />
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            
            <div className="flex space-x-3">
              <Link
                to="/admin/products/wizard"
                className="flex items-center justify-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ✨ Smart Wizard
              </Link>
              <Link
                to="/admin/products/add"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Manual Add
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <FaMobile className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <FaBoxes className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter(p => p.quantity > 10).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <FaClock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter(p => p.quantity > 0 && p.quantity <= 10).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter(p => p.quantity === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Advanced Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory(''); // Reset subcategory when category changes
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter - Only show if category selected */}
            {selectedCategory && availableSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                >
                  <option value="">All Brands</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              >
                <option value="all">All Products</option>
                <option value="instock">In Stock (10+)</option>
                <option value="lowstock">Low Stock (1-10)</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
            
            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setStockFilter('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Products Display - Grouped by Category */}
      {Object.keys(groupedProducts).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
            <div key={categoryName} className="bg-white rounded-lg shadow-sm">
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaMobile className="h-5 w-5 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {categoryProducts.length} products
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Grid/Table View */}
              {viewMode === 'grid' ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => {
                      const { subcategory } = getProductCategoryInfo(product);
                      return (
                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                          {/* Product Image */}
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                            <img
                              src={getUploadedImageUrl(product.imageUrl)}
                              alt={product.name}
                              className="h-48 w-full object-cover object-center group-hover:opacity-95"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/product-md.jpg';
                              }}
                            />
                            {/* Stock Badge */}
                            <div className="absolute top-2 left-2">
                              {product.quantity === 0 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                                  Out of Stock
                                </span>
                              ) : product.quantity <= 10 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-500 text-white rounded-full">
                                  Low Stock ({product.quantity})
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
                                  In Stock ({product.quantity})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                              <span className="text-lg font-bold text-blue-600">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                            
                            {/* Brand Badge */}
                            {subcategory && (
                              <div className="mb-3">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {subcategory.name}
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                <Link
                                  to={`/admin/products/edit/${product.id}`}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                >
                                  <FaEdit className="mr-1" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => setConfirmDelete(product.id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  <FaTrash className="mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Table View */
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryProducts.map((product) => {
                        const { subcategory } = getProductCategoryInfo(product);
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={getUploadedImageUrl(product.imageUrl)} 
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/assets/product-md.jpg';
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {subcategory ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {subcategory.name}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ${parseFloat(product.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.quantity === 0 ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Out of Stock
                                </span>
                              ) : product.quantity <= 10 ? (
                                <div className="flex items-center">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Low Stock
                                  </span>
                                  <span className="ml-2 text-sm text-gray-900">{product.quantity}</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    In Stock
                                  </span>
                                  <span className="ml-2 text-sm text-gray-900">{product.quantity}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={product.status || 'available'}
                                onChange={(e) => handleStatusChange(product.id, e.target.value)}
                                className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                                  product.status === 'sold' ? 'bg-red-100 text-red-800' :
                                  product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}
                              >
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <Link
                                  to={`/admin/products/edit/${product.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => setConfirmDelete(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaMobile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search terms or filters, or add your first product.</p>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Your First Phone
          </Link>
        </div>
      )}
      
      {/* Results Summary */}
      {Object.keys(groupedProducts).length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> of <span className="font-medium text-gray-900">{products.length}</span> products across <span className="font-medium text-gray-900">{Object.keys(groupedProducts).length}</span> {Object.keys(groupedProducts).length === 1 ? 'category' : 'categories'}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
