import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserClock, FaEnvelope, FaHome } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminWaitingApproval = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <FaUserClock className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Approval Pending</h2>
        
        <p className="text-gray-600 mb-6">
          Your request for admin access is pending approval. You will receive an email notification once your request has been reviewed.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700 text-sm">
            The approval process may take 1-2 business days. If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <a 
            href="mailto:support@stockmanager.com" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            <FaEnvelope className="mr-2 h-5 w-5 text-gray-500" />
            Contact Support
          </a>
          
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaHome className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          
          <button 
            onClick={logout}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWaitingApproval;
