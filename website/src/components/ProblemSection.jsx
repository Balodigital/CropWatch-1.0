import React from 'react';
import { motion } from 'framer-motion';
import './ProblemSection.css';

const problems = [
  {
    number: "01",
    title: "Late Detection",
    text: "Farmers identify crop diseases only after significant damage is done, leading to massive harvest losses."
  },
  {
    number: "02",
    title: "Expert Scarcity",
    text: "Access to agricultural experts is limited and slow, especially in remote regions where it's needed most."
  },
  {
    number: "03",
    title: "Vague Diagnosis",
    text: "Identifying the exact disease is difficult without proper tools, leading to incorrect treatment and wasted resources."
  }
];

const ProblemSection = () => {
  return (
    <section className="problem-section section-padding">
      <div className="container">
        <div className="section-header">
          <motion.span 
            className="subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Challenge
          </motion.span>
          <motion.h2 
            className="serif"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Traditional Farming Is Losing <br />
            to Late Detection
          </motion.h2>
        </div>

        <div className="problem-grid-refined">
          {problems.map((problem, index) => (
            <motion.div 
              key={index} 
              className="problem-card-premium"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="card-number">{problem.number}</div>
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
              <div className="card-accent-line"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
