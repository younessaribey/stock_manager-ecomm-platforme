import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Show success message temporarily
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`py-16 ${isDark ? 'bg-gradient-to-br from-slate-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              We're here to help with all your phone and device needs.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Info + Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-2/5">
              <h2 className={`text-3xl font-bold mb-8 border-b-4 border-blue-500 pb-3 inline-block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Get In Touch
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Location</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Brothers Phone Store<br />
                      Multiple Locations<br />
                      Algeria
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Main: (555) 123-4567<br />
                      Support: (555) 987-6543
                    </p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      contact@brothersphone.com<br />
                      support@brothersphone.com
                    </p>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex items-start">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Hours</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Monday - Saturday: 9:00 AM - 8:00 PM<br />
                      Sunday: 10:00 AM - 6:00 PM<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className={`lg:w-3/5 p-8 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Send Us a Message</h2>
              
              {formSubmitted && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Thank you for your message! We'll get back to you shortly.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div className="mb-6">
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                {/* Message */}
                <div className="mb-6">
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaPaperPlane className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section - This would be a real map in production */}
      <div className={`w-full h-96 mb-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div className={`text-center p-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-lg font-semibold mb-2">Map would be displayed here</p>
            <p>Using Google Maps or another map provider</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
