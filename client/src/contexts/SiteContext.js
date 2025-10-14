import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsAPI } from '../utils/api';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'StockManager',
    contactEmail: '',
    itemsPerPage: 10,
    lowStockThreshold: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        // Use the public endpoint to get settings without authentication
        const { data } = await settingsAPI.getPublic();
        setSiteSettings({
          siteName: data.siteName || 'StockManager',
          contactEmail: data.contactEmail || '',
          itemsPerPage: data.itemsPerPage || 10,
          lowStockThreshold: data.lowStockThreshold || 5
        });
      } catch (err) {
        console.error('Error fetching site settings:', err);
        // Keep default settings if there's an error
      } finally {
        setLoading(false);
      }
    };
    fetchSiteSettings();
  }, []);

  return (
    <SiteContext.Provider value={{ 
      ...siteSettings, 
      setSiteSettings,
      loading 
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
