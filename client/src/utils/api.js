import axios from 'axios';
import APP_CONFIG from '../config/appConfig';
import {
  demoProductsAPI,
  demoCategoriesAPI,
  demoAuthAPI,
  demoUsersAPI,
  demoOrdersAPI,
  demoPendingApprovalsAPI,
  demoSettingsAPI,
  demoCartAPI,
  demoWishlistAPI,
  demoDashboardAPI
} from './demoAPI';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
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

// Products API - switches between demo and production
export const productsAPI = APP_CONFIG.DEMO_MODE ? demoProductsAPI : {
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
  update: (id, productData) => api.patch(`/products/${id}`, productData),
  updateWithImage: (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  delete: (id) => api.delete(`/products/${id}`)
};

// Categories API - switches between demo and production
export const categoriesAPI = APP_CONFIG.DEMO_MODE ? demoCategoriesAPI : {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Auth API - switches between demo and production
export const authAPI = APP_CONFIG.DEMO_MODE ? demoAuthAPI : {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Users API - switches between demo and production
export const usersAPI = APP_CONFIG.DEMO_MODE ? demoUsersAPI : {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

// Orders API - switches between demo and production
export const ordersAPI = APP_CONFIG.DEMO_MODE ? demoOrdersAPI : {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  delete: (id) => api.delete(`/orders/${id}`)
};

export const pendingApprovalsAPI = APP_CONFIG.DEMO_MODE ? demoPendingApprovalsAPI : {
  getAll: () => api.get('/pending-approvals'),
  approve: (id) => api.post(`/pending-approvals/${id}/approve`),
  reject: (id) => api.delete(`/pending-approvals/${id}/reject`)
};

export const settingsAPI = APP_CONFIG.DEMO_MODE ? demoSettingsAPI : {
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

export const cartAPI = APP_CONFIG.DEMO_MODE ? demoCartAPI : {
  get: () => api.get('/cart'),
  update: (items) => api.put('/cart', { items })
};

export const wishlistAPI = APP_CONFIG.DEMO_MODE ? demoWishlistAPI : {
  get: () => api.get('/wishlist'),
  update: (items) => api.put('/wishlist', { items })
};

export const dashboardAPI = APP_CONFIG.DEMO_MODE ? demoDashboardAPI : {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getUserStats: () => api.get('/dashboard/user-stats')
};

export default api;
