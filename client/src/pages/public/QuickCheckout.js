import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTruck, FaShieldAlt, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

import { productsAPI } from '../../utils/api';
import api from '../../utils/api';
import { getUploadedImageUrl, getBrandFallbackImage } from '../../utils/imageUtils';
import { algeriaWilayas } from '../../utils/algeriaWilayas';

const formatPriceDzd = (value) =>
  new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const QuickCheckout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getByIdPublic(productId);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to load product', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const CheckoutSchema = Yup.object({
    fullName: Yup.string().min(3, 'Enter your full name').required('Name is required'),
    phone: Yup.string()
      .matches(/^(0[5-7][0-9]{8})$/, 'Phone must be Algerian format (e.g. 0551234567)')
      .required('Phone is required'),
    wilaya: Yup.string().required('Wilaya is required'),
    quantity: Yup.number()
      .min(1, 'Minimum 1')
      .max(product?.quantity || 1, `Only ${product?.quantity || 1} in stock`)
      .required('Quantity required'),
  });

  const handleSubmit = async (values) => {
    if (!product) return;
    try {
      setSubmitting(true);
      const [firstName, ...rest] = values.fullName.trim().split(' ');
      const lastName = rest.join(' ') || '-';
      const totalPrice = Number(product.price) * values.quantity;

      const orderPayload = {
        firstName,
        lastName,
        phone: values.phone,
        wilaya: values.wilaya,
        address: 'Quick checkout request',
        quantity: values.quantity,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        totalPrice,
      };

      await api.post('/algeria-orders', orderPayload);
      toast.success('Order received! We will contact you soon.');
      navigate('/products');
    } catch (error) {
      console.error('Failed to submit order', error);
      toast.error(error.response?.data?.message || 'Unable to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.imageUrl
      ? getUploadedImageUrl(product.imageUrl)
      : getBrandFallbackImage(product.category?.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Continue shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getBrandFallbackImage(product.category?.name) || '/assets/product-lg.jpg';
                }}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                  {product.category?.name || 'Smartphone'}
                </span>
                <div className="text-sm text-gray-500">
                  Stock: {product.quantity > 0 ? `${product.quantity} pcs` : 'Out of stock'}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-2xl font-semibold text-blue-600">{formatPriceDzd(product.price)}</p>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Condition</p>
                  <p className="font-semibold text-gray-900 capitalize">{product.condition}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Storage</p>
                  <p className="font-semibold text-gray-900">{product.storage || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Color</p>
                  <p className="font-semibold text-gray-900">{product.color || 'Standard'}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Battery health</p>
                  <p className="font-semibold text-gray-900">
                    {product.batteryHealth ? `${product.batteryHealth}%` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaTruck className="text-blue-500" />
                  <span>Delivery everywhere in Algeria</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaShieldAlt className="text-blue-500" />
                  <span>Verified devices & warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Checkout</h2>
              <p className="text-gray-600">Leave your contact info and we call you back.</p>
            </div>

            <Formik
              initialValues={{
                fullName: '',
                phone: '',
                wilaya: '',
                quantity: 1,
              }}
              validationSchema={CheckoutSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Field
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="0551234567"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wilaya *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Field
                      as="select"
                      name="wilaya"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select wilaya</option>
                      {algeriaWilayas.map((wilaya) => (
                        <option key={wilaya.code} value={wilaya.name}>
                          {wilaya.code} - {wilaya.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage name="wilaya" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <Field
                    type="number"
                    name="quantity"
                    min="1"
                    max={product.quantity || 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Confirm order'}
                </button>

                <p className="text-center text-xs text-gray-500">
                  By submitting you accept to be contacted by our sales team to finalize the order.
                </p>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCheckout;

