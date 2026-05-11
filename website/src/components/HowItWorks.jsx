import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, HeartPulse } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <Camera size={32} />,
    title: 'Scan Crop',
    desc: 'Capture a clear photo of the plant leaf in natural light.'
  },
  {
    icon: <Cpu size={32} />,
    title: 'AI Analysis',
    desc: 'Our engine identifies visual markers of diseases instantly.'
  },
  {
    icon: <HeartPulse size={32} />,
    title: 'Get Treatment',
    desc: 'Receive actionable recommendations to protect your farm.'
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works section-padding" id="how-it-works">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">The Process</span>
          <h2 className="serif">Protecting your farm is as <br /> easy as taking a photo</h2>
        </div>

        <div className="steps-flow">
          <div className="connecting-line"></div>
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="step-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="step-bg-number">{i + 1}</div>
              <div className="step-icon-premium">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
