import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="CropScan Logo" className="logo-img" />
          <span className="logo-text serif">CropScan</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#how-it-works" className="nav-link">How It Works</a>
          <a href="/#faq" className="nav-link">FAQ</a>
          <a href="https://github.com/Balodigital/CropWatch-1.0/releases/download/Agrictulture/cropscan.apk" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Download App <Download size={18} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mobile-links">
              <a href="/#features" onClick={() => setIsOpen(false)}>Features</a>
              <a href="/#how-it-works" onClick={() => setIsOpen(false)}>How It Works</a>
              <a href="/#faq" onClick={() => setIsOpen(false)}>FAQ</a>
              <a href="https://github.com/Balodigital/CropWatch-1.0/releases/download/Agrictulture/cropscan.apk" className="btn btn-primary full-width" target="_blank" rel="noopener noreferrer">
                Download App <Download size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
