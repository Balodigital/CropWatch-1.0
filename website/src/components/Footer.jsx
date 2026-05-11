import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer section-padding">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <img src={logo} alt="CropScan Logo" className="logo-img" />
            <span className="logo-text">CropScan</span>
          </div>
          <p>
            Empowering farmers with AI-powered disease detection for smarter farming and better yields.
          </p>
            <a href="#" className="social-link">FB</a>
            <a href="#" className="social-link">TW</a>
            <a href="#" className="social-link">IG</a>
        </div>

        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#download">Download</a></li>
            <li><a href="#faq">FAQ</a></li>
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

        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li className="contact-item">
              <Mail size={18} />
              <a href="mailto:support@cropscan.com">support@cropscan.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <div className="divider"></div>
        <p>© 2026 CropScan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
