// Image utility functions for random image selection and cycling
import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const API_BASE = API_URL.replace(/\/api$/, '');

/**
 * Get uploaded image URL with proper formatting
 * @param {string} imageUrl - Image URL from database
 * @returns {string} Formatted image URL
 */
export const getUploadedImageUrl = (imageUrl) => {
  if (!imageUrl) return '/assets/product-lg.jpg';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the server URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE}${imageUrl}`;
  }
  
  // If it's just a filename, prepend the resources path
  return `${API_BASE}/resources/images/${imageUrl}`;
};

/**
 * Get a random image from the product's images array
 * @param {string} imagesJson - JSON string of images array
 * @param {string} fallbackImage - Fallback image URL
 * @returns {string} Random image URL
 */
export const getRandomImage = (imagesJson, fallbackImage = '/assets/product-lg.jpg') => {
  try {
    if (!imagesJson) return fallbackImage;
    
    const images = JSON.parse(imagesJson);
    if (!Array.isArray(images) || images.length === 0) {
      return fallbackImage;
    }
    
    // Return a random image from the array
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  } catch (error) {
    console.warn('Error parsing images JSON:', error);
    return fallbackImage;
  }
};

/**
 * Get all images from the product's images array
 * @param {string} imagesJson - JSON string of images array
 * @returns {Array} Array of image URLs
 */
export const getAllImages = (imagesJson) => {
  try {
    if (!imagesJson) return [];
    
    const images = JSON.parse(imagesJson);
    return Array.isArray(images) ? images : [];
  } catch (error) {
    console.warn('Error parsing images JSON:', error);
    return [];
  }
};

/**
 * Get a specific image by index from the product's images array
 * @param {string} imagesJson - JSON string of images array
 * @param {number} index - Index of the image to get
 * @param {string} fallbackImage - Fallback image URL
 * @returns {string} Image URL at the specified index
 */
export const getImageByIndex = (imagesJson, index = 0, fallbackImage = '/assets/product-lg.jpg') => {
  try {
    if (!imagesJson) return fallbackImage;
    
    const images = JSON.parse(imagesJson);
    if (!Array.isArray(images) || images.length === 0) {
      return fallbackImage;
    }
    
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    return images[safeIndex];
  } catch (error) {
    console.warn('Error parsing images JSON:', error);
    return fallbackImage;
  }
};

/**
 * Create a cycling image hook for React components
 * @param {Array} images - Array of image URLs
 * @param {number} interval - Time interval in milliseconds (default: 3000)
 * @returns {Object} Cycling image state and controls
 */
export const useCyclingImages = (images, interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  
  useEffect(() => {
    if (!isCycling || !images || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [isCycling, images, interval]);
  
  const startCycling = () => setIsCycling(true);
  const stopCycling = () => setIsCycling(false);
  const nextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  
  return {
    currentImage: images[currentIndex] || images[0],
    currentIndex,
    totalImages: images.length,
    isCycling,
    startCycling,
    stopCycling,
    nextImage,
    prevImage
  };
};

/**
 * Generate a random seed based on product ID for consistent random selection
 * @param {number} productId - Product ID
 * @returns {number} Random seed
 */
export const getRandomSeed = (productId) => {
  return (productId * 9301 + 49297) % 233280;
};

/**
 * Get a pseudo-random image based on product ID (consistent for same product)
 * @param {string} imagesJson - JSON string of images array
 * @param {number} productId - Product ID for consistent random selection
 * @param {string} fallbackImage - Fallback image URL
 * @returns {string} Pseudo-random image URL
 */
export const getPseudoRandomImage = (imagesJson, productId, fallbackImage = '/assets/product-lg.jpg') => {
  try {
    if (!imagesJson) return fallbackImage;
    
    const images = JSON.parse(imagesJson);
    if (!Array.isArray(images) || images.length === 0) {
      return fallbackImage;
    }
    
    // Use product ID to generate a consistent "random" index
    const seed = getRandomSeed(productId);
    const randomIndex = seed % images.length;
    return images[randomIndex];
  } catch (error) {
    console.warn('Error parsing images JSON:', error);
    return fallbackImage;
  }
};
