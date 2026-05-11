import React from 'react';
import { motion } from 'framer-motion';
import './AppScreenPreview.css';
import dashboard from '../assets/screen-dashboard.png';
import tips from '../assets/screen-tips.png';
import result from '../assets/screen-result.png';

const AppScreenPreview = () => {
  return (
    <section className="app-showcase-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle accent">The Experience</span>
          <h2 className="serif">Actual App Interface</h2>
          <p>Designed for simplicity, speed, and reliability in the field.</p>
        </div>

        <div className="mockups-layered">
          <div className="radial-glow-accent"></div>
          
          <motion.div 
            className="phone-mockup side left"
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: -12 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="phone-frame">
              <img src={tips} alt="Farming Tips Screen" />
            </div>
            <div className="screen-label">Farming Tips</div>
          </motion.div>

          <motion.div 
            className="phone-mockup center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="phone-frame main">
              <img src={dashboard} alt="Dashboard Screen" />
            </div>
            <div className="screen-label main">Dashboard</div>
          </motion.div>

          <motion.div 
            className="phone-mockup side right"
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 12 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="phone-frame">
              <img src={result} alt="Diagnosis Result Screen" />
            </div>
            <div className="screen-label">Diagnosis</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppScreenPreview;
