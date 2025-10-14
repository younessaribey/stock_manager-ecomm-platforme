import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { categoriesAPI } from '../../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch categories helper so it can be reused
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Validation schema
  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Category name is too short')
      .max(50, 'Category name is too long')
      .required('Category name is required'),
    description: Yup.string()
      .max(200, 'Description is too long')
  }); 

  // Handle category creation
  const handleAddCategory = async (values, { resetForm }) => {
    try {
      const response = await categoriesAPI.create({
        name: values.name,
        description: values.description || ''
      });
      await fetchCategories();
      resetForm();
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Handle category update
  const handleUpdateCategory = async (values, { resetForm }) => {
    try {
      const response = await categoriesAPI.update(editingCategory.id, {
        name: values.name,
        description: values.description
      });
      await fetchCategories();
      setEditingCategory(null);
      resetForm();
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.delete(id);
      await fetchCategories();
      setConfirmDelete(null);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Set up category for editing
  const startEditing = (category) => {
    setEditingCategory(category);
  };

  // Cancel editing
  const cancelEditing = (resetForm) => {
    setEditingCategory(null);
    resetForm();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <Formik
              initialValues={{
                name: editingCategory ? editingCategory.name : '',
                description: editingCategory ? editingCategory.description : ''
              }}
              enableReinitialize
              validationSchema={CategorySchema}
              onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter category name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={3}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter category description"
                    />
                    <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => cancelEditing(resetForm)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaPlus className="mr-2 -ml-1 h-4 w-4" />
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.length > 0 ? (
                    categories.map((category, idx) => (
                      <tr key={category.id || idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 truncate max-w-xs">{category.description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.productCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => startEditing(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(category.id)}
                              className={`text-red-600 hover:text-red-900 ${
                                category.productCount > 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={category.productCount > 0}
                              title={category.productCount > 0 ? 'Cannot delete categories with products' : 'Delete category'}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No categories found. Add your first category!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this category? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(confirmDelete)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
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

export default Categories;
