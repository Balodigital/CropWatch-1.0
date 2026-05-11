import React, { useEffect } from 'react';

const LegalLayout = ({ title, lastUpdated, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page section-padding" style={{ background: 'var(--background)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'white', padding: 'var(--space-2xl)', borderRadius: '24px', border: '1px solid var(--outline-variant)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>{title}</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-xl)' }}>Last Updated: {lastUpdated}</p>
        <div className="legal-content" style={{ color: 'var(--on-surface)', lineHeight: '1.8' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
