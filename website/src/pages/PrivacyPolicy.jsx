import React from 'react';
import LegalLayout from './LegalLayout';

const PrivacyPolicy = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 11, 2026">
      <h3>1. Introduction</h3>
      <p>At CropScan, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our application.</p>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>2. Data We Collect</h3>
      <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul>
        <li>Identity Data: includes first name, last name, username or similar identifier.</li>
        <li>Contact Data: includes email address and telephone numbers.</li>
        <li>Technical Data: includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
        <li>Usage Data: includes information about how you use our website, products and services.</li>
      </ul>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>3. How We Use Your Data</h3>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul>
        <li>To provide the AI-powered diagnosis service.</li>
        <li>To notify you about changes to our service.</li>
        <li>To improve our website, products/services, marketing, and customer relationships.</li>
      </ul>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>4. Data Security</h3>
      <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.</p>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
