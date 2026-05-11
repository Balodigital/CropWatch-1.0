import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronRight, ShieldCheck, Zap, Target } from 'lucide-react';
import './Hero.css';
import heroMockup from '../assets/mockup-hero.png';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <section className="hero-section" id="home">
      <div className="radial-glow" style={{ top: '-10%', right: '-10%' }}></div>
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Agricultural Intelligence
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="serif">
            Save your harvest — <br />
            <span className="text-primary italic">before it's too late</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subheadline">
            Detect crop diseases in seconds with our intelligent diagnosis engine. 
            Empowering smallholder farmers with expert-level precision, directly on their smartphones.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-actions">
            <a href="/downloads/cropscan.apk" className="btn btn-primary" download="cropscan.apk">
              Download on Android <Download size={18} />
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="trust-indicators">
            <div className="trust-item">
              <Target size={20} className="text-accent" />
              <span>98% Accuracy</span>
            </div>
            <div className="trust-item">
              <Zap size={20} className="text-accent" />
              <span>Offline Ready</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={20} className="text-accent" />
              <span>Trusted AI</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
        >
          <div className="mockup-wrapper">
            <div className="glow-orb"></div>
            <img src={heroMockup} alt="CropScan App Premium Mockup" className="hero-mockup-img-v2" />
            
            {/* Floating Card Overlay */}
            <motion.div 
              className="diagnosis-card glass"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="d-header">
                <span className="d-icon">✨</span>
                <div>
                  <h4>AI Diagnosis</h4>
                  <span>Maize Leaf Blight Detected</span>
                </div>
              </div>
              <div className="d-confidence">
                98.4% Confidence
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
