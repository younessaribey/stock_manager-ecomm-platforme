import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok,
  FaPlay,
  FaExternalLinkAlt,
  FaStar,
  FaHeart
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../utils/api';

const News = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [newsContent, setNewsContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsContent();
  }, []);

  const fetchNewsContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/news');
      setNewsContent(response.data);
    } catch (err) {
      console.error('Error fetching news content:', err);
      setError(err.message);
      // Set default content for demo
      setNewsContent({
        featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center',
        logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop&crop=center',
        socialLinks: {
          facebook: 'https://facebook.com/brothersphone',
          instagram: 'https://instagram.com/brothersphone',
          twitter: 'https://twitter.com/brothersphone',
          youtube: 'https://youtube.com/brothersphone',
          tiktok: 'https://tiktok.com/@brothersphone'
        },
        youtubeVideos: [
          { id: 'dQw4w9WgXcQ', title: 'Latest iPhone Review', thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=180&fit=crop&crop=center' },
          { id: 'dQw4w9WgXcQ', title: 'Samsung Galaxy Features', thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=320&h=180&fit=crop&crop=center' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        bounce: 0.3
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };

  const socialIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "backOut"
      }
    }),
    hover: {
      scale: 1.2,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  const getSocialIcon = (platform) => {
    const iconProps = { size: 28, className: "text-white" };
    switch (platform) {
      case 'facebook': return <FaFacebook {...iconProps} />;
      case 'instagram': return <FaInstagram {...iconProps} />;
      case 'twitter': return <FaTwitter {...iconProps} />;
      case 'youtube': return <FaYoutube {...iconProps} />;
      case 'tiktok': return <FaTiktok {...iconProps} />;
      default: return <FaExternalLinkAlt {...iconProps} />;
    }
  };

  const getSocialColor = (platform) => {
    const colors = {
      facebook: 'from-blue-600 to-blue-800',
      instagram: 'from-pink-500 via-red-500 to-yellow-500',
      twitter: 'from-blue-400 to-blue-600',
      youtube: 'from-red-500 to-red-700',
      tiktok: 'from-black to-gray-800'
    };
    return colors[platform] || 'from-gray-500 to-gray-700';
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'}`}>
      {/* Header Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600'}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: "linear-gradient(90deg, #fff, #ffd700, #fff, #ffd700, #fff)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {t.news?.title || 'Latest News & Updates'}
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl opacity-90"
            >
              {t.news?.subtitle || 'Stay updated with our latest products and announcements'}
            </motion.p>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-white opacity-20"
        >
          <FaStar size={40} />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 text-white opacity-20"
        >
          <FaHeart size={35} />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Featured Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="space-y-8"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <img
                  src={newsContent?.featuredImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center'}
                  alt={t.news?.featuredImage || 'Featured Image'}
                  className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{t.news?.featuredImage || 'Featured Content'}</h3>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* YouTube Videos Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.news?.youtubeVideos || 'Latest Videos'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsContent?.youtubeVideos?.map((video, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="bg-red-600 rounded-full p-3"
                        >
                          <FaPlay className="text-white text-xl ml-1" />
                        </motion.div>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm font-medium group-hover:text-blue-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {video.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Logo and Social Media */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="space-y-12"
          >
            
            {/* Animated Logo Section */}
            <div className="text-center">
              <motion.h2 
                variants={itemVariants}
                className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {t.news?.logoAnimation || 'Our Brand'}
              </motion.h2>
              <motion.div
                variants={logoVariants}
                whileHover="hover"
                className="relative inline-block"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 40px rgba(147, 51, 234, 0.4)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-white rounded-2xl p-8 shadow-2xl"
                  >
                    <img
                      src={newsContent?.logoUrl || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop&crop=center'}
                      alt="Brothers Phone Logo"
                      className="w-64 h-40 object-contain mx-auto"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop&crop=center';
                      }}
                    />
                  </motion.div>
                  
                  {/* Rotating Border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                      padding: "3px"
                    }}
                  >
                    <div className="w-full h-full bg-white rounded-2xl"></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Social Media Section */}
            <motion.div variants={itemVariants} className="text-center space-y-8">
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.news?.socialMedia || 'Follow Us'}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6">
                {newsContent?.socialLinks && Object.entries(newsContent.socialLinks).map(([platform, url], index) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    custom={index}
                    variants={socialIconVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    className={`relative group p-4 rounded-2xl bg-gradient-to-r ${getSocialColor(platform)} shadow-lg hover:shadow-2xl transition-shadow duration-300`}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    >
                      {getSocialIcon(platform)}
                    </motion.div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    {/* Platform Name */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-medium text-gray-600 capitalize bg-white px-2 py-1 rounded shadow-lg">
                        {platform}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Stats */}
              <motion.div
                variants={itemVariants}
                className={`rounded-2xl p-6 shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      className="text-2xl font-bold text-blue-600"
                    >
                      10K+
                    </motion.div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Followers</p>
                  </div>
                  <div className="space-y-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="text-2xl font-bold text-blue-500"
                    >
                      500+
                    </motion.div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Posts</p>
                  </div>
                  <div className="space-y-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="text-2xl font-bold text-blue-700"
                    >
                      50K+
                    </motion.div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Likes</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`py-16 ${isDark ? 'bg-gradient-to-r from-gray-800 to-slate-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h2
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Stay Connected with Brothers Phone
          </motion.h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on our latest updates and exclusive offers!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
              isDark 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white text-blue-600 hover:bg-gray-50'
            }`}
          >
            Explore Our Products
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default News;
