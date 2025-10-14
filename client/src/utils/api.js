import axios from 'axios';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
  timeout: 10000,
  withCredentials: false
});

// Add a request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Always get the latest token from either localStorage or sessionStorage
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove Authorization header if not logged in
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (let AuthProvider handle redirect)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Do NOT redirect here; let AuthProvider/route guards handle it
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  createWithImage: (formData) => {
    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  update: (id, productData) => api.put(`/products/${id}`, productData),
  updateWithImage: (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  delete: (id) => api.delete(`/products/${id}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

// Dashboard API
// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  delete: (id) => api.delete(`/orders/${id}`)
};

export const pendingApprovalsAPI = {
  getAll: () => api.get('/pending-approvals'),
  approve: (id) => api.post(`/pending-approvals/${id}/approve`),
  reject: (id) => api.delete(`/pending-approvals/${id}/reject`)
};

export const settingsAPI = {
  get() {
    return api.get('/settings');
  },
  getPublic() {
    return api.get('/settings/public');
  },
  update(settingsData) {
    return api.put('/settings', settingsData);
  }
};

export const cartAPI = {
  get: () => api.get('/cart'),
  update: (items) => api.put('/cart', { items })
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  update: (items) => api.put('/wishlist', { items })
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getUserStats: () => api.get('/dashboard/user-stats')
};

export default api;
