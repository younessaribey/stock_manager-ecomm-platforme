import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle, FaTruck, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Separator } from '../../components/ui/Separator';

const Checkout = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    // In a real app, we would fetch the cart from the API
    const fetchCart = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data for demonstration
          const items = [
            {
              id: 1,
              name: 'Wireless Bluetooth Headphones',
              price: 79.99,
              quantity: 1
            },
            {
              id: 2,
              name: 'USB-C Charging Cable',
              price: 24.99,
              quantity: 2
            }
          ];
          
          setCartItems(items);
          calculateTotals(items);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotals = (items) => {
    const itemSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemTax = itemSubtotal * 0.08; // Assuming 8% tax
    const itemTotal = itemSubtotal + itemTax;
    
    setSubtotal(itemSubtotal);
    setTax(itemTax);
    setTotal(itemTotal);
  };

  // Validation schema
  const CheckoutSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    address: Yup.string()
      .required('Address is required'),
    city: Yup.string()
      .required('City is required'),
    state: Yup.string()
      .required('State is required'),
    zipCode: Yup.string()
      .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
      .required('ZIP code is required'),
    cardName: Yup.string()
      .required('Name on card is required'),
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, 'Card number must be 16 digits')
      .required('Card number is required'),
    expDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
      .required('Expiration date is required'),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
      .required('CVV is required')
  });

  const handleSubmit = async (values) => {
    try {
      setProcessingOrder(true);
      
      // In a real app, we would submit the order to the API
      // Simulating API call with timeout
      setTimeout(() => {
        // Order successful
        toast.success('Order placed successfully!');
        navigate('/user/orders');
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`container mx-auto px-4 py-12 ${isDark ? 'text-white' : ''}`}>
        <Card className={`max-w-md mx-auto text-center ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardContent className="pt-12 pb-12">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <FaShoppingBag className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              You need to add items to your cart before checkout
            </p>
            <Link to="/user/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/user/cart" 
            className={`inline-flex items-center text-sm mb-4 hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Secure Checkout
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete your purchase securely
          </p>
        </div>

        {/* Trust Badges */}
        <div className={`mb-8 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <FaShieldAlt className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Secure Payment</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <FaTruck className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Free Shipping</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <FaCheckCircle className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Money-Back Guarantee</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <Formik
                initialValues={{
                  name: currentUser?.name || '',
                  email: currentUser?.email || '',
                  address: currentUser?.address || '',
                  city: '',
                  state: '',
                  zipCode: '',
                  cardName: '',
                  cardNumber: '',
                  expDate: '',
                  cvv: ''
                }}
                validationSchema={CheckoutSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <CardHeader>
                      <CardTitle className={isDark ? 'text-white' : ''}>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            1
                          </div>
                          Shipping Information
                        </div>
                      </CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : ''}>
                        Where should we deliver your order?
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="name" className={isDark ? 'text-gray-300' : ''}>Full Name</Label>
                          <Field name="name">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="name"
                                placeholder="John Doe"
                                error={errors.name && touched.name}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>Email Address</Label>
                          <Field name="email">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                error={errors.email && touched.email}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="address" className={isDark ? 'text-gray-300' : ''}>Street Address</Label>
                          <Field name="address">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="address"
                                placeholder="123 Main St"
                                error={errors.address && touched.address}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <Label htmlFor="city" className={isDark ? 'text-gray-300' : ''}>City</Label>
                          <Field name="city">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="city"
                                placeholder="New York"
                                error={errors.city && touched.city}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <Label htmlFor="state" className={isDark ? 'text-gray-300' : ''}>State</Label>
                          <Field name="state">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="state"
                                placeholder="NY"
                                error={errors.state && touched.state}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="zipCode" className={isDark ? 'text-gray-300' : ''}>ZIP Code</Label>
                          <Field name="zipCode">
                            {({ field }) => (
                              <Input
                                {...field}
                                id="zipCode"
                                placeholder="10001"
                                error={errors.zipCode && touched.zipCode}
                                className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="zipCode" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                      </div>

                      <Separator className={isDark ? 'bg-gray-700' : ''} />

                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            2
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              Payment Information
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Your payment is secure and encrypted
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="cardName" className={isDark ? 'text-gray-300' : ''}>Name on Card</Label>
                            <Field name="cardName">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  id="cardName"
                                  placeholder="John Doe"
                                  error={errors.cardName && touched.cardName}
                                  className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="cardName" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="cardNumber" className={isDark ? 'text-gray-300' : ''}>Card Number</Label>
                            <Field name="cardNumber">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  error={errors.cardNumber && touched.cardNumber}
                                  className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="cardNumber" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          
                          <div>
                            <Label htmlFor="expDate" className={isDark ? 'text-gray-300' : ''}>Expiration Date</Label>
                            <Field name="expDate">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  id="expDate"
                                  placeholder="MM/YY"
                                  error={errors.expDate && touched.expDate}
                                  className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="expDate" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          
                          <div>
                            <Label htmlFor="cvv" className={isDark ? 'text-gray-300' : ''}>CVV</Label>
                            <Field name="cvv">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  id="cvv"
                                  placeholder="123"
                                  error={errors.cvv && touched.cvv}
                                  className={isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="cvv" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || processingOrder}
                        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FaCreditCard className="mr-2 h-5 w-5" />
                        {isSubmitting || processingOrder ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                      </Button>

                      <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaLock className="w-4 h-4" />
                        <span>Your payment information is secure and encrypted</span>
                      </div>
                    </CardContent>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-white' : ''}>Order Summary</CardTitle>
                  <CardDescription className={isDark ? 'text-gray-400' : ''}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </p>
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${isDark ? 'bg-gray-600 text-gray-300' : ''}`}>
                            Qty: {item.quantity}
                          </Badge>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            ${item.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className={isDark ? 'bg-gray-700' : ''} />
                  
                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                      <Badge variant="success" className="text-xs">
                        FREE
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tax (8%)</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${tax.toFixed(2)}
                      </span>
                    </div>

                    <Separator className={isDark ? 'bg-gray-700' : ''} />
                    
                    <div className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
                      <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Total
                      </span>
                      <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className={`space-y-2 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        30-day money-back guarantee
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Free shipping on all orders
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        24/7 customer support
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
