const fs = require('fs').promises;
const path = require('path');

// Path to store news data
const NEWS_DATA_PATH = path.join(__dirname, '../data/news.json');

// Default news content
const DEFAULT_NEWS_CONTENT = {
  featuredImage: '',
  logoUrl: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: ''
  },
  youtubeVideos: [],
  lastUpdated: new Date().toISOString()
};

// Ensure news data file exists
const ensureNewsDataFile = async () => {
  try {
    await fs.access(NEWS_DATA_PATH);
  } catch (error) {
    // File doesn't exist, create it with default content
    await fs.mkdir(path.dirname(NEWS_DATA_PATH), { recursive: true });
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(DEFAULT_NEWS_CONTENT, null, 2));
  }
};

// Get news content
exports.getNewsContent = async (req, res) => {
  try {
    await ensureNewsDataFile();
    const data = await fs.readFile(NEWS_DATA_PATH, 'utf8');
    const newsContent = JSON.parse(data);
    
    res.status(200).json({
      success: true,
      data: newsContent
    });
  } catch (error) {
    console.error('Error getting news content:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving news content',
      error: error.message
    });
  }
};

// Update news content
exports.updateNewsContent = async (req, res) => {
  try {
    await ensureNewsDataFile();
    
    const updatedContent = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    // Validate required structure
    if (!updatedContent.socialLinks) {
      updatedContent.socialLinks = DEFAULT_NEWS_CONTENT.socialLinks;
    }
    
    if (!updatedContent.youtubeVideos) {
      updatedContent.youtubeVideos = [];
    }
    
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(updatedContent, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'News content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating news content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news content',
      error: error.message
    });
  }
};

// Add YouTube video
exports.addYouTubeVideo = async (req, res) => {
  try {
    await ensureNewsDataFile();
    const data = await fs.readFile(NEWS_DATA_PATH, 'utf8');
    const newsContent = JSON.parse(data);
    
    const { videoId, title } = req.body;
    
    if (!videoId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Video ID and title are required'
      });
    }
    
    const newVideo = {
      id: videoId,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      addedAt: new Date().toISOString()
    };
    
    newsContent.youtubeVideos = newsContent.youtubeVideos || [];
    newsContent.youtubeVideos.push(newVideo);
    newsContent.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(newsContent, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'YouTube video added successfully',
      data: newsContent
    });
  } catch (error) {
    console.error('Error adding YouTube video:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding YouTube video',
      error: error.message
    });
  }
};

// Remove YouTube video
exports.removeYouTubeVideo = async (req, res) => {
  try {
    await ensureNewsDataFile();
    const data = await fs.readFile(NEWS_DATA_PATH, 'utf8');
    const newsContent = JSON.parse(data);
    
    const { index } = req.params;
    const videoIndex = parseInt(index);
    
    if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= newsContent.youtubeVideos.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video index'
      });
    }
    
    newsContent.youtubeVideos.splice(videoIndex, 1);
    newsContent.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(newsContent, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'YouTube video removed successfully',
      data: newsContent
    });
  } catch (error) {
    console.error('Error removing YouTube video:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing YouTube video',
      error: error.message
    });
  }
};

// Update social links
exports.updateSocialLinks = async (req, res) => {
  try {
    await ensureNewsDataFile();
    const data = await fs.readFile(NEWS_DATA_PATH, 'utf8');
    const newsContent = JSON.parse(data);
    
    const { socialLinks } = req.body;
    
    if (!socialLinks || typeof socialLinks !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Social links object is required'
      });
    }
    
    newsContent.socialLinks = {
      ...newsContent.socialLinks,
      ...socialLinks
    };
    newsContent.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(newsContent, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'Social links updated successfully',
      data: newsContent
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social links',
      error: error.message
    });
  }
};

// Reset news content to default
exports.resetNewsContent = async (req, res) => {
  try {
    await fs.writeFile(NEWS_DATA_PATH, JSON.stringify(DEFAULT_NEWS_CONTENT, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'News content reset to default',
      data: DEFAULT_NEWS_CONTENT
    });
  } catch (error) {
    console.error('Error resetting news content:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting news content',
      error: error.message
    });
  }
};
