import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './FooterFAQ.css';

export const FAQ = () => {
  const faqs = [
    { q: "How does CropScan work?", a: "CropScan uses advanced deep learning algorithms trained on thousands of plant disease images. When you take a photo, the AI compares it to known markers of various diseases to provide an instant diagnosis." },
    { q: "Is CropScan offline?", a: "Yes! While some advanced features require a connection, the core AI diagnosis engine is optimized to run directly on your smartphone without internet access." },
    { q: "Which crops are supported?", a: "Currently, we support Maize, Cassava, Rice, Yam, and Tomatoes. We are constantly expanding our models to include more regional crops." },
    { q: "How accurate is the AI?", a: "In controlled field tests, CropScan has achieved a 98% accuracy rate for major diseases. However, we always recommend verifying with a local agricultural extension officer for critical decisions." },
    { q: "Is CropScan free?", a: "The core diagnosis tool is free for individual smallholder farmers. We offer premium features and enterprise solutions for cooperatives and large-scale agricultural firms." }
  ];

  return (
    <section className="faq-section section-padding" id="faq">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">Common Questions</span>
          <h2 className="serif">Everything you <br /> need to know</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TwitterIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <img src={logo} alt="CropScan Logo" className="logo-img" />
            <span className="logo-text serif">CropScan</span>
          </Link>
          <p className="tagline">Empowering farmers with AI-powered disease detection and smart agricultural insights.</p>
        </div>

        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/#home">Home</a></li>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#how-it-works">How It Works</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-nav">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
          </ul>
        </div>

        <div className="footer-nav">
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>
              <a href="https://x.com/CropScanHQ" target="_blank" rel="noopener noreferrer" className="contact-link">
                <TwitterIcon size={16} /> @CropScanHQ
              </a>
            </li>
            <li><MapPin size={16} /> Lagos, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2026 CropScan AI. Built for the future of farming.</p>
      </div>
    </footer>
  );
};
