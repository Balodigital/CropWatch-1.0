import React from 'react';
import LegalLayout from './LegalLayout';

const CookiePolicy = () => {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 11, 2026">
      <h3>What are cookies?</h3>
      <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>How we use cookies</h3>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li><strong>Necessary cookies:</strong> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas.</li>
        <li><strong>Analytical/performance cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
        <li><strong>Functionality cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you.</li>
      </ul>

      <h3 style={{ marginTop: 'var(--space-lg)' }}>Managing cookies</h3>
      <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>
    </LegalLayout>
  );
};

export default CookiePolicy;
