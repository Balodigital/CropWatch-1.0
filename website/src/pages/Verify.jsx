import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Verify = () => {
  useEffect(() => {
    // Automatically try to trigger the deep link to the app after a short delay
    const timer = setTimeout(() => {
      window.location.href = 'cropscan://verify';
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="verify-page" style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      background: 'var(--bg-cream)'
    }}>
      <motion.div 
        className="verify-card glass"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: 'var(--space-3xl) var(--space-2xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--outline)',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-xl)'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </motion.div>

        <h1 className="serif" style={{ color: 'var(--primary-dark)', fontSize: '2rem', marginBottom: 'var(--space-md)' }}>
          Email Confirmed!
        </h1>
        
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: 'var(--space-2xl)' }}>
          Your email address has been successfully verified. You can now securely access all features of the CropScan mobile app.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <a 
            href="cropscan://verify" 
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-md)', fontSize: '1.05rem' }}
          >
            Open CropScan App
          </a>
          
          <Link 
            to="/" 
            className="btn"
            style={{ 
              width: '100%', 
              padding: 'var(--space-md)', 
              background: 'transparent', 
              color: 'var(--text-muted)',
              border: '1px solid var(--outline)'
            }}
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify;
