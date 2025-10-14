import React from 'react';
import { FaIndustry, FaHistory, FaHandshake, FaChartLine } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`py-16 ${isDark ? 'bg-gradient-to-br from-slate-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Brothers Phone</h1>
            <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Your trusted partner for smartphones, tablets & accessories since 2005.
            </p>
            <div className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-md shadow-lg">
              15+ Years of Excellence
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold mb-10 text-center border-b-4 border-blue-600 pb-3 inline-block ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Story
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Founded in 2005, Brothers Phone began as a small family-owned business with a vision to provide the best smartphones, tablets, and accessories in Algeria. Our focus has always been on quality, reliability, and exceptional customer service.
            </p>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              What started with just 5 employees and a modest store has grown into a trusted brand with multiple locations across Algeria, serving thousands of happy customers from students to professionals.
            </p>
            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Today, we pride ourselves on offering an extensive catalog of mobile devices, expert technical support, and a dedication to helping our customers find the perfect device for their needs.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our <span className="text-blue-600">Core Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="bg-blue-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaIndustry className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quality First</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                We source only the highest quality devices that meet rigorous standards.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="bg-blue-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Partnership</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                We build lasting relationships by understanding and addressing our customers' unique needs.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="bg-blue-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reliability</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Our products and services are dependable, consistent and delivered on time, every time.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="bg-blue-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Innovation</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                We continuously seek  better solutions and cutting-edge products to keep our customers ahead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Leadership Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className={`w-40 h-40 mx-auto rounded-full mb-4 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <img src="https://via.placeholder.com/300x300?text=CEO" alt="CEO" className="w-full h-full object-cover" />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ahmed Brothers</h3>
              <p className="text-blue-600 font-medium mb-3">Chief Executive Officer</p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                15+ years of experience in mobile device retail and customer service.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className={`w-40 h-40 mx-auto rounded-full mb-4 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <img src="https://via.placeholder.com/300x300?text=COO" alt="COO" className="w-full h-full object-cover" />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Karim Brothers</h3>
              <p className="text-blue-600 font-medium mb-3">Chief Operations Officer</p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Expert in logistics and inventory management for mobile devices.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className={`w-40 h-40 mx-auto rounded-full mb-4 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <img src="https://via.placeholder.com/300x300?text=CTO" alt="CTO" className="w-full h-full object-cover" />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Yacine Brothers</h3>
              <p className="text-blue-600 font-medium mb-3">Technical Director</p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Pioneering digital solutions and technical support for mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
