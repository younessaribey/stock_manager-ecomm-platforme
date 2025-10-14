// IMEI Detection and Barcode Scanning Utilities

/**
 * Mock IMEI detection from image using OCR
 * In a real implementation, this would connect to an OCR service like:
 * - Google Vision API
 * - AWS Textract  
 * - Azure Computer Vision
 * - Tesseract.js (client-side OCR)
 */
export const detectIMEIFromImage = async (imageFile) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate processing time
      setTimeout(() => {
        // Mock IMEI patterns that might be detected
        const mockIMEIs = [
          '123456789012345',
          '987654321098765',
          '456789123456789',
          '321654987321654',
          '789456123789456'
        ];
        
        // Simulate success/failure rate
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          const randomIMEI = mockIMEIs[Math.floor(Math.random() * mockIMEIs.length)];
          resolve({
            success: true,
            imei: randomIMEI,
            confidence: Math.floor(Math.random() * 30 + 70) // 70-100% confidence
          });
        } else {
          resolve({
            success: false,
            error: 'Could not detect IMEI in image. Please ensure the IMEI is clearly visible.',
            confidence: 0
          });
        }
      }, 2000 + Math.random() * 2000); // 2-4 second processing time
    } catch (error) {
      reject({
        success: false,
        error: 'Error processing image: ' + error.message,
        confidence: 0
      });
    }
  });
};

/**
 * Mock barcode/QR code scanning
 * In a real implementation, this would use:
 * - QuaggaJS for barcode scanning
 * - ZXing for QR codes
 * - Browser's native barcode detection API
 * - Camera access with getUserMedia
 */
export const scanBarcode = async () => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate camera access and scanning time
      setTimeout(() => {
        // Mock barcode/IMEI patterns
        const mockCodes = [
          '135792468013579',
          '246813579024681',
          '987654321012345',
          '123456789098765',
          '567890123456789'
        ];
        
        // Simulate success rate
        const success = Math.random() > 0.15; // 85% success rate
        
        if (success) {
          const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
          resolve({
            success: true,
            code: randomCode,
            type: 'IMEI', // Could be 'barcode', 'qr', 'imei'
            confidence: Math.floor(Math.random() * 20 + 80) // 80-100% confidence
          });
        } else {
          resolve({
            success: false,
            error: 'No barcode detected. Please ensure the code is clearly visible and try again.',
            confidence: 0
          });
        }
      }, 1500 + Math.random() * 1000); // 1.5-2.5 second scanning time
    } catch (error) {
      reject({
        success: false,
        error: 'Error accessing camera: ' + error.message,
        confidence: 0
      });
    }
  });
};

/**
 * Validate IMEI format
 * IMEI should be 15 digits and pass the Luhn algorithm
 */
export const validateIMEI = (imei) => {
  // Remove non-digits
  const cleanIMEI = imei.replace(/[^0-9]/g, '');
  
  // Check length
  if (cleanIMEI.length !== 15) {
    return {
      valid: false,
      error: 'IMEI must be exactly 15 digits'
    };
  }
  
  // Luhn algorithm check
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleanIMEI[i]);
    
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = digit.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }
    }
    
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  const actualCheckDigit = parseInt(cleanIMEI[14]);
  
  if (checkDigit === actualCheckDigit) {
    return {
      valid: true,
      formatted: cleanIMEI.replace(/(\d{2})(\d{6})(\d{6})(\d{1})/, '$1-$2-$3-$4')
    };
  } else {
    return {
      valid: false,
      error: 'Invalid IMEI checksum'
    };
  }
};

/**
 * Format IMEI for display
 */
export const formatIMEI = (imei) => {
  const cleanIMEI = imei.replace(/[^0-9]/g, '');
  if (cleanIMEI.length === 15) {
    return cleanIMEI.replace(/(\d{2})(\d{6})(\d{6})(\d{1})/, '$1-$2-$3-$4');
  }
  return imei;
};

/**
 * Generate device info suggestions based on detected patterns
 */
export const suggestDeviceInfo = (imei) => {
  // Mock device database lookup
  const deviceDatabase = {
    '123456': { brand: 'Apple', model: 'iPhone 14 Pro', storage: '128GB' },
    '987654': { brand: 'Samsung', model: 'Galaxy S23', storage: '256GB' },
    '456789': { brand: 'Apple', model: 'iPad Air', storage: '64GB' },
    '321654': { brand: 'Google', model: 'Pixel 7', storage: '128GB' },
    '789456': { brand: 'Apple', model: 'MacBook Pro', storage: '512GB' }
  };
  
  const prefix = imei.substring(0, 6);
  return deviceDatabase[prefix] || null;
};
