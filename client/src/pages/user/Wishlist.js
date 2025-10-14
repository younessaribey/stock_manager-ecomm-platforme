import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { wishlistAPI, cartAPI } from '../../utils/api';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await wishlistAPI.get();
        // The backend returns { userId, items: [ { productId } ] }
        const items = res.data.items || [];
        // Optionally: fetch product details for each item (if needed)
        setWishlistItems(items);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      // First update local state for immediate feedback
      const updatedItems = wishlistItems.filter(item => item.productId !== productId);
      setWishlistItems(updatedItems);
      
      // Find the exact item to be removed
      const itemToRemove = wishlistItems.find(item => item.productId === productId);
      
      if (itemToRemove) {
        // Call API to remove specific item from wishlist
        await wishlistAPI.update([
          {
            productId: itemToRemove.productId,
            operation: 'remove' // Signal to backend this is a removal
          }
        ]);
      } else {
        // Fallback if item not found - update entire wishlist
        await wishlistAPI.update(updatedItems);
      }
      
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (item) => {
    try {
      // First get current cart
      const cartResponse = await cartAPI.get();
      const currentCart = cartResponse.data.items || [];
      
      // Check if item already exists in cart
      const existingItem = currentCart.find(cartItem => 
        cartItem.productId === (item.productId || item.id)
      );
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedCart = currentCart.map(cartItem => {
          if (cartItem.productId === (item.productId || item.id)) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1
            };
          }
          return cartItem;
        });
        
        await cartAPI.update(updatedCart);
      } else {
        // Add new item to cart
        const updatedCart = [...currentCart, {
          productId: item.productId || item.id,
          quantity: 1
        }];
        
        await cartAPI.update(updatedCart);
      }
      
      toast.success(`${item.product?.name || item.name || item.productId} added to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-indigo-500 mb-4">
            <FaHeart className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Browse our products and add items to your wishlist</p>
          <Link 
            to="/user/products" 
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {wishlistItems.map((item) => {
  const product = item.product || {};
  return (
            <li key={item.id} className="p-4 sm:p-6 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                {/* Product Image */}
                <div className="flex-shrink-0 w-full sm:w-16 h-16 mb-4 sm:mb-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
                
                {/* Product Details */}
                <div className="ml-0 sm:ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/user/products/${product.id}`} className="hover:text-indigo-600">{product.name}</Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{!isNaN(Number(product.price)) ? `$${Number(product.price).toFixed(2)}` : 'N/A'}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="text-lg font-semibold text-gray-900">{!isNaN(Number(product.price)) ? `$${Number(product.price).toFixed(2)}` : 'N/A'}</p>
                      <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                      item.stock > 0 
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart className="mr-1.5 -ml-0.5 h-4 w-4" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FaTrash className="mr-1.5 -ml-0.5 h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );})
          }
        </ul>
      </div>
    </div>
  );
};

export default Wishlist;
