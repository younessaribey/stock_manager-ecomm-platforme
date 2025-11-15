const cloudinary = require('cloudinary').v2;
const { ImgBBImage } = require('../config/dbSequelize');

// Cloudinary configuration from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary (admin only)
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file was uploaded' });
    }
    
    const imageFile = req.files.image;
    
    // Validate file type
    const fileExtension = imageFile.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only JPG, JPEG, PNG, GIF, and WebP images are allowed' 
      });
    }
    
    // Set max file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return res.status(400).json({ message: 'File size exceeds limit (5MB)' });
    }

    // Get upload options from request
    const folder = req.query.folder || 'general';
    const public_id = req.query.public_id || undefined;
    
    // Debug info
    console.log(`Uploading file: ${imageFile.name}, size: ${imageFile.size} bytes, mimetype: ${imageFile.mimetype}`);
    
    // Variable to hold the upload result
    let uploadResult;
    
    // Get file path from the uploaded file
    const tempFilePath = imageFile.tempFilePath;
    
    if (!tempFilePath) {
      console.log('No tempFilePath available. Using direct upload approach.');
      
      // We might be using a different express-fileupload configuration, try direct upload
      // For debugging - log the file data properties
      console.log(`File data available: ${imageFile.data ? 'Yes' : 'No'}, length: ${imageFile.data ? imageFile.data.length : 0}`);
      
      // Try simple direct upload using a buffer
      uploadResult = await cloudinary.uploader.upload(
        `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`,
        {
          folder,
          public_id: public_id || `${imageFile.name.split('.')[0]}_${Date.now()}`,
          resource_type: 'auto'
        }
      );
      
      console.log('Direct upload successful!');
    } else {
      console.log(`Using temp file for upload: ${tempFilePath}`);
      
      // Upload using the temporary file path which is usually more reliable
      uploadResult = await cloudinary.uploader.upload(
        tempFilePath,
        {
          folder,
          public_id: public_id || `${imageFile.name.split('.')[0]}_${Date.now()}`,
          resource_type: 'auto'
        }
      );
      
      console.log('Temp file upload successful!');
    }
    
    // If we have no upload result at this point, there's a critical error
    if (!uploadResult) {
      throw new Error('No upload result received from Cloudinary');
    }
    
    console.log(`Cloudinary upload successful! URL: ${uploadResult.secure_url}`);

    
    // Store metadata in database
    const imageRecord = await ImgBBImage.create({
      title: imageFile.name,
      folder: folder,
      url: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url, // You can use Cloudinary transformations for actual thumbs
      deleteUrl: null, // Cloudinary doesn't provide delete URLs
      imgbbId: uploadResult.public_id, // Store public_id for deletion
      meta: JSON.stringify(uploadResult),
      uploadedBy: req.user?.id || null
    });
    
    return res.status(201).json({
      id: imageRecord.id,
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url,
      folder: folder,
      title: imageFile.name,
      createdAt: imageRecord.createdAt
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ 
      message: 'Server error during file upload', 
      error: error.message 
    });
  }
};

// List images (paginated)
const getImagesList = async (req, res) => {
  try {
    const folder = req.query.folder || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const where = folder ? { folder } : {};
    const { count, rows } = await ImgBBImage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    const images = rows.map(img => ({
      id: img.id,
      public_id: img.imgbbId,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl,
      folder: img.folder,
      createdAt: img.createdAt
    }));
    return res.json({
      images,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete image from Cloudinary and DB
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await ImgBBImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Delete from Cloudinary by public_id
    await cloudinary.uploader.destroy(image.imgbbId);
    await image.destroy();
    return res.json({ message: 'Image deleted successfully', public_id: image.imgbbId });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get image by DB id
const getImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await ImgBBImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    return res.json({
      id: image.id,
      public_id: image.imgbbId,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl,
      folder: image.folder,
      createdAt: image.createdAt
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get image by URL
const getImageByUrl = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'URL parameter is required' });
    }
    
    // Find the image in our database by URL
    const image = await ImgBBImage.findOne({ where: { url } });
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found for the specified URL' });
    }
    
    return res.json({
      id: image.id,
      public_id: image.imgbbId,
      title: image.title,
      folder: image.folder,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl,
      createdAt: image.createdAt
    });
  } catch (error) {
    console.error('Error fetching image by URL:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  uploadImage,
  getImagesList,
  deleteImage,
  getImage,
  getImageByUrl
};
