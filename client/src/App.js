import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Lock Screen
import LockScreen from './pages/public/LockScreen';

// Public Pages
import Home from './pages/public/Home';
import PublicProducts from './pages/public/ProductsNew';
import PublicProductDetails from './pages/public/ProductDetails';
import OnePageCheckout from './pages/public/OnePageCheckout';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import News from './pages/public/News';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import AdminWaitingApproval from './pages/auth/AdminWaitingApproval';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddProduct from './pages/admin/AddProductWizard';
import AdminCategories from './pages/admin/Categories';
import CategoriesEnhanced from './pages/admin/CategoriesEnhanced';
import AlgeriaOrders from './pages/admin/AlgeriaOrders';
import AdminStatistics from './pages/admin/Statistics';
import AdminSettings from './pages/admin/Settings';
import NewsManagement from './pages/admin/NewsManagement';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Enhanced Public Layout with iOS unlock animations
const AnimatedPublicLayout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] // iOS easing curve
      }}
    >
      <PublicLayout>{children}</PublicLayout>
    </motion.div>
  );
};

// Guards
const PublicRoute = ({ children }) => {
  return <AnimatedPublicLayout>{children}</AnimatedPublicLayout>;
};

// Admin Route - requires authentication
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }
  
  if (currentUser.role !== 'admin') {
    if (currentUser.pendingAdmin) {
      return <Navigate to="/admin/waiting-approval" />;
    }
    return <Navigate to="/" />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return Boolean(localStorage.getItem('siteUnlocked'));
    } catch (e) {
      return false;
    }
  });
  const { currentUser } = useAuth();
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  // Consider device type (mobile only)
  const isMobile = typeof navigator !== 'undefined' && (
    /android|iphone|ipad|ipod|iemobile|opera mini/i.test(navigator.userAgent || '') ||
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches)
  );

  React.useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      setIsUnlocked(true);
    }
  }, [currentUser]);

  const handleUnlock = () => {
    try {
      localStorage.setItem('siteUnlocked', '1');
    } catch (e) {
      // ignore storage errors
    }
    setIsUnlocked(true);
  };

  // Show lock only on mobile, only if not unlocked before, and never on admin paths
  const shouldShowLock = isMobile && !isUnlocked && !(currentUser && currentUser.role === 'admin') && !isAdminPath;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {shouldShowLock ? (
          <motion.div
            key="lockscreen"
            exit={{ 
              opacity: 0,
              scale: 1.1,
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
          >
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="website"
            initial={{ 
              opacity: 0,
              scale: 0.9,
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
          >
            {/* White flash overlay for iOS-like transition */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="fixed inset-0 bg-white z-50 pointer-events-none"
            />
            
            <Routes>
              {/* Public Routes - Simple Commerce Website */}
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/products" element={<PublicRoute><PublicProducts /></PublicRoute>} />
              <Route path="/products/:id" element={<PublicRoute><PublicProductDetails /></PublicRoute>} />
              <Route path="/checkout/:id" element={<PublicRoute><OnePageCheckout /></PublicRoute>} />
              <Route path="/news" element={<PublicRoute><News /></PublicRoute>} />
              <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
              
              {/* Admin Auth Routes */}
              <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
              <Route path="/admin/register" element={<PublicRoute><AdminRegister /></PublicRoute>} />
              <Route path="/admin/waiting-approval" element={<PublicRoute><AdminWaitingApproval /></PublicRoute>} />
              
              {/* Admin Routes - Requires Authentication */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
              <Route path="/admin/products/wizard" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/categories-enhanced" element={<AdminRoute><CategoriesEnhanced /></AdminRoute>} />
              <Route path="/admin/news" element={<AdminRoute><NewsManagement /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AlgeriaOrders /></AdminRoute>} />
              <Route path="/admin/statistics" element={<AdminRoute><AdminStatistics /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              
              {/* 404 - Catch All */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;