import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { pendingApprovalsAPI } from '../../utils/api';

const PendingApprovals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
        const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const { data } = await pendingApprovalsAPI.getAll();
        
        setPendingRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        toast.error('Failed to load pending approval requests');
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const viewReason = (request) => {
    setSelectedRequest(request);
    setShowReasonModal(true);
  };

  const handleApprove = async (id) => {
    try {
      await pendingApprovalsAPI.approve(id);
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      toast.success('Admin request approved');
      if (showReasonModal && selectedRequest?.id === id) {
        setShowReasonModal(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await pendingApprovalsAPI.reject(id);
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      toast.success('Admin request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
    if (showReasonModal && selectedRequest?.id === id) {
      setShowReasonModal(false);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Pending Admin Approvals</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaCheck className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg text-gray-500">No pending admin approval requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-800 font-semibold text-sm">
                            {request.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(request.requestDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewReason(request)}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEye className="mr-1.5 h-4 w-4" />
                        View Reason
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FaCheck className="mr-1 h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaTimes className="mr-1 h-3 w-3" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Reason Modal */}
      {showReasonModal && selectedRequest && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      {selectedRequest.name}'s Request
                    </h3>
                    <div className="mt-2 bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-500 whitespace-pre-wrap">
                        {selectedRequest.reason}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <strong>Email:</strong> {selectedRequest.email}
                      </div>
                      <div>
                        <strong>Requested:</strong> {formatDate(selectedRequest.requestDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  <FaCheck className="mr-1.5 h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  <FaTimes className="mr-1.5 h-4 w-4" />
                  Reject
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowReasonModal(false);
                    setSelectedRequest(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
