import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { cartAPI, productsAPI, ordersAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const Cart = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Call the fetchCartData function on component mount
    fetchCartData();
  }, []);

  const calculateTotals = (items) => {
    // Calculate subtotal from items, handling different data structures
    const itemSubtotal = items.reduce((acc, item) => {
      // Get the price, either from item directly or from product
      const price = item.product ? Number(item.product.price) : Number(item.price);
      const quantity = Number(item.quantity) || 1;
      
      // Only add to total if price is a valid number
      return acc + (!isNaN(price) ? price * quantity : 0);
    }, 0);
    
    const itemTax = itemSubtotal * 0.08; // Assuming 8% tax
    const itemTotal = itemSubtotal + itemTax;
    
    setSubtotal(itemSubtotal);
    setTax(itemTax);
    setTotal(itemTotal);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // First update the local state for immediate feedback
      const updatedItems = cartItems.map(item => {
        if (item.id === itemId) {
          // Ensure quantity doesn't exceed stock
          const stock = item.stock || (item.product ? item.product.quantity : 10);
          const quantity = Math.min(newQuantity, stock);
          return { ...item, quantity };
        }
        return item;
      });
      
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
      
      // Prepare data for API update
      const apiItems = updatedItems.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity
      }));
      
      // Call API to update the cart
      await cartAPI.update(apiItems);
      
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  // Extract fetchCart to a standalone function to reuse it
  const fetchCartData = async () => {
    try {
      setLoading(true);
      
      // Get cart items from the API
      const cartResponse = await cartAPI.get();
      const cartData = cartResponse.data;
      
      // If cart items include product details, use them directly
      // Otherwise, we need to fetch product details for each item
      let itemsWithDetails = [];
      
      if (cartData && Array.isArray(cartData.items)) {
        // If the API returns items with complete product details
        if (cartData.items.length > 0 && cartData.items[0].product) {
          itemsWithDetails = cartData.items;
        } else {
          // If the API returns items with just productId, fetch product details
          const itemsPromises = cartData.items.map(async (item) => {
            try {
              const productRes = await productsAPI.getById(item.productId || item.id);
              return {
                ...item,
                product: productRes.data,
                // Ensure we have quantity
                quantity: item.quantity || 1,
                // Keep track of stock
                stock: productRes.data.quantity || 10 // Default stock if not provided
              };
            } catch (err) {
              console.error(`Error fetching product ${item.productId || item.id}:`, err);
              return item; // Return the item even if we couldn't get product details
            }
          });
          
          itemsWithDetails = await Promise.all(itemsPromises);
        }
      }
      
      setCartItems(itemsWithDetails);
      calculateTotals(itemsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Find the exact item to be removed
      const itemToRemove = cartItems.find(item => item.id === itemId);
      
      // First update local state for immediate feedback
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
      
      if (itemToRemove) {
        // Call API to remove specific item from cart
        await cartAPI.update([
          {
            productId: itemToRemove.productId || itemToRemove.id,
            operation: 'remove' // Signal to backend this is a removal
          }
        ]);
        
        // Refetch cart data for dynamic update
        await fetchCartData();
      } else {
        // Fallback if item not found - update entire cart
        const apiItems = updatedItems.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity
        }));
        
        await cartAPI.update(apiItems);
      }
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item');
      // Refresh cart on error to ensure UI is in sync
      await fetchCartData();
    }
  };

  const proceedToCheckout = async () => {
    // Validate cart is not empty before proceeding
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      setProcessingOrder(true);
      
      // Prepare order data
      const orderItems = cartItems.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        price: item.product ? Number(item.product.price) : Number(item.price)
      }));
      
      // Create order
      const orderData = {
        items: orderItems,
        total: total,
        status: 'pending'
      };
      
      // Submit order to API
      const response = await ordersAPI.create(orderData);
      
      if (response.data && response.data.id) {
        // Clear cart after successful order
        await cartAPI.update([]);
        
        // Show success message with order details
        toast.success(`Order #${response.data.id} placed successfully!`);
        
        // Refresh cart data to show empty cart
        await fetchCartData();
        
        // Stay on current page but display a success message
        // User can navigate to orders page manually if desired
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-indigo-500 mb-4">
            <FaShoppingBag className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Browse our products and add items to your cart</p>
          <Link 
            to="/user/products" 
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => {{
                const product = item.product || {};
                return (
                  <li key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                        <img 
                          src={getUploadedImageUrl(product.image || product.imageUrl)} 
                          alt={product.name} 
                          className="w-24 h-24 object-cover rounded"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="ml-0 sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link to={`/user/products/${product.id}`} className="hover:text-indigo-600">
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              ${!isNaN(Number(product.price)) ? Number(product.price).toFixed(2) : 'N/A'} each
                            </p>
                          </div>
                          
                          <div className="mt-4 sm:mt-0">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                              >
                                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M20 12H4"></path>
                                </svg>
                              </button>
                              
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                                disabled={item.quantity >= item.stock}
                              >
                                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M12 4v16m8-8H4"></path>
                                </svg>
                              </button>
                            </div>
                            
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              {!isNaN(Number(product.price)) ? `$${(Number(product.price) * item.quantity).toFixed(2)}` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="mt-4 sm:mt-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                          >
                            <FaTrash className="mr-1 h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }})}
            </ul>
            
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <Link to="/user/products" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div> 
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={proceedToCheckout}
                disabled={processingOrder}
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${processingOrder ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {processingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-2 -ml-1 h-5 w-5" />
                    Proceed to Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
