import React from 'react';
import { motion } from 'framer-motion';
import { Download, Star, Play, Apple } from 'lucide-react';
import './Sections.css';

export const Testimonials = () => {
  const reviews = [
    {
      initials: "MI",
      name: "Musa Ibrahim",
      specialty: "Maize farmer",
      location: "Kano, Nigeria",
      quote: "CropScan saved my harvest this season. I caught the leaf blight early and followed the AI's recommendations — it was like having an expert in my pocket 24/7."
    },
    {
      initials: "GD",
      name: "Grace Diaz",
      specialty: "Cassava farmer",
      location: "Leyte, Philippines",
      quote: "A game changer for our cooperative. The accuracy of the AI is impressive and the offline mode is a lifesaver when we're deep in the fields with no signal."
    }
  ];

  return (
    <section className="testimonials section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">Voice of the Farmer</span>
          <h2 className="serif">Trusted in the Field</h2>
        </div>
        
        <div className="testimonials-refined">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i} 
              className="testimonial-editorial"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
            >
              <div className="star-rating">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="quote-text serif">“{rev.quote}”</p>
              <div className="author-meta">
                <div className="avatar-initials">{rev.initials}</div>
                <div>
                  <h4 className="author-name">{rev.name}</h4>
                  <span className="author-info">{rev.specialty} · {rev.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const DownloadSection = () => {
  return (
    <section className="immersive-cta section-padding">
      <div className="container relative z-10">
        <motion.div 
          className="cta-content-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="serif">Ready to secure <br /> your harvest?</h2>
          <p className="cta-tagline">Join 50,000+ farmers already protecting their crops.</p>
          
          <div className="cta-actions-wrapper">
            <a href="https://github.com/Balodigital/CropWatch-1.0/releases/download/Agrictulture/cropscan.apk" className="btn btn-primary btn-large" target="_blank" rel="noopener noreferrer">
              Download for Android <Download size={20} />
            </a>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
};
