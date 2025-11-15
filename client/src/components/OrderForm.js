import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaPhone, FaMapMarkerAlt, FaUser, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { algeriaWilayas } from '../utils/algeriaWilayas';
import { getUploadedImageUrl } from '../utils/imageUtils';
import api from '../utils/api';

const OrderForm = ({ product, onClose, onOrderSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  // Validation schema for Algeria
  const OrderSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom est trop long')
      .required('Le prénom est requis'),
    lastName: Yup.string()
      .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
      .max(50, 'Le nom de famille est trop long')
      .required('Le nom de famille est requis'),
    phone: Yup.string()
      .matches(/^(0[5-7][0-9]{8})$/, 'Numéro de téléphone algérien invalide (ex: 0551234567)')
      .required('Le numéro de téléphone est requis'),
    wilaya: Yup.string()
      .required('La wilaya est requise'),
    address: Yup.string()
      .min(10, 'L\'adresse doit contenir au moins 10 caractères')
      .required('L\'adresse complète est requise'),
    quantity: Yup.number()
      .min(1, 'La quantité doit être au moins 1')
      .max(product?.quantity || 1, `Maximum ${product?.quantity || 1} disponible`)
      .required('La quantité est requise')
  });

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Calculate total price
      const totalPrice = parseFloat(product.price) * values.quantity;
      
      // Prepare order data
      const orderData = {
        ...values,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        totalPrice: totalPrice
      };

      // Send order to backend
      const response = await api.post('/algeria-orders', orderData);

      if (response.status === 201 || response.status === 200) {
        toast.success('Commande passée avec succès! Nous vous contacterons bientôt.');
        
        // Call success callback
        if (onOrderSuccess) {
          onOrderSuccess(response.data?.order);
        }
        
        // Close the form
        onClose();
      } else {
        throw new Error(result.message || 'Erreur lors de la commande');
      }
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.message || 'Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaShoppingBag className="mr-3 text-blue-600" />
            Passer une commande
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {product.imageUrl ? (
                <img 
                  src={getUploadedImageUrl(product.imageUrl)} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  📱
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600">
                {parseFloat(product.price).toFixed(2)} DA
              </p>
              <p className="text-sm text-gray-600">
                {product.quantity > 0 ? `${product.quantity} en stock` : 'Rupture de stock'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="p-6">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phone: '',
              wilaya: '',
              address: '',
              quantity: 1
            }}
            validationSchema={OrderSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Informations personnelles
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre prénom"
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de famille *
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        id="lastName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre nom de famille"
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaPhone className="mr-2 text-blue-600" />
                    Contact
                  </h3>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone *
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0551234567"
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    <p className="mt-1 text-xs text-gray-500">Format: 05XXXXXXXX, 06XXXXXXXX ou 07XXXXXXXX</p>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" />
                    Livraison
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
                        Wilaya *
                      </label>
                      <Field
                        as="select"
                        name="wilaya"
                        id="wilaya"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez votre wilaya</option>
                        {algeriaWilayas.map((wilaya) => (
                          <option key={wilaya.code} value={wilaya.name}>
                            {wilaya.code} - {wilaya.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="wilaya" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse complète *
                      </label>
                      <Field
                        as="textarea"
                        name="address"
                        id="address"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Rue, quartier, commune, code postal..."
                      />
                      <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité *
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setFieldValue('quantity', Math.max(1, values.quantity - 1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      -
                    </button>
                    <Field
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="1"
                      max={product.quantity}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFieldValue('quantity', Math.min(product.quantity, values.quantity + 1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      +
                    </button>
                  </div>
                  <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Résumé de la commande</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix unitaire:</span>
                      <span>{parseFloat(product.price).toFixed(2)} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantité:</span>
                      <span>{values.quantity}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {(parseFloat(product.price) * values.quantity).toFixed(2)} DA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || product.quantity <= 0}
                    className={`flex-1 px-6 py-3 rounded-md text-white font-medium transition-colors ${
                      submitting || product.quantity <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                  >
                    {submitting ? 'En cours...' : 'Passer la commande'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
