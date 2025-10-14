import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaSave, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { usersAPI } from '../../utils/api';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch profile from backend
  useEffect(() => {
    if (currentUser?.id) {
      setLoading(true);
      usersAPI.getById(currentUser.id)
        .then(res => {
          setProfile(res.data);
          if (res.data.profilePicture) setImagePreview(res.data.profilePicture);
        })
        .catch(error => {
          console.error('Failed to load profile:', error);
          toast.error('Failed to load profile');
        })
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // Validation schema
  const ProfileSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9+-]+$/, 'Phone number can only contain digits, + and -')
      .min(10, 'Phone number is too short')
      .max(15, 'Phone number is too long'),
    address: Yup.string()
      .max(200, 'Address is too long')
  });

  // Handle image selection
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    
    if (file) {
      setFieldValue('profileImage', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      // If you want to support file uploads, use FormData; for now, just send JSON
      const res = await usersAPI.update(currentUser.id, {
        ...values,
        profilePicture: imagePreview // send preview if changed, else backend keeps old
      });
      setProfile(res.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Please log in to view your profile</div>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Formik
          enableReinitialize
          initialValues={{
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            profileImage: null
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt={currentUser.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                          <FaUser className="w-20 h-20" />
                        </div>
                      )}
                    </div>
                    <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                      <FaCamera className="h-5 w-5" />
                      <input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageChange(event, setFieldValue)}
                      />
                    </label>
                  </div>
                  <p className="text-center text-gray-600 text-sm mb-4">
                    Click the camera icon to change your profile picture
                  </p>
                </div>
                
                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                      placeholder="Enter your email address"
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      id="phone"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address
                    </label>
                    <Field
                      as="textarea"
                      name="address"
                      id="address"
                      rows={3}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your shipping address"
                    />
                    <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2 -ml-1 h-5 w-5" />
                  {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
