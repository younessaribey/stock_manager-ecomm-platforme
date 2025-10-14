import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaKey, FaBell, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { currentUser, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('password');

  // Password change validation schema (simplified - any password works)
  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Notification settings validation schema
  const NotificationSchema = Yup.object().shape({
    emailNotifications: Yup.boolean(),
    orderUpdates: Yup.boolean(),
    productAlerts: Yup.boolean(),
    promotionalEmails: Yup.boolean()
  });

  // Handle password change
  const handlePasswordChange = async (values, { resetForm }) => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to update the password
      await updatePassword(values.currentPassword, values.newPassword);
      
      toast.success('Password updated successfully');
      resetForm();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (values) => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to update notification settings
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Please log in to view your settings</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === 'password'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaKey className="mr-2 h-4 w-4" />
                Password
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === 'notifications'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaBell className="mr-2 h-4 w-4" />
                Notifications
              </div>
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
              <div className="mb-4 p-4 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                <div className="flex">
                  <FaLock className="h-5 w-5 mr-2 flex-shrink-0" />
                  <div>
                    <strong>Security tip:</strong> Use a strong, unique password that you don't use for other accounts.
                  </div>
                </div>
              </div>
              
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }}
                validationSchema={PasswordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting || loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
              <p className="mb-6 text-sm text-gray-500">
                Manage how and when you receive notifications from us.
              </p>
              
              <Formik
                initialValues={{
                  emailNotifications: true,
                  orderUpdates: true,
                  productAlerts: false,
                  promotionalEmails: false
                }}
                validationSchema={NotificationSchema}
                onSubmit={handleNotificationUpdate}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Field name="emailNotifications" type="checkbox">
                          {({ field }) => (
                            <button
                              type="button"
                              onClick={() => field.onChange({
                                target: {
                                  name: 'emailNotifications',
                                  value: !field.value
                                }
                              })}
                              className={`${
                                field.value ? 'bg-indigo-600' : 'bg-gray-200'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                              <span
                                className={`${
                                  field.value ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                              />
                            </button>
                          )}
                        </Field>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
                          <p className="text-sm text-gray-500">Receive updates about your orders</p>
                        </div>
                        <Field name="orderUpdates" type="checkbox">
                          {({ field }) => (
                            <button
                              type="button"
                              onClick={() => field.onChange({
                                target: {
                                  name: 'orderUpdates',
                                  value: !field.value
                                }
                              })}
                              className={`${
                                field.value ? 'bg-indigo-600' : 'bg-gray-200'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                              <span
                                className={`${
                                  field.value ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                              />
                            </button>
                          )}
                        </Field>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">Product Alerts</h3>
                          <p className="text-sm text-gray-500">Get notified when products you're interested in are back in stock</p>
                        </div>
                        <Field name="productAlerts" type="checkbox">
                          {({ field }) => (
                            <button
                              type="button"
                              onClick={() => field.onChange({
                                target: {
                                  name: 'productAlerts',
                                  value: !field.value
                                }
                              })}
                              className={`${
                                field.value ? 'bg-indigo-600' : 'bg-gray-200'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                              <span
                                className={`${
                                  field.value ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                              />
                            </button>
                          )}
                        </Field>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">Promotional Emails</h3>
                          <p className="text-sm text-gray-500">Receive promotional offers and discounts</p>
                        </div>
                        <Field name="promotionalEmails" type="checkbox">
                          {({ field }) => (
                            <button
                              type="button"
                              onClick={() => field.onChange({
                                target: {
                                  name: 'promotionalEmails',
                                  value: !field.value
                                }
                              })}
                              className={`${
                                field.value ? 'bg-indigo-600' : 'bg-gray-200'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                              <span
                                className={`${
                                  field.value ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                              />
                            </button>
                          )}
                        </Field>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting || loading ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
