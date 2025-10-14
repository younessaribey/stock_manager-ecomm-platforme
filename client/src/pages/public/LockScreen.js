import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaInstagram, FaFacebookF } from 'react-icons/fa';
import lockScreenConfig from '../../config/lockScreenConfig';

// Import the real iOS sound and logo
import unlockSound from '../../sound/iPod lock and unlock iOS 6 (80BC0F3-MMH).mp3';
import brothersLogo from '../../sound/logo.webp';
import tritoneSound from '../../tritone.mp3';

const LockScreen = ({ onUnlock }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const controls = useAnimation();
  const audioRef = useRef(null);
  const tritoneAudioRef = useRef(null);

  // 3D tilt motion values (rotate based on mouse position)
  const tiltX = useMotionValue(0); // rotateY
  const tiltY = useMotionValue(0); // rotateX
  const springTiltX = useSpring(tiltX, { stiffness: 220, damping: 18 });
  const springTiltY = useSpring(tiltY, { stiffness: 220, damping: 18 });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enable audio on first user interaction
  const enableAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      // Initialize audio after user interaction
      if (audioRef.current) {
        audioRef.current.load();
      }
      if (tritoneAudioRef.current) {
        tritoneAudioRef.current.load();
      }
    }
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(unlockSound);
    audioRef.current.preload = 'auto';
    
    // Initialize tritone notification sound
    tritoneAudioRef.current = new Audio(tritoneSound);
    tritoneAudioRef.current.preload = 'auto';
    tritoneAudioRef.current.volume = 0.7;
    
    // Show notification 2.5 seconds after lock screen loads completely
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      // Play tritone sound when notification appears (only if audio is enabled)
      if (tritoneAudioRef.current && audioEnabled) {
        tritoneAudioRef.current.currentTime = 0;
        tritoneAudioRef.current.play().catch(error => {
          console.log('Tritone sound playback failed:', error);
        });
      }
    }, 2500);
    
    return () => clearTimeout(notificationTimer);
  }, [audioEnabled]);

  // Play real iOS unlock sound
  const playUnlockSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  };

  // Format time like iOS 6
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  // Format date like iOS 6
  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const handleDragEnd = (event, info) => {
    const threshold = 200; // Distance needed to unlock
    
    if (info.offset.x > threshold) {
      // Play real iOS unlock sound
      playUnlockSound();
      
      // Unlock animation
      setIsUnlocked(true);
      controls.start({
        y: -80,
        scale: 1.05,
        opacity: 0,
        transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }
      }).then(() => {
        setTimeout(() => onUnlock(), 200);
      });
    } else {
      // Snap back
      controls.start({
        x: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
    setIsDragging(false);
    setDragX(0);
  };

  const handleDrag = (event, info) => {
    setDragX(info.offset.x);
    setIsDragging(true);
  };

  // Smooth 3D tilt handler
  const handleLogoMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    // Clamp between -1 and 1
    const clampedX = Math.max(-1, Math.min(1, percentX));
    const clampedY = Math.max(-1, Math.min(1, percentY));
    // Rotate range: 14deg looks nice
    tiltX.set(clampedX * 14); // rotateY
    tiltY.set(-clampedY * 14); // rotateX (invert Y)
  };

  const resetLogoTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={enableAudio} onTouchStart={enableAudio}>
      {/* iOS 6 Lock Screen Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black transform-gpu"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
          `
        }}
      >
        {/* Brothers Phone Logo - Your actual logo with hover animation */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 900 }}>
          <motion.div
            className="relative cursor-pointer select-none"
            onMouseEnter={() => { setIsLogoHovered(true); }}
            onMouseLeave={() => { setIsLogoHovered(false); resetLogoTilt(); }}
            onMouseMove={handleLogoMouseMove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="relative transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                rotateX: springTiltY,
                rotateY: springTiltX,
                willChange: 'transform',
                width: `${lockScreenConfig.logoSizeMobile}px`,
                height: `${lockScreenConfig.logoSizeMobile}px`
              }}
              animate={{ scale: isLogoHovered ? 1.04 : 1 }}
              transition={{ scale: { duration: 0.25, ease: "easeOut" } }}
            >
              {/* Animated glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 rounded-full blur-3xl opacity-20"
                animate={{
                  scale: isLogoHovered ? [1, 1.2, 1] : 1,
                  opacity: isLogoHovered ? [0.2, 0.35, 0.2] : 0.2,
                }}
                transition={{
                  duration: 1.2,
                  repeat: isLogoHovered ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
              
              {/* Your actual Brothers Phone logo */}
              <motion.img 
                src={brothersLogo}
                alt="Brothers Phone Logo"
                className="w-full h-full object-contain drop-shadow-2xl will-change-transform"
              />
              
              {/* Floating particles around logo */}
              {isLogoHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [-10, -30, -10],
                        opacity: [0.6, 1, 0.6],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-30"
                animate={{
                  rotate: isLogoHovered ? 360 : 0,
                  scale: isLogoHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  rotate: isLogoHovered
                    ? { duration: 8, repeat: Infinity, ease: "linear" }
                    : { duration: 0 },
                  scale: isLogoHovered
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0 }
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Lock Screen Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between py-16 px-8 transform-gpu">
        
        {/* Status Bar */}
        <motion.div 
          className="w-full max-w-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex justify-between items-center text-white text-sm font-light">
            <span>Brothers Phone</span>
            <span>●●●●●</span>
            <div className="flex items-center space-x-1">
              <span>100%</span>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-full h-full bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Display */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="mb-4"
          >
            <motion.div 
              className="text-white text-7xl md:text-8xl font-thin tracking-tight mb-2"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 30px rgba(255,255,255,0.5)", 
                  "0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {formatTime(currentTime)}
            </motion.div>
            <motion.div 
              className="text-white text-lg font-light opacity-80"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {formatDate(currentTime)}
            </motion.div>
          </motion.div>

          {/* iPhone-style SMS Notification - Under Clock */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ y: -30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.6
                }}
                className="mt-6 max-w-xs mx-auto"
              >
                <motion.div 
                  className="bg-black bg-opacity-85 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-600"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: 2, ease: "easeInOut" }}
                        className="w-4 h-4 bg-white rounded-sm flex items-center justify-center"
                      >
                        <div className="w-2 h-1.5 bg-green-500 rounded-sm"></div>
                      </motion.div>
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-semibold text-sm">PROMO!</p>
                        <p className="text-gray-300 text-xs">now</p>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Special offers available! Check out our latest deals on premium phones.
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-20"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34, 197, 94, 0.3)",
                        "0 0 30px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Slide to Unlock */}
        <div className="w-full max-w-sm mt-40 md:mt-48">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative"
          >
            {/* Slider Track */}
            <div className="relative h-16 bg-black bg-opacity-40 rounded-full border border-gray-600 overflow-hidden backdrop-blur-sm transform-gpu">
              
              {/* Background Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                animate={{
                  x: isDragging ? Math.max(0, dragX * 0.5) : 0,
                }}
                transition={{ duration: isDragging ? 0 : 0.3, ease: "easeOut" }}
              />

              {/* Slide to Unlock Text (continuous shimmer) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-lg font-light tracking-wide"
                  animate={{
                    opacity: isDragging ? 0.3 : 1,
                    x: isDragging ? Math.min(dragX * 0.3, 100) : 0
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.span
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.35) 100%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                    animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  >
                    slide to unlock
                  </motion.span>
                </motion.span>
              </div>

              {/* Slider Button */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={controls}
                whileDrag={{ 
                  scale: 1.1,
                  boxShadow: "0 0 25px rgba(255,255,255,0.6)"
                }}
                className="absolute left-1 top-1 w-14 h-14 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full shadow-lg cursor-pointer flex items-center justify-center transform-gpu"
                style={{
                  background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                <motion.div
                  animate={{
                    x: isDragging ? 2 : 0,
                    rotate: isDragging ? 10 : 0
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <FaChevronRight 
                    className="text-gray-700 ml-1" 
                    size={16}
                  />
                </motion.div>
              </motion.div>

              {/* Enhanced Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear"
                }}
                style={{
                  width: '40%',
                  transform: 'skewX(-20deg)'
                }}
              />
            </div>

            {/* Instruction text removed per request */}
          </motion.div>
        </div>

        {/* Bottom Elements: Social Links */}
        <motion.div 
          className="w-full max-w-sm flex justify-between items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* Instagram */}
          <a
            href="https://www.instagram.com/brothersphone"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-black bg-opacity-40 rounded-full border border-gray-600 flex items-center justify-center backdrop-blur-sm"
            >
              <FaInstagram className="text-white opacity-90" size={20} />
            </motion.div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/brothersphone"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-black bg-opacity-40 rounded-full border border-gray-600 flex items-center justify-center backdrop-blur-sm"
            >
              <FaFacebookF className="text-white opacity-90" size={20} />
            </motion.div>
          </a>
        </motion.div>
      </div>


      {/* Unlock Animation Overlay */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white z-20"
        />
      )}
    </div>
  );
};

export default LockScreen;