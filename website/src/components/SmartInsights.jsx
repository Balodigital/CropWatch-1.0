import React from 'react';
import { motion } from 'framer-motion';
import './SmartInsights.css';

const insights = [
  {
    badge: 'Urgent',
    type: 'urgent',
    title: 'High humidity detected',
    desc: 'Grey leaf spot risk is elevated in Field B. Preventive treatment recommended within 48 hours.'
  },
  {
    badge: 'Warning',
    type: 'warning',
    title: 'Outbreak nearby',
    desc: 'Farmers within 12km have reported cassava mosaic disease. Monitor your crop closely this week.'
  },
  {
    badge: 'All Clear',
    type: 'all-clear',
    title: 'Planting window open',
    desc: 'Soil moisture and temperature are optimal for maize planting in your region today.'
  }
];

const SmartInsights = () => {
  return (
    <section className="smart-insights section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">Intelligence</span>
          <h2 className="serif">Get alerts before damage occurs</h2>
          <p>CropScan monitors conditions across your farm and notifies you before problems escalate.</p>
        </div>

        <div className="insights-grid">
          {insights.map((insight, i) => (
            <motion.div 
              key={i} 
              className="insight-card-premium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className={`urgency-badge ${insight.type}`}>
                {insight.badge}
              </div>
              <h3>{insight.title}</h3>
              <p>{insight.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartInsights;
