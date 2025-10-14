import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaCheck, FaMobile, FaLaptop, FaTabletAlt, FaClock, FaPlug, FaGift, FaTag, FaBox, FaTruck, FaHeart, FaPlus, FaTimes, FaImage } from 'react-icons/fa';

// Smart model database for different brands
const SMART_MODELS = {
  // Apple Smartphones
  'Apple': {
    type: 'smartphone',
    models: [
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
      'iPhone SE (3rd generation)', 'iPhone SE (2nd generation)'
    ],
    storageOptions: ['64GB', '128GB', '256GB', '512GB', '1TB'],
    colors: ['Black', 'White', 'Red', 'Blue', 'Purple', 'Yellow', 'Pink', 'Green', 'Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    hasBatteryHealth: true,
    batteryCycles: false
  },
  
  // Apple iPad
  'Apple iPad': {
    type: 'tablet',
    models: [
      'iPad Pro 12.9-inch (6th generation)', 'iPad Pro 11-inch (4th generation)',
      'iPad Air (5th generation)', 'iPad (10th generation)', 'iPad (9th generation)',
      'iPad mini (6th generation)'
    ],
    storageOptions: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
    colors: ['Space Gray', 'Silver', 'Pink', 'Blue', 'Purple', 'Starlight'],
    hasBatteryHealth: true,
    batteryCycles: false
  },
  
  // Apple MacBook
  'Apple MacBook': {
    type: 'laptop',
    models: [
      'MacBook Air M3 13-inch', 'MacBook Air M2 13-inch', 'MacBook Air M1 13-inch',
      'MacBook Pro M3 14-inch', 'MacBook Pro M3 16-inch',
      'MacBook Pro M2 13-inch', 'MacBook Pro M2 14-inch', 'MacBook Pro M2 16-inch',
      'MacBook Pro M1 13-inch', 'MacBook Pro M1 14-inch', 'MacBook Pro M1 16-inch'
    ],
    storageOptions: ['256GB', '512GB', '1TB', '2TB', '4TB', '8TB'],
    colors: ['Space Gray', 'Silver', 'Gold', 'Space Black'],
    hasBatteryHealth: false,
    batteryCycles: true
  },
  
  // Samsung Smartphones
  'Samsung': {
    type: 'smartphone',
    models: [
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
      'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
      'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
      'Galaxy Z Fold5', 'Galaxy Z Flip5', 'Galaxy Z Fold4', 'Galaxy Z Flip4',
      'Galaxy A54 5G', 'Galaxy A34 5G', 'Galaxy A24', 'Galaxy A14'
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Black', 'White', 'Purple', 'Green', 'Blue', 'Pink', 'Gold', 'Silver'],
    hasBatteryHealth: false,
    batteryCycles: false
  },
  
  // Huawei Smartphones
  'Huawei': {
    type: 'smartphone',
    models: [
      'P60 Pro', 'P60', 'P50 Pro', 'P50',
      'Mate 60 Pro+', 'Mate 60 Pro', 'Mate 60',
      'Nova 11 Pro', 'Nova 11', 'Nova 10 Pro', 'Nova 10'
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Black', 'White', 'Blue', 'Gold', 'Purple', 'Green'],
    hasBatteryHealth: false,
    batteryCycles: false
  },
  
  // Google Smartphones
  'Google': {
    type: 'smartphone',
    models: [
      'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a',
      'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a',
      'Pixel 6 Pro', 'Pixel 6'
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Obsidian', 'Snow', 'Hazel', 'Stormy Black', 'Clearly White', 'Kinda Coral'],
    hasBatteryHealth: false,
    batteryCycles: false
  },
  
  // OnePlus Smartphones
  'OnePlus': {
    type: 'smartphone',
    models: [
      'OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 10T',
      'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus Nord 3', 'OnePlus Nord CE 3'
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Black', 'Green', 'Blue', 'White', 'Purple'],
    hasBatteryHealth: false,
    batteryCycles: false
  }
};

// Multi-Image Upload Component
const MultiImageUpload = ({ images, onChange, maxImages = 8 }) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    // Create preview URLs for images
    const previews = images.map((image, index) => {
      if (typeof image === 'string') {
        return { url: image, id: index, isExisting: true };
      } else if (image instanceof File) {
        return { url: URL.createObjectURL(image), id: index, file: image, isExisting: false };
      }
      return null;
    }).filter(Boolean);

    setImagePreviews(previews);

    // Cleanup object URLs
    return () => {
      previews.forEach(preview => {
        if (!preview.isExisting && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [images]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    
    files.forEach(file => {
      if (newImages.length < maxImages && file.type.startsWith('image/')) {
        newImages.push(file);
      }
    });

    onChange(newImages);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {imagePreviews.map((preview, index) => (
          <div key={preview.id} className="relative group">
            <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={preview.url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Controls */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 text-xs"
                  title="Move left"
                >
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 text-xs"
                  title="Move right"
                >
                  →
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                title="Remove image"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
            
            {/* Main Image Badge */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-medium">
                Main
              </div>
            )}
          </div>
        ))}

        {/* Add New Image Button */}
        {images.length < maxImages && (
          <div className="aspect-square">
            <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <FaPlus className="text-gray-400 text-2xl mb-2" />
              <span className="text-sm text-gray-500 text-center px-2">
                Add Image
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <FaImage className="text-blue-500 mt-1 mr-3" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Image Upload Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>Upload up to {maxImages} high-quality images</li>
              <li>First image will be the main product image</li>
              <li>Use arrow buttons to reorder images</li>
              <li>Recommended size: 800x800px or larger</li>
              <li>Supported formats: JPG, PNG, WebP</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Counter */}
      <div className="text-center">
        <span className={`text-sm font-medium ${
          images.length >= maxImages ? 'text-red-600' : 'text-gray-600'
        }`}>
          {images.length} / {maxImages} images
        </span>
      </div>
    </div>
  );
};

const VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().required('Product name is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be non-negative'),
  categoryId: Yup.string().required('Please select a category'),
  model: Yup.string().required('Model is required'),
  storage: Yup.string(),
  imei: Yup.string()
});

const AddProductWizard = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [smartModels, setSmartModels] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/categories');
      const mainCats = response.data.filter(cat => !cat.parentId);
      setCategories(mainCats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleMainCategorySelect = async (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    setSelectedMainCategory(category);
    
    try {
      const response = await axios.get('http://localhost:5050/api/categories');
      const subs = response.data.filter(cat => cat.parentId === parseInt(categoryId));
      setSubcategories(subs);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    const models = SMART_MODELS[brandName];
    setSmartModels(models);
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Smartphones': return <FaMobile className="text-blue-500" />;
      case 'Tablets': return <FaTabletAlt className="text-green-500" />;
      case 'Laptop': return <FaLaptop className="text-purple-500" />;
      case 'Smartwatches': return <FaClock className="text-red-500" />;
      case 'Accessoires': return <FaPlug className="text-yellow-500" />;
      case 'Occasions': return <FaHeart className="text-pink-500" />;
      case 'Affaire du jour': return <FaTag className="text-orange-500" />;
      case "Brother's Packs": return <FaBox className="text-indigo-500" />;
      case 'Livraison Gratuite': return <FaTruck className="text-emerald-500" />;
      default: return <FaGift className="text-gray-500" />;
    }
  };

  const getBrandEmoji = (brandName) => {
    const brandEmojis = {
      'Apple': '🍎',
      'Samsung': '📱',
      'Huawei': '🌟',
      'Google': '🔍',
      'OnePlus': '⚡',
      'Xiaomi': '🔥',
      'HP': '💻',
      'Dell': '🖥️',
      'Asus': '⚙️'
    };
    return brandEmojis[brandName] || '📦';
  };

  const getColorClass = (colorName) => {
    const colorClasses = {
      'Black': 'bg-gray-900 border-gray-900',
      'White': 'bg-white border-gray-300',
      'Red': 'bg-red-500 border-red-500',
      'Blue': 'bg-blue-500 border-blue-500',
      'Green': 'bg-green-500 border-green-500',
      'Purple': 'bg-purple-500 border-purple-500',
      'Yellow': 'bg-yellow-400 border-yellow-400',
      'Pink': 'bg-pink-400 border-pink-400',
      'Gold': 'bg-yellow-300 border-yellow-300',
      'Silver': 'bg-gray-300 border-gray-300',
      'Space Gray': 'bg-gray-600 border-gray-600',
      'Space Black': 'bg-gray-900 border-gray-900',
      'Natural Titanium': 'bg-gray-400 border-gray-400',
      'Blue Titanium': 'bg-blue-400 border-blue-400',
      'White Titanium': 'bg-gray-200 border-gray-200',
      'Black Titanium': 'bg-gray-800 border-gray-800',
      'Starlight': 'bg-yellow-100 border-yellow-100'
    };
    return colorClasses[colorName] || 'bg-gray-400 border-gray-400';
  };

  const generateRandomImei = () => {
    // Generate a realistic looking IMEI/Serial number
    const prefixes = ['APL', 'SAM', 'HUA', 'GOO', 'ONE', 'XIA', 'OPP', 'VIV', 'REA'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numbers = Math.floor(Math.random() * 900000000) + 100000000; // 9-digit number
    const suffix = Math.floor(Math.random() * 900) + 100; // 3-digit suffix
    return `${prefix}${numbers}${suffix}`;
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Handle color field (use custom color if provided, otherwise use selected color)
      let finalColor = values.customColor || values.color;
      
      // Ensure color is always a string (not an array)
      if (Array.isArray(finalColor)) {
        finalColor = finalColor[0]; // Take the first color if it's an array
      }
      
      // Convert to string if it's not already
      if (finalColor && typeof finalColor !== 'string') {
        finalColor = String(finalColor);
      }
      
      // Add all form fields
      Object.keys(values).forEach(key => {
        if (key === 'customColor') return; // Skip custom color, we handle it above
        if (key === 'productImages') return; // Handle separately
        
        if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          // Ensure we don't send arrays for string fields
          let value = values[key];
          if (key === 'color' && Array.isArray(value)) {
            value = value[0]; // Take first color if array
          }
          if (key === 'color' && typeof value !== 'string') {
            value = String(value);
          }
          formData.append(key, value);
        }
      });
      
      // Handle product images - first image as main, rest as additional
      if (values.productImages && values.productImages.length > 0) {
        // Main image (first one)
        formData.append('image', values.productImages[0]);
        
        // Additional images (rest)
        if (values.productImages.length > 1) {
          values.productImages.slice(1).forEach((file) => {
            formData.append('additionalImages', file);
          });
        }
      }
      
      // Add the final color
      if (finalColor) {
        formData.append('color', finalColor);
      }

      // Debug: Log what we're sending
      console.log('Sending product data:', {
        name: values.name,
        description: values.description,
        price: values.price,
        quantity: values.quantity,
        categoryId: values.categoryId,
        model: values.model,
        storage: values.storage,
        color: finalColor,
        condition: values.condition,
        imei: values.imei,
        batteryHealth: values.batteryHealth,
        totalImages: values.productImages ? values.productImages.length : 0
      });

      const response = await axios.post('http://localhost:5050/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Product created successfully!');
      alert('🎉 Product added successfully!');
      window.location.href = '/admin/products';
    } catch (error) {
      console.error('Error adding product:', error);
      
      // Get detailed error message
      let errorMessage = 'Unknown error occurred';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show user-friendly error message
      if (errorMessage.includes('IMEI') && errorMessage.includes('already exists')) {
        alert(`❌ Duplicate IMEI: ${errorMessage}\n\n💡 Tip: Click the "🎲 Generate" button to create a unique IMEI.`);
      } else if (errorMessage.includes('already exists')) {
        alert(`❌ Duplicate Entry: ${errorMessage}\n\n💡 Tip: Try changing the product name or IMEI.`);
      } else if (errorMessage.includes('required')) {
        alert(`❌ Missing Information: ${errorMessage}`);
      } else {
        alert(`❌ Error adding product: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > stepNum ? <FaCheck /> : stepNum}
                </div>
          {stepNum < 4 && (
            <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
  );

  const renderStep1 = (setFieldValue) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Product Category</h3>
        <p className="text-gray-600">What type of product are you adding?</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
            onClick={() => {
              handleMainCategorySelect(category.id);
              setFieldValue('mainCategoryId', category.id);
              setStep(2);
            }}
            className={`p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg ${
                              selectedMainCategory?.id === category.id
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-4xl mb-3">{getCategoryIcon(category.name)}</div>
            <h4 className="font-semibold text-lg">{category.name}</h4>
                          </button>
                        ))}
                      </div>
    </div>
  );

  const renderStep2 = (setFieldValue) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Brand</h3>
        <p className="text-gray-600">Select the brand for your {selectedMainCategory?.name.toLowerCase()}</p>
                    </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subcategories.map((brand) => (
                            <button
            key={brand.id}
                              type="button"
            onClick={() => {
              handleBrandSelect(brand.name);
              setFieldValue('categoryId', brand.id);
              setStep(3);
            }}
            className={`p-4 border-2 rounded-xl text-center transition-all hover:shadow-lg ${
              selectedBrand === brand.name 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-2xl mb-2">{getBrandEmoji(brand.name)}</div>
            <h4 className="font-medium">{brand.name}</h4>
                            </button>
                          ))}
                        </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Categories
        </button>
                      </div>
                  </div>
  );

  const renderStep3 = (values, setFieldValue) => (
                  <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Details</h3>
        <p className="text-gray-600">Enter the details for your {selectedBrand} {selectedMainCategory?.name.toLowerCase()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Selection */}
                      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model {smartModels && <span className="text-xs text-gray-500">(Select from popular models or enter custom)</span>}
                        </label>
          {smartModels && smartModels.models ? (
            <div className="space-y-3">
              <Field
                as="select"
                name="model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setFieldValue('model', '');
                  } else {
                    setFieldValue('model', e.target.value);
                  }
                }}
              >
                <option value="">Select a model...</option>
                {smartModels.models.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
                <option value="custom">🔧 Custom Model (Type Below)</option>
              </Field>
              
              {(values.model === '' || !smartModels.models.includes(values.model)) && (
                        <Field
                          type="text"
                  name="model"
                  placeholder={`Enter custom ${selectedBrand} model...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
                      </div>
          ) : (
            <Field
              type="text"
              name="model"
              placeholder={`Enter ${selectedBrand} model...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          <ErrorMessage name="model" component="div" className="text-red-600 text-sm mt-1" />
                      </div>

        {/* Storage (for smartphones, tablets, laptops) */}
        {smartModels && ['smartphone', 'tablet', 'laptop'].includes(smartModels.type) && (
                        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
            {smartModels.storageOptions ? (
                          <Field
                            as="select"
                            name="storage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select storage...</option>
                {smartModels.storageOptions.map((storage) => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
                          </Field>
            ) : (
              <Field
                type="text"
                name="storage"
                placeholder="e.g., 256GB, 512GB"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            )}
            <ErrorMessage name="storage" component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                      )}

                      {/* Color */}
                        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          {smartModels && smartModels.colors ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {smartModels.colors.map((color) => (
                  <Field key={color} name="color">
                    {({ field, form }) => (
                      <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        field.value === color ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}>
                        <input
                          type="radio"
                          {...field}
                          value={color}
                          checked={field.value === color}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full mr-2 border ${getColorClass(color)}`} />
                        <span className="text-sm font-medium">{color}</span>
                          </label>
                    )}
                  </Field>
                ))}
              </div>
              <Field
                type="text"
                name="customColor"
                placeholder="Or enter custom color..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          ) : (
            <Field
              type="text"
              name="color"
              placeholder="e.g., Black, White, Blue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

                {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
            {selectedMainCategory?.name === 'Occasions' && <span className="text-orange-600 ml-2">(Used phone condition)</span>}
          </label>
          <Field
            as="select"
            name="condition"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select condition...</option>
            {selectedMainCategory?.name === 'Occasions' ? (
              // Used phone conditions
              <>
                <option value="Excellent">⭐ Excellent (Like new, minimal signs of use)</option>
                <option value="Very Good">👍 Very Good (Light signs of use)</option>
                <option value="Good">✅ Good (Visible signs of use but works perfectly)</option>
                <option value="Fair">⚠️ Fair (Heavy signs of use, fully functional)</option>
                <option value="Poor">🔧 Poor (Significant wear, may need repair)</option>
              </>
            ) : (
              // New product conditions
              <>
                <option value="new">🆕 New</option>
                <option value="used">👍 Used</option>
                <option value="refurbished">🔄 Refurbished</option>
              </>
            )}
          </Field>
        </div>

        {/* IMEI/Serial Number (for smartphones and tablets) */}
        {smartModels && ['smartphone', 'tablet'].includes(smartModels.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {smartModels.type === 'smartphone' ? 'IMEI Number' : 'Serial Number'}
            </label>
            <div className="flex space-x-2">
              <Field
                type="text"
                name="imei"
                placeholder={smartModels.type === 'smartphone' ? 'Enter IMEI number' : 'Enter serial number'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const randomImei = generateRandomImei();
                  setFieldValue('imei', randomImei);
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
                title="Generate random IMEI"
              >
                🎲 Generate
              </button>
            </div>
            <ErrorMessage name="imei" component="div" className="text-red-600 text-sm mt-1" />
            <p className="text-xs text-gray-500 mt-1">
              {smartModels.type === 'smartphone' ? 'IMEI must be unique for each device' : 'Serial number must be unique'}
            </p>
          </div>
        )}

                {/* Battery Health (Apple products OR Occasions category) */}
        {((selectedBrand === 'Apple' && smartModels && smartModels.hasBatteryHealth) || 
          (selectedMainCategory?.name === 'Occasions')) && (
          <div>
                            <Field name="batteryHealth">
              {({ field, form }) => (
                                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔋 Battery Health: {field.value || 100}%
                    {selectedMainCategory?.name === 'Occasions' && <span className="text-orange-600 ml-2">(Required for used phones)</span>}
                  </label>
                  <div className="space-y-3">
                                  <input
                                    type="range"
                      min="1"
                                    max="100"
                      value={field.value || 100}
                      onChange={(e) => form.setFieldValue('batteryHealth', e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                        background: `linear-gradient(to right, ${
                          field.value >= 80 ? '#10b981' : field.value >= 50 ? '#f59e0b' : '#ef4444'
                        } 0%, ${
                          field.value >= 80 ? '#10b981' : field.value >= 50 ? '#f59e0b' : '#ef4444'
                        } ${field.value}%, #e5e7eb ${field.value}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Poor (1%)</span>
                      <span>Good (50%)</span>
                      <span>Excellent (100%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={field.value || 100}
                        onChange={(e) => form.setFieldValue('batteryHealth', e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">For Apple devices, check in Settings &gt; Battery &gt; Battery Health</p>
                </div>
              )}
            </Field>
          </div>
        )}

        {/* Battery Cycles (MacBook only) */}
        {selectedBrand === 'Apple MacBook' && smartModels && smartModels.batteryCycles && (
                                <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔄 Battery Cycles
            </label>
            <Field
              type="number"
              name="batteryCycles"
                                    min="0"
              placeholder="e.g., 150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Check in Apple menu &gt; About This Mac &gt; System Report</p>
          </div>
        )}
                                  </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Brands
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue <FaArrowRight className="ml-2" />
        </button>
                                  </div>
                                </div>
  );

  const renderStep4 = (values) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h3>
        <p className="text-gray-600">Add pricing, description, and images</p>
                          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <Field
            type="text"
            name="name"
            placeholder={`${selectedBrand} ${values.model || ''} ${values.storage || ''}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                      {/* Price */}
                      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (DA)</label>
                        <Field
                          type="number"
                          name="price"
            min="0"
            step="100"
            placeholder="e.g., 25000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                      </div>

                      {/* Quantity */}
                      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity in Stock</label>
                        <Field
                          type="number"
                          name="quantity"
            min="0"
            placeholder="e.g., 5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm mt-1" />
                      </div>

                {/* Multi-Image Upload Component */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Images (up to 8)</label>
          <Field name="productImages">
            {({ form }) => (
              <MultiImageUpload 
                images={form.values.productImages || []}
                onChange={(images) => form.setFieldValue('productImages', images)}
                maxImages={8}
              />
            )}
          </Field>
        </div>

                    {/* Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Field
                        as="textarea"
                        name="description"
            rows={4}
            placeholder={`Enter details about this ${selectedBrand} ${values.model || 'product'}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
                      </div>
                    </div>

      <div className="flex justify-between">
                          <button
                            type="button"
          onClick={() => setStep(3)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Details
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
          className="flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'} <FaCheck className="ml-2" />
                  </button>
                </div>
              </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Smart Product Wizard</h1>
            <p className="text-gray-600 mt-2">Add products quickly with our intelligent form</p>
          </div>

          {renderStepIndicator()}

          <Formik
            initialValues={{
              name: '',
              description: '',
              price: '',
              quantity: '',
              mainCategoryId: '',
              categoryId: '',
              model: '',
              storage: '',
              color: '',
              customColor: '',
              condition: '',
              imei: '',
              batteryHealth: 100,
              batteryCycles: '',
              productImages: []
            }}
            validationSchema={VALIDATION_SCHEMA}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {step === 1 && renderStep1(setFieldValue)}
                {step === 2 && renderStep2(setFieldValue)}
                {step === 3 && renderStep3(values, setFieldValue)}
                {step === 4 && renderStep4(values)}
            </Form>
          )}
        </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddProductWizard;