import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css';

const faqData = [
  {
    question: "How does CropScan work?",
    answer: "CropScan uses advanced deep learning algorithms trained on thousands of crop images. When you upload a photo, the AI analyzes visual patterns like spots, discoloration, or deformities to match them with known diseases and pests."
  },
  {
    question: "Is CropScan free?",
    answer: "The basic diagnosis and support features are free for all farmers. We aim to make agricultural expertise accessible to everyone."
  },
  {
    question: "Which crops are supported?",
    answer: "Currently, we support major food crops including Maize, Cassava, Rice, and Tomatoes. We are constantly expanding our database to include more crop types."
  },
  {
    question: "Does the app work offline?",
    answer: "Yes! You can take photos and queue scans while offline. Once you reach an internet connection, the app will automatically process the queue and give you the results."
  },
  {
    question: "How accurate is the AI diagnosis?",
    answer: "Our AI model achieves over 95% accuracy in controlled testing. However, we always recommend verifying with a local agricultural extension officer for critical decisions."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq section-padding" id="faq">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">Got Questions?</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{item.question}</h3>
                {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
