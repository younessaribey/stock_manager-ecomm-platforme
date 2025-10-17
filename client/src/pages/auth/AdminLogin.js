import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import APP_CONFIG from '../../config/appConfig';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema
  const AdminLoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const result = await login({ 
        email: values.email, 
        password: values.password 
      }, true); // true means admin login
      
      if (result.pendingApproval) {
        toast.info('Your admin account is pending approval');
        navigate('/admin/waiting-approval');
      } else {
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      // Toast notification is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <FaUserShield className="h-12 w-12 text-gray-800" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your administrative dashboard
          </p>
        </div>

        {/* Development Test Credentials */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Development Mode - Admin Demo Credentials
              </p>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>Email:</strong> {APP_CONFIG.DEMO_ADMIN.email}</p>
                <p><strong>Password:</strong> {APP_CONFIG.DEMO_ADMIN.password}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const email = APP_CONFIG.DEMO_ADMIN.email;
                  const password = APP_CONFIG.DEMO_ADMIN.password;
                  document.getElementById('email').value = email;
                  document.getElementById('password').value = password;
                  // Trigger Formik change events
                  const emailEvent = new Event('input', { bubbles: true });
                  const passwordEvent = new Event('input', { bubbles: true });
                  document.getElementById('email').dispatchEvent(emailEvent);
                  document.getElementById('password').dispatchEvent(passwordEvent);
                }}
                className="mt-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
              >
                Auto-fill credentials
              </button>
            </div>
          </div>
        </div>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={AdminLoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    placeholder="Enter your admin email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/admin/forgot-password" className="font-medium text-gray-600 hover:text-gray-900">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || !isValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  }`}
                >
                  <FaSignInAlt className="mr-2 h-5 w-5" aria-hidden="true" />
                  Admin Sign in
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an admin account?{' '}
            <Link to="/admin/register" className="font-medium text-gray-900 hover:text-black">
              Register as admin
            </Link>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900">
              Sign in as regular user
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
