import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OtpVerification.css';
const OtpVerification = () => {
  // 4-digit OTP State
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  // 4-Digit Code & Phone Number
  const verificationCode = '2109';
  const phoneNumber = '+91 93425***75';

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto Focus Next Input Box
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join('').length === 4) {
      checkCode(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Typewriter style Auto-Fill Animation for 4 digits
  const handleFillCode = () => {
    const codeArr = verificationCode.split('');
    codeArr.forEach((char, index) => {
      setTimeout(() => {
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index] = char;
          return nextOtp;
        });
        if (index === 3) {
          checkCode(verificationCode);
        }
      }, index * 120);
    });
  };

  const checkCode = (enteredCode) => {
    if (enteredCode === verificationCode) {
      setTimeout(() => {
        setIsVerified(true);
      }, 500);
    }
  };

  return (
    <div className="otp-wrapper">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="main-title"
      >
        OTP Verification
      </motion.h1>

      <motion.div 
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="otp-card"
      >
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <span className="brand-name">KRONOS</span>
                <h2>Verify Number</h2>
                <p>Enter the 4-digit code sent to <strong>{phoneNumber}</strong></p>
              </div>

              {/* 4 OTP Input Boxes */}
              <div className="otp-input-group">
                {otp.map((digit, idx) => (
                  <motion.input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    whileFocus={{ scale: 1.06 }}
                    animate={digit ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="otp-box"
                  />
                ))}
              </div>

              {/* Message Notification Box */}
              <div className="message-banner">
                <div className="banner-left">
                  <span className="msg-tag">AUTHENTICATION</span>
                  <p>KRONOS — <strong>{verificationCode}</strong> is your login code</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="fill-code-btn" 
                  onClick={handleFillCode}
                >
                  Fill Code
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Animated Success Screen */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="verified-screen"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="success-icon-circle"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
              <h2>Number Verified</h2>
              <p>You have been successfully authenticated.</p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="continue-btn" 
                onClick={() => { setIsVerified(false); setOtp(['', '', '', '']); }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OtpVerification;