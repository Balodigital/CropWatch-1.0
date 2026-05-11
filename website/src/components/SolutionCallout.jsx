import React from 'react';
import { motion } from 'framer-motion';
import './SolutionCallout.css';

const SolutionCallout = () => {
  return (
    <section className="solution-callout">
      <div className="container">
        <motion.div 
          className="solution-callout-content"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="callout-rule"></div>
          <h2 className="serif">
            “CropScan closes the gap between farmer and expert. Instantly.”
          </h2>
          <div className="callout-rule"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionCallout;
