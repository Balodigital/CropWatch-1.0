import React from 'react';
import LegalLayout from './LegalLayout';

const TermsOfService = () => {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 11, 2026">
      <h3>1. Agreement to Terms</h3>
      <p>By accessing or using CropScan, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use our services.</p>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>2. Use of Services</h3>
      <p>CropScan provides AI-powered agricultural insights. These insights are for informational purposes only and should not replace professional agricultural advice. You are responsible for any decisions made based on the results provided by the application.</p>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>3. User Conduct</h3>
      <p>You agree not to use the services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers or networks.</p>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>4. Intellectual Property</h3>
      <p>The services and their original content, features, and functionality are and will remain the exclusive property of CropScan and its licensors.</p>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>5. Limitation of Liability</h3>
      <p>In no event shall CropScan be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.</p>
    </LegalLayout>
  );
};

export default TermsOfService;
