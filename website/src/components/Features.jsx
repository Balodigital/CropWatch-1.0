import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Sprout, History, MessageSquare, Bell, ChevronRight } from 'lucide-react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section section-padding" id="features">
      <div className="container">
        <div className="features-layout">
          {/* Large Card Left */}
          <motion.div 
            className="feature-card-large"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="f-tag">Core Technology</div>
            <h2 className="serif">AI-Powered Crop Diagnosis</h2>
            <p>Our proprietary deep learning models analyze leaf patterns to detect over 40 types of crop diseases with surgical precision.</p>
            <div className="f-icon-main">
              <Scan size={64} strokeWidth={1} />
            </div>
            <button className="btn btn-primary">
              Learn how it works <ChevronRight size={18} />
            </button>
          </motion.div>

          {/* Grid Right */}
          <div className="features-grid-asymmetric">
            <FeatureItem 
              icon={<Sprout size={24} />} 
              title="Smart Farming Tips" 
              desc="Personalized advice based on your crop type and location."
              delay={0.1}
            />
            <FeatureItem 
              icon={<History size={24} />} 
              title="Diagnosis History" 
              desc="Track the health of your farm over time with historical data."
              delay={0.2}
            />
            <FeatureItem 
              icon={<MessageSquare size={24} />} 
              title="AI Support Assistant" 
              desc="Ask questions and get instant answers from our farm bot."
              delay={0.3}
            />
            <FeatureItem 
              icon={<Bell size={24} />} 
              title="Real-time Alerts" 
              desc="Get notified of disease outbreaks in your local area."
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, desc, delay }) => (
  <motion.div 
    className="feature-item-premium"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
  >
    <div className="f-item-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{desc}</p>
  </motion.div>
);

export default Features;
