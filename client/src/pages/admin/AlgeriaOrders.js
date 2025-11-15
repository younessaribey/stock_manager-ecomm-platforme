import React, { useState, useEffect } from 'react';
import { FaEye, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaBox, FaCheck, FaTimes, FaClock, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const AlgeriaOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/algeria-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/algeria-orders/${orderId}/status`, { status: newStatus });

      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders list
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, text: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: <FaCheck />, text: 'Confirmé' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <FaTruck />, text: 'Expédié' },
      delivered: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Livré' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimes />, text: 'Annulé' },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Algérie</h1>
          <p className="text-gray-600 mt-1">Gérer les commandes des clients algériens</p>
        </div>
        
        {/* Filter */}
        <div className="mt-4 sm:mt-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { status: 'pending', label: 'En attente', color: 'bg-yellow-50 border-yellow-200' },
          { status: 'confirmed', label: 'Confirmé', color: 'bg-blue-50 border-blue-200' },
          { status: 'shipped', label: 'Expédié', color: 'bg-purple-50 border-purple-200' },
          { status: 'delivered', label: 'Livré', color: 'bg-green-50 border-green-200' },
          { status: 'cancelled', label: 'Annulé', color: 'bg-red-50 border-red-200' },
        ].map((stat) => {
          const count = orders.filter(order => order.status === stat.status).length;
          return (
            <div key={stat.status} className={`p-4 rounded-lg border ${stat.color}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaPhone className="mr-1" />
                        {order.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaBox className="mr-1" />
                        Qté: {order.quantity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {order.wilaya}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.totalPrice.toFixed(2)} DA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye />
                      </button>
                      
                      {/* Quick status updates */}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                          title="Confirmer"
                        >
                          <FaCheck />
                        </button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Expédier"
                        >
                          <FaTruck />
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                          title="Marquer comme livré"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Aucune commande trouvée</div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la commande #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</div>
                      <div><strong>Téléphone:</strong> {selectedOrder.phone}</div>
                      <div><strong>Wilaya:</strong> {selectedOrder.wilaya}</div>
                      <div><strong>Adresse:</strong> {selectedOrder.address}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Détails commande</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
                      <div><strong>Statut:</strong> {getStatusBadge(selectedOrder.status)}</div>
                      <div><strong>Produit:</strong> {selectedOrder.productName}</div>
                      <div><strong>Quantité:</strong> {selectedOrder.quantity}</div>
                      <div><strong>Prix unitaire:</strong> {selectedOrder.productPrice.toFixed(2)} DA</div>
                      <div><strong>Total:</strong> {selectedOrder.totalPrice.toFixed(2)} DA</div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Changer le statut</h4>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {getStatusBadge(status).props.children[1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgeriaOrders;
