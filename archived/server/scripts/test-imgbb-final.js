// Final test script for imgBB API integration
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function testImgBBUpload() {
  try {
    console.log('🧪 Testing imgBB API integration');
    
    // Get credentials from env variables
    const imgbbApiUrl = process.env.IMGAPI_URL || 'https://api.imgbb.com/1/upload';
    const apiKey = process.env.API_KEY;
    
    // Validate env vars
    if (!apiKey) {
      console.error('❌ Error: Missing API_KEY environment variable');
      console.log('Please ensure API_KEY is set in your .env file');
      return;
    }
    
    console.log('✅ Environment variables found');
    console.log(`🔗 API URL: ${imgbbApiUrl}`);
    console.log(`🔑 API Key: ${'*'.repeat(Math.max(0, apiKey.length - 4))}${apiKey.slice(-4)}`);
    
    // Create a test image file
    console.log('📷 Creating test image...');
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    // Create a simple red square image (1x1 pixel JPEG)
    const base64Image = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/yQALCAABAAEBAREA/8wABgAQEAX/2gAIAQEAAD8A0s8g/9k=';
    
    // Write the test image to disk
    fs.writeFileSync(testImagePath, Buffer.from(base64Image, 'base64'));
    console.log(`Test image created at: ${testImagePath}`);
    
    // Create form data
    const formData = new FormData();
    const fileStream = fs.createReadStream(testImagePath);
    formData.append('image', fileStream);
    
    console.log('📤 Uploading image to imgBB...');
    const fullUrl = `${imgbbApiUrl}?key=${apiKey}`;
    console.log(`Request URL: ${fullUrl}`);
    
    // Make the API request
    const response = await axios.post(fullUrl, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log('✅ Upload successful!');
    console.log(`Status code: ${response.status}`);
    
    if (response.data && response.data.data) {
      console.log('\n📊 Response summary:');
      console.log(`• Image URL: ${response.data.data.url}`);
      console.log(`• Thumbnail: ${response.data.data.thumb?.url || 'N/A'}`);
      console.log(`• Image size: ${response.data.data.size_formatted || 'Unknown'}`);
      console.log(`• Delete URL: ${response.data.data.delete_url || 'N/A'}`);
      
      // Save the response
      const responseFilePath = path.join(__dirname, 'imgbb-response.json');
      fs.writeFileSync(responseFilePath, JSON.stringify(response.data, null, 2));
      console.log(`\n💾 Complete response saved to: ${responseFilePath}`);
      
      // Output instructions for updating the controller
      console.log('\n🔧 Next steps for your image controller:');
      console.log('1. Ensure your controller uses the correct URL format:');
      console.log(`   ${imgbbApiUrl}?key=${apiKey}`);
      console.log('2. Make sure to send the image as form data with the key "image"');
      console.log('3. Access the image URL from response.data.data.url in your controller');
    } else {
      console.log('⚠️ Unexpected response format:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error during image upload:');
    
    if (error.response) {
      // The server responded with an error status
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 400) {
        console.log('\n🔍 Common 400 error causes:');
        console.log('• Invalid API key');
        console.log('• Malformed request');
        console.log('• Image too large or in unsupported format');
      } else if (error.response.status === 403) {
        console.log('\n🔍 Common 403 error causes:');
        console.log('• API key usage limit exceeded');
        console.log('• IP address blocked');
        console.log('• Account restrictions');
      }
    } else if (error.request) {
      // No response received
      console.error('No response from server. Check your internet connection and the API URL.');
    } else {
      // Request setup error
      console.error(`Error: ${error.message}`);
    }
    
    console.log('\n🛠️ Troubleshooting:');
    console.log('1. Generate a new API key from imgBB');
    console.log('2. Try using a different browser or network');
    console.log('3. Check if your account has any API usage restrictions');
    console.log('4. Verify the API endpoint in their documentation');
  } finally {
    // Clean up the test image
    try {
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
        console.log('🧹 Test image file removed');
      }
    } catch (err) {
      console.log('Warning: Could not remove test image file');
    }
  }
}

// Run the test
testImgBBUpload();
