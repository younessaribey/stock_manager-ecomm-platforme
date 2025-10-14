import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaSave, 
  FaTrash, 
  FaImage, 
  FaVideo, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok,
  FaPlus,
  FaEdit,
  FaEye
} from 'react-icons/fa';
import api from '../../utils/api';

const NewsManagement = () => {
  const [newsContent, setNewsContent] = useState({
    featuredImage: '',
    logoUrl: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: ''
    },
    youtubeVideos: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  useEffect(() => {
    fetchNewsContent();
  }, []);

  const fetchNewsContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/news');
      setNewsContent(response.data);
    } catch (error) {
      console.error('Error fetching news content:', error);
      setMessage('Error loading content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/api/news', newsContent);
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (type === 'featured') {
        setNewsContent(prev => ({ ...prev, featuredImage: response.data.url }));
      } else if (type === 'logo') {
        setNewsContent(prev => ({ ...prev, logoUrl: response.data.url }));
      }
      
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setNewsContent(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addYouTubeVideo = () => {
    if (!newVideoUrl || !newVideoTitle) {
      setMessage('Please enter both video URL and title');
      return;
    }

    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(newVideoUrl);
    if (!videoId) {
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    const newVideo = {
      id: videoId,
      title: newVideoTitle,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };

    setNewsContent(prev => ({
      ...prev,
      youtubeVideos: [...prev.youtubeVideos, newVideo]
    }));

    setNewVideoUrl('');
    setNewVideoTitle('');
    setMessage('Video added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const removeYouTubeVideo = (index) => {
    setNewsContent(prev => ({
      ...prev,
      youtubeVideos: prev.youtubeVideos.filter((_, i) => i !== index)
    }));
  };

  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getSocialIcon = (platform) => {
    const iconProps = { size: 20, className: "text-gray-600" };
    switch (platform) {
      case 'facebook': return <FaFacebook {...iconProps} className="text-blue-600" />;
      case 'instagram': return <FaInstagram {...iconProps} className="text-pink-600" />;
      case 'twitter': return <FaTwitter {...iconProps} className="text-blue-400" />;
      case 'youtube': return <FaYoutube {...iconProps} className="text-red-600" />;
      case 'tiktok': return <FaTiktok {...iconProps} className="text-black" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News Page Management</h1>
            <p className="text-gray-600 mt-2">Manage content for the news/nouveautés page</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <FaSave />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </motion.button>
        </div>
        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {message}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Images */}
        <div className="space-y-8">
          
          {/* Featured Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaImage className="mr-2 text-blue-600" />
              Featured Image
            </h2>
            
            <div className="space-y-4">
              {newsContent.featuredImage && (
                <div className="relative">
                  <img
                    src={newsContent.featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setNewsContent(prev => ({ ...prev, featuredImage: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'featured')}
                  className="hidden"
                />
                <label
                  htmlFor="featured-image"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FaUpload className="text-4xl text-gray-400" />
                  <span className="text-gray-600">Click to upload featured image</span>
                  <span className="text-sm text-gray-400">JPG, PNG, GIF up to 10MB</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaImage className="mr-2 text-purple-600" />
              Brand Logo
            </h2>
            
            <div className="space-y-4">
              {newsContent.logoUrl && (
                <div className="relative">
                  <img
                    src={newsContent.logoUrl}
                    alt="Logo"
                    className="w-full h-32 object-contain bg-gray-50 rounded-lg shadow-md p-4"
                  />
                  <button
                    onClick={() => setNewsContent(prev => ({ ...prev, logoUrl: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="logo-image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="hidden"
                />
                <label
                  htmlFor="logo-image"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FaUpload className="text-4xl text-gray-400" />
                  <span className="text-gray-600">Click to upload logo</span>
                  <span className="text-sm text-gray-400">PNG with transparent background recommended</span>
                </label>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Social Media & Videos */}
        <div className="space-y-8">
          
          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
            
            <div className="space-y-4">
              {Object.entries(newsContent.socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-24">
                    {getSocialIcon(platform)}
                    <span className="capitalize text-sm font-medium">{platform}</span>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    placeholder={`Enter ${platform} URL`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* YouTube Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaVideo className="mr-2 text-red-600" />
              YouTube Videos
            </h2>
            
            {/* Add New Video */}
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Add New Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="YouTube Video URL"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Video Title"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addYouTubeVideo}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Video</span>
              </button>
            </div>

            {/* Video List */}
            <div className="space-y-4">
              {newsContent.youtubeVideos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{video.title}</p>
                    <p className="text-sm text-gray-500">ID: {video.id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </a>
                    <button
                      onClick={() => removeYouTubeVideo(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {newsContent.youtubeVideos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaVideo className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No videos added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaEye />
            <span>View Live Page</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Featured Image:</h4>
              {newsContent.featuredImage ? (
                <img src={newsContent.featuredImage} alt="Featured" className="w-full h-24 object-cover rounded mt-2" />
              ) : (
                <div className="w-full h-24 bg-gray-200 rounded mt-2 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Videos: {newsContent.youtubeVideos.length}</h4>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Logo:</h4>
              {newsContent.logoUrl ? (
                <img src={newsContent.logoUrl} alt="Logo" className="w-full h-24 object-contain bg-white rounded mt-2" />
              ) : (
                <div className="w-full h-24 bg-gray-200 rounded mt-2 flex items-center justify-center">
                  <span className="text-gray-400">No logo</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Social Links:</h4>
              <div className="flex space-x-2 mt-2">
                {Object.entries(newsContent.socialLinks).map(([platform, url]) => (
                  <div key={platform} className={`p-2 rounded ${url ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {getSocialIcon(platform)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsManagement;
