import React from 'react';
import { Download, Apple, Play } from 'lucide-react';
import './DownloadSection.css';

const DownloadSection = () => {
  return (
    <section className="download-section section-padding" id="download">
      <div className="container">
        <div className="download-card">
          <div className="download-content">
            <h2>Start Protecting Your Harvest Today</h2>
            <p>
              Download CropScan and join thousands of farmers who are already using AI to stay ahead of crop diseases.
            </p>
            <div className="download-info">
              <span className="info-item">Version 1.0.4</span>
              <span className="info-divider">•</span>
              <span className="info-item">Android 8.0+</span>
              <span className="info-divider">•</span>
              <span className="info-item">135MB</span>
            </div>
            <div className="download-buttons">
              <a href="/downloads/cropscan.apk" className="btn btn-download-primary" download="cropscan.apk">
                <div className="btn-icon">
                  <Download size={24} />
                </div>
                <div className="btn-text">
                  <span className="btn-subtitle">Direct Download</span>
                  <span className="btn-title">Android APK</span>
                </div>
              </a>
              
              <div className="btn btn-download-secondary disabled">
                <div className="btn-icon">
                  <Play size={24} />
                </div>
                <div className="btn-text">
                  <span className="btn-subtitle">Coming Soon to</span>
                  <span className="btn-title">Google Play</span>
                </div>
              </div>

              <div className="btn btn-download-secondary disabled">
                <div className="btn-icon">
                  <Apple size={24} />
                </div>
                <div className="btn-text">
                  <span className="btn-subtitle">Coming Soon to</span>
                  <span className="btn-title">App Store</span>
                </div>
              </div>
            </div>
          </div>
          <div className="download-visual">
            <div className="qr-code">
              {/* Placeholder for QR Code */}
              <div className="qr-placeholder">
                <div className="qr-inner">
                  <span>QR CODE</span>
                </div>
              </div>
              <p>Scan to download directly to your device</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
