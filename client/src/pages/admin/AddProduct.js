import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaImage, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productsAPI, categoriesAPI } from '../../utils/api';
import APP_CONFIG from '../../config/appConfig';

const AddProduct = () => {
  const { id } = useParams(); // If id exists, we're editing an existing product
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Handle main category selection
  const handleMainCategoryChange = (categoryId, setFieldValue) => {
    if (!categoryId) {
      setSelectedMainCategory(null);
      setSubcategories([]);
      setFieldValue('categoryId', '');
      return;
    }

    const parsedCategoryId = parseInt(categoryId);
    const category = categories.find(cat => cat.id === parsedCategoryId);
    
    console.log('Selected category:', category); // Debug log
    setSelectedMainCategory(category);
    
    if (category && category.subcategories && category.subcategories.length > 0) {
      console.log('Found subcategories:', category.subcategories); // Debug log
      setSubcategories(category.subcategories);
      // Reset subcategory selection when main category changes
      setFieldValue('categoryId', '');
    } else {
      setSubcategories([]);
      // If no subcategories, use the main category
      setFieldValue('categoryId', parsedCategoryId);
    }
  };

  // Validation schema
  const ProductSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(100, 'Name is too long')
      .required('Product name is required'),
    description: Yup.string()
      .min(10, 'Description is too short')
      .max(1000, 'Description is too long')
      .required('Description is required'),
    categoryId: Yup.number()
      .required('Category is required'),
    price: Yup.number()
      .positive('Price must be positive')
      .required('Price is required'),
    quantity: Yup.number()
      .integer('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative')
      .required('Quantity is required'),
    // New validation for phone fields
    imei: Yup.string()
      .matches(/^[0-9A-Za-z\s-]{10,20}$/, 'Invalid IMEI/Serial Number format')
      .nullable(),
    condition: Yup.string()
      .oneOf(['new', 'used', 'refurbished'], 'Invalid condition')
      .required('Condition is required'),
    storage: Yup.string()
      .nullable(),
    color: Yup.string()
      .nullable(),
    model: Yup.string()
      .nullable(),
    batteryHealth: Yup.number()
      .integer('Battery health must be a whole number')
      .min(0, 'Battery health cannot be negative')
      .max(100, 'Battery health cannot exceed 100%')
      .nullable()
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch product if editing (only run after categories are loaded)
    const fetchProduct = async () => {
      if (id && categories.length > 0) {
        try {
          const response = await productsAPI.getById(id);
          const productData = response.data;
          
          setProduct(productData);
          
          // Set up category selection for editing
          if (productData.categoryId) {
            const category = categories.find(cat => 
              cat.id === productData.categoryId || 
              (cat.subcategories && cat.subcategories.some(sub => sub.id === productData.categoryId))
            );
            
            if (category) {
              // Check if it's a subcategory
              const subcategory = category.subcategories?.find(sub => sub.id === productData.categoryId);
              if (subcategory) {
                setSelectedMainCategory(category);
                setSubcategories(category.subcategories);
              } else {
                setSelectedMainCategory(category);
                setSubcategories([]);
              }
            }
          }
          
          // Set image preview if product has an image
          if (productData.imageUrl) {
            const apiBase = APP_CONFIG.API_URL.replace(/\/api$/, '');
            const imageUrl = productData.imageUrl.startsWith('http') 
              ? productData.imageUrl 
              : `${apiBase}${productData.imageUrl}`;
            setImagePreview(imageUrl);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product data');
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, categories]);

  // Handle file selection
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    
    if (file) {
      setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview and field
  const clearImage = (setFieldValue) => {
    setImagePreview(null);
    setFieldValue('image', null);
  };

  // Handle additional images selection
  const handleAdditionalImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    
    if (files.length > 0) {
      setAdditionalImages(prevImages => [...prevImages, ...files]);
      
      // Create previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews(prevPreviews => [...prevPreviews, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setAdditionalImages(prevImages => prevImages.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Submitting product form:', { ...values, image: values.image ? values.image.name : 'No image' });

      // Always use FormData for consistency in both create and update operations
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId);
      formData.append('price', values.price);
      formData.append('quantity', values.quantity);
      
      // Add new phone-specific fields
      if (values.imei) formData.append('imei', values.imei);
      formData.append('condition', values.condition);
      if (values.storage) formData.append('storage', values.storage);
      if (values.color) formData.append('color', values.color);
      if (values.model) formData.append('model', values.model);
      if (values.batteryHealth) formData.append('batteryHealth', values.batteryHealth);
      
      // Only append image if a new one was selected
      if (values.image) {
        console.log('Appending image to form:', values.image.name, values.image.size, 'bytes');
        formData.append('image', values.image);
      }

      // Append additional images if any
      additionalImages.forEach((image, index) => {
        console.log(`Appending additional image ${index}:`, image.name, image.size, 'bytes');
        formData.append('additionalImages', image);
      });
      
      let response;
      if (id) {
        console.log('Updating existing product ID:', id);
        // Always use updateWithImage for update operations - the backend will handle cases with or without new images
        response = await productsAPI.updateWithImage(id, formData);
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new product');
        // For new products, we must have an image (or let backend provide default)
        response = await productsAPI.createWithImage(formData);
        console.log('Create response:', response.data);
      }
      
      // Show success message
      toast.success(id ? 'Product updated successfully!' : 'Product added successfully!');
      
      // Redirect back to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Formik
          initialValues={{
            name: product?.name || '',
            description: product?.description || '',
            categoryId: product?.categoryId || '',
            price: product?.price || '',
            quantity: product?.quantity || '',
            image: null,
            // New fields for phone business
            imei: product?.imei || '',
            condition: product?.condition || 'used',
            storage: product?.storage || '',
            color: product?.color || '',
            model: product?.model || '',
            batteryHealth: product?.batteryHealth || ''
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter product name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter product description"
                    />
                    <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Category Selection */}
                  <div className="space-y-4">
                    {/* Main Category */}
                    <div>
                      <label htmlFor="mainCategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Main Product Category
                      </label>
                      <div className="mb-2 p-3 bg-green-50 border-l-4 border-green-400 text-green-700 text-sm">
                        <p className="font-medium">🎯 Step 1: Choose Product Type</p>
                        <p>Select what type of product you're adding. This will show you relevant brands to choose from.</p>
                      </div>
                      <select
                        name="mainCategoryId"
                        id="mainCategoryId"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        onChange={(e) => handleMainCategoryChange(e.target.value, setFieldValue)}
                        value={selectedMainCategory?.id || ''}
                      >
                        <option value="">What type of product are you adding?</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name === 'Smartphones' ? '📱' : 
                             category.name === 'Tablets' ? '📱' : 
                             category.name === 'Laptops' ? '💻' : 
                             category.name === 'Smartwatches' ? '⌚' : 
                             category.name === 'Accessories' ? '🔌' : '📦'} {category.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Categories: Smartphones, Tablets, Laptops, Smartwatches, Accessories
                      </p>
                    </div>

                    {/* Subcategory - Only show if main category has subcategories */}
                    {subcategories.length > 0 && (
                      <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedMainCategory?.name} Brand/Type
                        </label>
                        <div className="mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
                          <p className="font-medium">💡 Smart Brand Selection:</p>
                          <p>Choose the specific brand for your {selectedMainCategory?.name.toLowerCase()} product. This helps customers find exactly what they're looking for!</p>
                        </div>
                        <Field
                          as="select"
                          name="categoryId"
                          id="categoryId"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        >
                          <option value="">Choose a {selectedMainCategory?.name.toLowerCase()} brand...</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name} {subcategory.name.includes('Apple') ? '🍎' : 
                                                  subcategory.name.includes('Samsung') ? '📱' : 
                                                  subcategory.name.includes('HP') ? '💻' : 
                                                  subcategory.name.includes('Dell') ? '🖥️' : ''}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="categoryId" component="div" className="mt-1 text-sm text-red-600" />
                        <p className="mt-1 text-xs text-gray-500">
                          Available brands: {subcategories.map(sub => sub.name).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Show selected category info */}
                    {selectedMainCategory && subcategories.length === 0 && (
                      <div className="text-sm text-gray-600">
                        ✓ Category: {selectedMainCategory.name}
                      </div>
                    )}
                  </div>
                  
                  {/* Price and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <Field
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        min="0"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        placeholder="0.00"
                      />
                      <ErrorMessage name="price" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <Field
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="0"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        placeholder="0"
                      />
                      <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  {/* Phone-specific fields - Show for smartphone subcategories */}
                  {selectedMainCategory?.name === 'Smartphones' && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4 border-t pt-6">Phone Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Condition Checkbox */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Phone Condition *
                          </label>
                          <div className="space-y-2">
                            <label className="inline-flex items-center">
                              <Field
                                type="radio"
                                name="condition"
                                value="new"
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">New</span>
                            </label>
                            <label className="inline-flex items-center">
                              <Field
                                type="radio"
                                name="condition"
                                value="used"
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Used</span>
                            </label>
                            <label className="inline-flex items-center">
                              <Field
                                type="radio"
                                name="condition"
                                value="refurbished"
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Refurbished</span>
                            </label>
                          </div>
                          <ErrorMessage name="condition" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* IMEI/Serial Number */}
                        <div>
                          <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-1">
                            IMEI / Serial Number
                          </label>
                          <Field
                            type="text"
                            name="imei"
                            id="imei"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter IMEI or Serial Number"
                          />
                          <p className="mt-1 text-xs text-gray-500">Unique identifier for inventory tracking</p>
                          <ErrorMessage name="imei" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Storage Capacity */}
                        <div>
                          <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">
                            Storage Capacity
                          </label>
                          <Field
                            as="select"
                            name="storage"
                            id="storage"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select storage</option>
                            <option value="32GB">32GB</option>
                            <option value="64GB">64GB</option>
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB</option>
                          </Field>
                          <ErrorMessage name="storage" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Color */}
                        <div>
                          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <Field
                            type="text"
                            name="color"
                            id="color"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., Space Black, Silver, Gold"
                          />
                          <ErrorMessage name="color" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Model */}
                        <div className="md:col-span-2">
                          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                            Specific Model
                          </label>
                          <Field
                            type="text"
                            name="model"
                            id="model"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., iPhone 15 Pro Max, Galaxy S24 Ultra 5G"
                          />
                          <ErrorMessage name="model" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Battery Health - Only for Apple devices */}
                        {(() => {
                          const selectedCategory = subcategories.find(cat => cat.id === parseInt(values.categoryId)) || 
                                                 categories.find(cat => cat.id === parseInt(values.categoryId));
                          
                          // Check if this is any Apple subcategory (Smartphones, Tablets, or Laptops)
                          const isAppleSubcategory = selectedCategory?.name?.toLowerCase().includes('apple');
                          const isAppleCategory = ['Smartphones', 'Tablets', 'Laptop'].includes(selectedMainCategory?.name);
                          
                          if (isAppleCategory && isAppleSubcategory) {
                            return (
                              <div>
                                <label htmlFor="batteryHealth" className="block text-sm font-medium text-gray-700 mb-1">
                                  Battery Health <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Field
                                    type="number"
                                    name="batteryHealth"
                                    id="batteryHealth"
                                    min="0"
                                    max="100"
                                    className="appearance-none block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="85"
                                  />
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Apple device battery health percentage (0-100%)</p>
                                <ErrorMessage name="batteryHealth" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Image Upload */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-64">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="h-full mx-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => clearImage(setFieldValue)}
                          className="absolute top-0 right-0 p-1 rounded-full bg-red-600 text-white"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center flex flex-col items-center justify-center">
                        <FaImage className="h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload an image</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(event) => handleImageChange(event, setFieldValue)}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Images Upload */}
                  <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Images (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Add multiple photos of your product (max 5 additional images)</p>
                    
                    {/* Additional Images Upload Area */}
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center flex flex-col items-center justify-center">
                        <FaImage className="h-8 w-8 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="additionalImages" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload additional images</span>
                            <input
                              id="additionalImages"
                              name="additionalImages"
                              type="file"
                              multiple
                              className="sr-only"
                              accept="image/*"
                              onChange={handleAdditionalImagesChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB each
                        </p>
                      </div>
                    </div>

                    {/* Additional Images Preview */}
                    {additionalImagePreviews.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Images ({additionalImagePreviews.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {additionalImagePreviews.map((preview, index) => (
                            <div key={index} className="relative border rounded-lg overflow-hidden h-24">
                              <img 
                                src={preview} 
                                alt={`Additional preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2 -ml-1 h-5 w-5" />
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;
