import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaExclamationTriangle } from 'react-icons/fa';

const AdminRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <FaUserShield className="h-12 w-12 text-gray-800" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Admin Registration</h2>
        </div>
        
        {/* Admin Registration Disabled Message */}
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-800 text-center">Admin Registration Disabled</h3>
          <p className="mt-2 text-sm text-red-600 text-center">
            Admin registration is currently disabled. Please contact the system administrator if you need admin access to the system.
          </p>
        </div>
        
        <div className="flex flex-col items-center mt-8 space-y-4">
          <Link 
            to="/admin/login" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Admin Login
          </Link>
          
          <Link 
            to="/" 
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/register" className="font-medium text-gray-600 hover:text-gray-900">
              Register as regular user
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
