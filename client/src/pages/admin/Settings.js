import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../utils/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaCog, FaDatabase, FaEnvelope, FaKey, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useSite } from '../../contexts/SiteContext';

const Settings = () => {
  const { siteName, setSiteName } = useSite();
  useEffect(() => {
    document.title = siteName ? `${siteName} - Settings` : 'Settings';
  }, [siteName]);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [initialGeneral, setInitialGeneral] = useState({
    siteName: '',
    contactEmail: '',
    itemsPerPage: 20,
    lowStockThreshold: 10
  });
  const [, setFetching] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetching(true);
        const { data } = await settingsAPI.get();
        setInitialGeneral({
          siteName: data.siteName || '',
          contactEmail: data.contactEmail || '',
          itemsPerPage: data.itemsPerPage || 20,
          lowStockThreshold: data.lowStockThreshold || 10
        });
      } catch (error) {
        toast.error('Failed to fetch settings');
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  // General settings validation schema
  const GeneralSchema = Yup.object().shape({
    siteName: Yup.string().required('Site name is required'),
    contactEmail: Yup.string().email('Invalid email address').required('Contact email is required'),
    itemsPerPage: Yup.number()
      .min(5, 'Must be at least 5 items')
      .max(100, 'Cannot be more than 100 items')
      .required('Items per page is required'),
    lowStockThreshold: Yup.number()
      .min(1, 'Must be at least 1')
      .required('Low stock threshold is required')
  });

  // Email settings validation schema
  const EmailSchema = Yup.object().shape({
    smtpHost: Yup.string().required('SMTP host is required'),
    smtpPort: Yup.number().required('SMTP port is required'),
    smtpUser: Yup.string().required('SMTP username is required'),
    smtpPassword: Yup.string().required('SMTP password is required'),
    fromEmail: Yup.string().email('Invalid email address').required('From email is required'),
    fromName: Yup.string().required('From name is required')
  });

  // Database settings validation schema
  const DatabaseSchema = Yup.object().shape({
    databaseType: Yup.string().required('Database type is required'),
    databaseHost: Yup.string()
      .when('databaseType', {
        is: (val) => val !== 'json',
        then: Yup.string().required('Database host is required'),
        otherwise: Yup.string()
      }),
    databasePort: Yup.number()
      .when('databaseType', {
        is: (val) => val !== 'json',
        then: Yup.number().required('Database port is required'),
        otherwise: Yup.number()
      }),
    databaseName: Yup.string()
      .when('databaseType', {
        is: (val) => val !== 'json',
        then: Yup.string().required('Database name is required'),
        otherwise: Yup.string()
      }),
    databaseUser: Yup.string()
      .when('databaseType', {
        is: (val) => val !== 'json',
        then: Yup.string().required('Database user is required'),
        otherwise: Yup.string()
      }),
    databasePassword: Yup.string()
      .when('databaseType', {
        is: (val) => val !== 'json',
        then: Yup.string().required('Database password is required'),
        otherwise: Yup.string()
      })
  });

  // API settings validation schema
  const ApiSchema = Yup.object().shape({
    jwtSecret: Yup.string().required('JWT secret is required'),
    jwtExpiresIn: Yup.string().required('JWT expiration is required'),
    apiRateLimit: Yup.number()
      .min(10, 'Must be at least 10 requests per minute')
      .required('API rate limit is required')
  });

  // Handle form submission for general settings
  const handleGeneralSubmit = async (values) => {
    try {
      setLoading(true);
      await settingsAPI.update({
        siteName: values.siteName,
        contactEmail: values.contactEmail,
        itemsPerPage: values.itemsPerPage,
        lowStockThreshold: values.lowStockThreshold
      });
      toast.success('General settings updated successfully');
      setSiteName(values.siteName);
    } catch (error) {
      console.error('Error updating general settings:', error);
      toast.error('Failed to update general settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for email settings
  const handleEmailSubmit = async (values) => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to update the settings
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Email settings updated successfully');
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('Failed to update email settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for database settings
  const handleDatabaseSubmit = async (values) => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to update the settings
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Database settings updated successfully');
    } catch (error) {
      console.error('Error updating database settings:', error);
      toast.error('Failed to update database settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for API settings
  const handleApiSubmit = async (values) => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to update the settings
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('API settings updated successfully');
    } catch (error) {
      console.error('Error updating API settings:', error);
      toast.error('Failed to update API settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">System Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap ${
                activeTab === 'general'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaCog className="mr-2 h-4 w-4" />
                General Settings
              </div>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap ${
                activeTab === 'email'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaEnvelope className="mr-2 h-4 w-4" />
                Email Settings
              </div>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap ${
                activeTab === 'database'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaDatabase className="mr-2 h-4 w-4" />
                Database Settings
              </div>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap ${
                activeTab === 'api'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FaKey className="mr-2 h-4 w-4" />
                API Settings
              </div>
            </button>
          </nav>
        </div>
        
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div>
            <Formik
              enableReinitialize
              initialValues={initialGeneral}
              validationSchema={GeneralSchema}
              onSubmit={handleGeneralSubmit}
            >
              {({ isSubmitting, loading }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <Field
                      type="text"
                      name="siteName"
                      id="siteName"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="siteName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <Field
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="contactEmail" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                        Items Per Page
                      </label>
                      <Field
                        type="number"
                        name="itemsPerPage"
                        id="itemsPerPage"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="itemsPerPage" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                        Low Stock Threshold
                      </label>
                      <Field
                        type="number"
                        name="lowStockThreshold"
                        id="lowStockThreshold"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="lowStockThreshold" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaSave className="mr-2 -ml-1 h-5 w-5" />
                      {isSubmitting || loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
        
        {/* Email Settings Tab */}
        {activeTab === 'email' && (
          <div>
            <Formik
              enableReinitialize
              initialValues={{
                smtpHost: initialGeneral.smtpHost || '',
                smtpPort: initialGeneral.smtpPort || '',
                smtpUser: initialGeneral.smtpUser || '',
                smtpPassword: initialGeneral.smtpPassword || '',
                fromEmail: initialGeneral.fromEmail || '',
                fromName: initialGeneral.fromName || ''
              }}
              validationSchema={EmailSchema}
              onSubmit={handleEmailSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                      </label>
                      <Field
                        type="text"
                        name="smtpHost"
                        id="smtpHost"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="smtpHost" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <Field
                        type="number"
                        name="smtpPort"
                        id="smtpPort"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="smtpPort" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Username
                      </label>
                      <Field
                        type="text"
                        name="smtpUser"
                        id="smtpUser"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="smtpUser" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Password
                      </label>
                      <Field
                        type="password"
                        name="smtpPassword"
                        id="smtpPassword"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="smtpPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        From Email
                      </label>
                      <Field
                        type="email"
                        name="fromEmail"
                        id="fromEmail"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="fromEmail" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-1">
                        From Name
                        </label>
                        <Field
                          type="text"
                          name="smtpUser"
                          id="smtpUser"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="smtpUser" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          SMTP Password
                        </label>
                        <Field
                          type="password"
                          name="smtpPassword"
                          id="smtpPassword"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="smtpPassword" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          From Email
                        </label>
                        <Field
                          type="email"
                          name="fromEmail"
                          id="fromEmail"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="fromEmail" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-1">
                          From Name
                        </label>
                        <Field
                          type="text"
                          name="fromName"
                          id="fromName"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="fromName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaSave className="mr-2 -ml-1 h-5 w-5" />
                        {isSubmitting || loading ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* Database Settings Tab */}
          {activeTab === 'database' && (
            <div>
              <Formik
                initialValues={{
                  databaseType: 'json',
                  databaseHost: 'localhost',
                  databasePort: 5432,
                  databaseName: 'stock_management',
                  databaseUser: 'postgres',
                  databasePassword: ''
                }}
                validationSchema={DatabaseSchema}
                onSubmit={handleDatabaseSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="databaseType" className="block text-sm font-medium text-gray-700 mb-1">
                        Database Type
                      </label>
                      <Field
                        as="select"
                        name="databaseType"
                        id="databaseType"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="json">JSON File (Default)</option>
                        <option value="postgres">PostgreSQL</option>
                        <option value="mysql">MySQL</option>
                        <option value="mongodb">MongoDB</option>
                      </Field>
                      <ErrorMessage name="databaseType" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    {values.databaseType !== 'json' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="databaseHost" className="block text-sm font-medium text-gray-700 mb-1">
                              Database Host
                            </label>
                            <Field
                              type="text"
                              name="databaseHost"
                              id="databaseHost"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="databaseHost" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          
                          <div>
                            <label htmlFor="databasePort" className="block text-sm font-medium text-gray-700 mb-1">
                              Database Port
                            </label>
                            <Field
                              type="number"
                              name="databasePort"
                              id="databasePort"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="databasePort" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="databaseName" className="block text-sm font-medium text-gray-700 mb-1">
                            Database Name
                          </label>
                          <Field
                            type="text"
                            name="databaseName"
                            id="databaseName"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <ErrorMessage name="databaseName" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="databaseUser" className="block text-sm font-medium text-gray-700 mb-1">
                              Database User
                            </label>
                            <Field
                              type="text"
                              name="databaseUser"
                              id="databaseUser"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="databaseUser" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          
                          <div>
                            <label htmlFor="databasePassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Database Password
                            </label>
                            <Field
                              type="password"
                              name="databasePassword"
                              id="databasePassword"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="databasePassword" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaSave className="mr-2 -ml-1 h-5 w-5" />
                        {isSubmitting || loading ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* API Settings Tab */}
          {activeTab === 'api' && (
            <div>
              <Formik
                initialValues={{
                  jwtSecret: 'your-secret-key-change-in-production',
                  jwtExpiresIn: '24h',
                  apiRateLimit: 60
                }}
                validationSchema={ApiSchema}
                onSubmit={handleApiSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="jwtSecret" className="block text-sm font-medium text-gray-700 mb-1">
                        JWT Secret
                      </label>
                      <Field
                        type="password"
                        name="jwtSecret"
                        id="jwtSecret"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="jwtSecret" component="div" className="mt-1 text-sm text-red-600" />
                      <p className="mt-1 text-sm text-gray-500">
                        This is used to sign JWT tokens. Keep this secret and change it regularly.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="jwtExpiresIn" className="block text-sm font-medium text-gray-700 mb-1">
                          JWT Expiration
                        </label>
                        <Field
                          type="text"
                          name="jwtExpiresIn"
                          id="jwtExpiresIn"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="jwtExpiresIn" component="div" className="mt-1 text-sm text-red-600" />
                        <p className="mt-1 text-sm text-gray-500">
                          E.g., 24h, 60m, 2d (default: 24h)
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="apiRateLimit" className="block text-sm font-medium text-gray-700 mb-1">
                          API Rate Limit (requests per minute)
                        </label>
                        <Field
                          type="number"
                          name="apiRateLimit"
                          id="apiRateLimit"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage name="apiRateLimit" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaSave className="mr-2 -ml-1 h-5 w-5" />
                        {isSubmitting || loading ? 'Saving...' : 'Save Settings'}
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
