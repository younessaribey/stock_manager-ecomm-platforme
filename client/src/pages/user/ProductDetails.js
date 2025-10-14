import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaHeart, FaShareAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // In a real app, we would fetch from API
        // For demo, we'll use static data
        
        // Mock product data based on ID
        const mockProduct = {
          id: parseInt(id),
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Featuring Bluetooth 5.0 connectivity, touch controls, and premium sound quality with deep bass and crystal clear highs.',
          category: 'Electronics',
          price: 149.99,
          quantity: 45,
          imageUrl: 'https://via.placeholder.com/600',
          rating: 4.5,
          reviews: 128,
          specifications: [
            { name: 'Brand', value: 'SoundMaster' },
            { name: 'Model', value: 'WH-1000XM5' },
            { name: 'Color', value: 'Black' },
            { name: 'Battery Life', value: '30 hours' },
            { name: 'Connectivity', value: 'Bluetooth 5.0' },
            { name: 'Weight', value: '254g' }
          ]
        };
        
        setProduct(mockProduct);
        
        // Mock related products
        setRelatedProducts([
          {
            id: 3,
            name: 'Mechanical Keyboard',
            price: 99.99,
            imageUrl: 'https://via.placeholder.com/300'
          },
          {
            id: 4,
            name: 'Wireless Mouse',
            price: 59.99,
            imageUrl: 'https://via.placeholder.com/300'
          },
          {
            id: 6,
            name: 'External Hard Drive',
            price: 79.99,
            imageUrl: 'https://via.placeholder.com/300'
          }
        ]);
        
        setLoading(false);
        
        // Simulate checking if in wishlist
        setInWishlist(Math.random() > 0.5);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // In a real app, we would call API to add product to cart
    toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
  };

  const handleToggleWishlist = () => {
    // In a real app, we would call API to add/remove from wishlist
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const handleShare = () => {
    // In a real app, we would implement sharing functionality
    // For demo, we'll just copy the URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
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
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/products" className="text-gray-600 hover:text-indigo-600">
                Products
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to={`/products?category=${product.category}`} className="text-gray-600 hover:text-indigo-600">
                {product.category}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>
      
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="p-6 flex items-center justify-center bg-gray-50">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : index < product.rating
                        ? 'text-yellow-300'
                        : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Availability</h3>
              {product.quantity > 0 ? (
                <p className="text-green-600">
                  {product.quantity > 10 
                    ? 'In Stock' 
                    : `Only ${product.quantity} left in stock - order soon`}
                </p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`p-2 border border-gray-300 rounded-l-md ${
                    quantity <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaMinus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={product.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0 && val <= product.quantity) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 p-2 text-center border-t border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                  className={`p-2 border border-gray-300 rounded-r-md ${
                    quantity >= product.quantity ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  product.quantity === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`p-3 border rounded-md shadow-sm ${
                  inWishlist
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <FaHeart className={inWishlist ? 'text-red-500' : ''} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                <FaShareAlt />
              </button>
            </div>
            
            {/* Specifications */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-500">{spec.name}</span>
                    <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link to={`/products/${product.id}`}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
