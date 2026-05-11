import React from 'react';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionCallout from '../components/SolutionCallout';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AppScreenPreview from '../components/AppScreenPreview';
import SmartInsights from '../components/SmartInsights';
import { Testimonials, DownloadSection } from '../sections/Sections';
import { FAQ } from '../sections/FooterFAQ';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <ProblemSection />
      <SolutionCallout />
      <Features />
      <HowItWorks />
      <AppScreenPreview />
      <SmartInsights />
      <Testimonials />
      <DownloadSection />
      <FAQ />
    </div>
  );
};

export default Home;
