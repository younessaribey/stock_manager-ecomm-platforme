import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaPhone, FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
// import { useLanguage } from '../../contexts/LanguageContext'; // Removed as unused
import { useTheme } from '../../contexts/ThemeContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const OnePageCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // const { t } = useLanguage(); // Removed as it's not used
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    wilaya: '',
    quantity: 1,
    notes: ''
  });
  const [orderLoading, setOrderLoading] = useState(false);

  // Algeria wilayas
  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane"
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/api/products/${id}/public`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      const orderData = {
        ...orderForm,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        totalPrice: product.price * orderForm.quantity
      };

      await axios.post('http://localhost:5050/api/algeria-orders', orderData);
      
      alert('🎉 Order placed successfully! We will contact you soon.');
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ Error placing order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const getAllImages = () => {
    if (!product) return [];
    
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
        console.log('Parsed additional images:', additionalImages);
      } catch (e) {
        console.log('Error parsing additional images:', e);
      }
    }
    
    console.log('Total images for product:', images.length, images);
    return images.filter(Boolean);
  };

  const allImages = getAllImages();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-6">
              <div className="mb-4 relative group">
                <img
                  src={getUploadedImageUrl(allImages[currentImageIndex]) || '/assets/product-lg.jpg'}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                
                {/* Navigation arrows for multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      ›
                    </button>
                    
                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                      {currentImageIndex + 1}/{allImages.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <img
                      key={index}
                      src={getUploadedImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all hover:scale-105 ${
                        currentImageIndex === index 
                          ? 'border-yellow-500 shadow-lg ring-2 ring-yellow-400/50' 
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              {/* Product Details */}
              <div className="mt-6">
                <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h1>
                <p className="text-2xl font-bold text-blue-600 mb-4">{product.price} DA</p>
                
                <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {product.model && (
                    <p><span className="font-semibold">Model:</span> {product.model}</p>
                  )}
                  {product.storage && (
                    <p><span className="font-semibold">Storage:</span> {product.storage}</p>
                  )}
                  {product.color && (
                    <p><span className="font-semibold">Color:</span> {product.color}</p>
                  )}
                  {product.condition && (
                    <p><span className="font-semibold">Condition:</span> {product.condition}</p>
                  )}
                  {product.batteryHealth && (
                    <p><span className="font-semibold">Battery Health:</span> {product.batteryHealth}%</p>
                  )}
                </div>

                {product.description && (
                  <div className="mt-4">
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Description:</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Form */}
            <div className={`p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Now</h2>
              
              <form onSubmit={handleOrder} className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FaUser className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={orderForm.customerName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FaPhone className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="0123456789"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FaEnvelope className="inline mr-2" />
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderForm.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Wilaya */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FaMapMarkerAlt className="inline mr-2" />
                    Wilaya *
                  </label>
                  <select
                    name="wilaya"
                    value={orderForm.wilaya}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={handleInputChange}
                    min="1"
                    max={product.quantity}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Available: {product.quantity} units</p>
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Any special requests or notes"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-white p-4 rounded-md border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(product.price * orderForm.quantity).toLocaleString()} DA
                    </span>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <FaShoppingCart className="mr-2" />
                  {orderLoading ? 'Placing Order...' : 'Place Order Now'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By placing an order, you agree to our terms and conditions. We will contact you to confirm your order.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnePageCheckout;
