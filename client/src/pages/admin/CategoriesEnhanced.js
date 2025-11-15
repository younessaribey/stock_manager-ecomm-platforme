import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaChevronDown, 
  FaChevronRight,
  FaMobileAlt,
  FaTabletAlt,
  FaLaptop,
  FaClock,
  FaPlug,
  FaBox,
  FaEye,
  FaEyeSlash,
  FaFolder,
  FaTag
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { categoriesAPI } from '../../utils/api';

const CategoriesEnhanced = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [addingSubcategory, setAddingSubcategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'sub'

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      
      console.log('Categories API response:', response.data);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase();
    
    // Brothers Phone specific category icons
    if (name === 'occasions') return <div className="text-orange-600 text-xl">🔋</div>;
    if (name === 'smartphones') return <div className="text-blue-600 text-xl">📱</div>;
    if (name === 'smartwatches') return <div className="text-green-600 text-xl">⌚</div>;
    if (name === 'tablets') return <div className="text-purple-600 text-xl">📱</div>;
    if (name === 'laptop') return <div className="text-gray-700 text-xl">💻</div>;
    if (name === 'affaire du jour') return <div className="text-yellow-600 text-xl">💰</div>;
    if (name === 'accessoires') return <div className="text-orange-600 text-xl">🔌</div>;
    if (name === "brother's packs") return <div className="text-indigo-600 text-xl">📦</div>;
    if (name === 'livraison gratuite') return <div className="text-green-600 text-xl">🚚</div>;
    
    // Brand-specific icons for subcategories
    if (name === 'apple') return <div className="text-gray-800 text-lg">🍎</div>;
    if (name === 'samsung') return <div className="text-blue-600 text-lg">📱</div>;
    if (name === 'huawei') return <div className="text-red-600 text-lg">🌟</div>;
    if (name === 'google') return <div className="text-multicolor text-lg">🔍</div>;
    if (name === 'dell') return <div className="text-blue-600 text-lg">🖥️</div>;
    if (name === 'hp') return <div className="text-blue-700 text-lg">💻</div>;
    if (name === 'ipad') return <div className="text-gray-800 text-lg">📱</div>;
    
    // Fallback for other categories
    if (name?.includes('smartphone') || name?.includes('phone')) return <FaMobileAlt className="text-blue-600" />;
    if (name?.includes('tablet')) return <FaTabletAlt className="text-purple-600" />;
    if (name?.includes('laptop')) return <FaLaptop className="text-gray-600" />;
    if (name?.includes('watch')) return <FaClock className="text-green-600" />;
    if (name?.includes('accessoire')) return <FaPlug className="text-orange-600" />;
    return <FaBox className="text-gray-500" />;
  };

  // Toggle category expansion
  const toggleExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle main category creation
  const handleCreateMainCategory = async (values, { resetForm }) => {
    try {
      await categoriesAPI.create({
        name: values.name,
        description: values.description || '',
        level: 0,
        isActive: true
      });
      
      toast.success('Main category created successfully');
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  // Handle subcategory creation
  const handleCreateSubcategory = async (values, { resetForm }) => {
    try {
      await categoriesAPI.create({
        name: values.name,
        parentId: addingSubcategory,
        level: 1,
        isActive: true
      });
      
      toast.success('Subcategory created successfully');
      resetForm();
      setAddingSubcategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Failed to create subcategory');
    }
  };

  // Handle category update
  const handleUpdateCategory = async (values) => {
    try {
      await categoriesAPI.update(editingCategory.id, {
        name: values.name,
        description: values.description || '',
        isActive: values.isActive
      });
      
      toast.success('Category updated successfully');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoriesAPI.delete(categoryId);
      
      toast.success('Category deleted successfully');
      setConfirmDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. It may contain products.');
    }
  };

  // Toggle category active status
  const toggleCategoryStatus = async (category) => {
    try {
      await categoriesAPI.update(category.id, {
        ...category,
        isActive: !category.isActive
      });
      
      toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Failed to update category status');
    }
  };

  // Validation schemas
  const MainCategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Name is required'),
    description: Yup.string().max(200, 'Description is too long')
  });

  const SubcategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Name is required')
  });

  // Separate main categories and subcategories
  const mainCategories = categories.filter(cat => !cat.parentId);
  const subcategories = categories.filter(cat => cat.parentId);

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">📱 Brothers Phone Categories</h1>
            <p className="text-blue-100 mt-1">Manage your product categories and subcategories</p>
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                📂 {mainCategories.length} Main Categories
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                🏷️ {subcategories.length} Subcategories
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl mb-2">🛍️</div>
            <div className="text-sm text-blue-100">Brothers Phone</div>
            <div className="text-xs text-blue-200">Category Management</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'main' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaFolder className="inline mr-2" />
            Main Categories ({mainCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sub' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaTag className="inline mr-2" />
            Subcategories ({subcategories.length})
          </button>
        </div>
      </div>

      {/* Main Categories Tab */}
      {activeTab === 'main' && (
        <div className="space-y-6">
          {/* Add New Main Category Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaPlus className="mr-2 text-blue-600" />
              Add New Main Category
            </h2>
            
            <Formik
              initialValues={{ name: '', description: '' }}
              validationSchema={MainCategorySchema}
              onSubmit={handleCreateMainCategory}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Category name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      name="description"
                      type="text"
                      placeholder="Description (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Main Category'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Main Categories List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Main Categories</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mainCategories.map((category) => (
                <div key={category.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleExpansion(category.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(category.name)}
                        <div>
                          {editingCategory?.id === category.id ? (
                            <Formik
                              initialValues={{
                                name: category.name,
                                description: category.description || '',
                                isActive: category.isActive
                              }}
                              validationSchema={MainCategorySchema}
                              onSubmit={handleUpdateCategory}
                            >
                              {({ isSubmitting }) => (
                                <Form className="flex items-center space-x-2">
                                  <Field
                                    name="name"
                                    type="text"
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <Field
                                    name="description"
                                    type="text"
                                    placeholder="Description"
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <label className="flex items-center">
                                    <Field name="isActive" type="checkbox" className="mr-1" />
                                    <span className="text-sm">Active</span>
                                  </label>
                                  <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <FaTimes />
                                  </button>
                                </Form>
                              )}
                            </Formik>
                          ) : (
                            <div>
                              <h3 className={`font-semibold text-lg ${category.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {category.name}
                                {!category.isActive && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>}
                              </h3>
                              {category.description && (
                                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(category)}
                        className={`p-1 rounded ${category.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={category.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {category.isActive ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => setAddingSubcategory(category.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Add Subcategory"
                      >
                        <FaPlus />
                      </button>
                      
                      <button
                        onClick={() => setConfirmDelete(category.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Add Subcategory Form */}
                  {addingSubcategory === category.id && (
                    <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Add Subcategory to {category.name}</h4>
                      <Formik
                        initialValues={{ name: '' }}
                        validationSchema={SubcategorySchema}
                        onSubmit={handleCreateSubcategory}
                      >
                        {({ isSubmitting }) => (
                          <Form className="flex items-end space-x-3">
                            <div className="flex-1">
                              <Field
                                name="name"
                                type="text"
                                placeholder="Subcategory name"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddingSubcategory(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}

                  {/* Subcategories */}
                  {expandedCategories[category.id] && category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-4 ml-8 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-6 bg-blue-300 rounded"></div>
                            <div>
                              {editingCategory?.id === subcategory.id ? (
                                <Formik
                                  initialValues={{
                                    name: subcategory.name,
                                    isActive: subcategory.isActive
                                  }}
                                  validationSchema={SubcategorySchema}
                                  onSubmit={handleUpdateCategory}
                                >
                                  {({ isSubmitting }) => (
                                    <Form className="flex items-center space-x-2">
                                      <Field
                                        name="name"
                                        type="text"
                                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                      />
                                      <label className="flex items-center">
                                        <Field name="isActive" type="checkbox" className="mr-1" />
                                        <span className="text-sm">Active</span>
                                      </label>
                                      <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="text-green-600 hover:text-green-800"
                                      >
                                        <FaSave />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
                                        className="text-gray-600 hover:text-gray-800"
                                      >
                                        <FaTimes />
                                      </button>
                                    </Form>
                                  )}
                                </Formik>
                              ) : (
                                <div>
                                  <h4 className={`font-medium ${subcategory.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {subcategory.name}
                                    {!subcategory.isActive && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>}
                                  </h4>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleCategoryStatus(subcategory)}
                              className={`p-1 rounded ${subcategory.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                              title={subcategory.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {subcategory.isActive ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            
                            <button
                              onClick={() => setEditingCategory(subcategory)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            
                            <button
                              onClick={() => setConfirmDelete(subcategory.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {mainCategories.length === 0 && (
              <div className="p-12 text-center">
                <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No main categories yet</h3>
                <p className="text-gray-600">Create your first main category to get started</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subcategories Tab */}
      {activeTab === 'sub' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Subcategories</h2>
            <p className="text-gray-600 mt-1">Manage all subcategories across different main categories</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {subcategories.map((subcategory) => {
              const parentCategory = mainCategories.find(cat => cat.id === subcategory.parentId);
              return (
                <div key={subcategory.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(subcategory.name)}
                        <div>
                          {editingCategory?.id === subcategory.id ? (
                            <Formik
                              initialValues={{
                                name: subcategory.name,
                                isActive: subcategory.isActive
                              }}
                              validationSchema={SubcategorySchema}
                              onSubmit={handleUpdateCategory}
                            >
                              {({ isSubmitting }) => (
                                <Form className="flex items-center space-x-2">
                                  <Field
                                    name="name"
                                    type="text"
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <label className="flex items-center">
                                    <Field name="isActive" type="checkbox" className="mr-1" />
                                    <span className="text-sm">Active</span>
                                  </label>
                                  <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <FaTimes />
                                  </button>
                                </Form>
                              )}
                            </Formik>
                          ) : (
                            <div>
                              <h4 className={`font-medium ${subcategory.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {subcategory.name}
                                {!subcategory.isActive && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>}
                              </h4>
                              {parentCategory && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Under: <span className="font-medium">{parentCategory.name}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(subcategory)}
                        className={`p-1 rounded ${subcategory.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={subcategory.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {subcategory.isActive ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      
                      <button
                        onClick={() => setEditingCategory(subcategory)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => setConfirmDelete(subcategory.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {subcategories.length === 0 && (
            <div className="p-12 text-center">
              <FaTag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subcategories yet</h3>
              <p className="text-gray-600">Add subcategories to your main categories to organize products</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FaTrash className="text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesEnhanced;
