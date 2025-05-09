import React from 'react';
import './FAQSection.css';

const FAQSection = ({ onFAQClick }) => {
  const faqsLine1 = [
    "How to register for the admission process?",
    "What documents are required?",
    "How do I submit my application?",
    "What are the admission deadlines?",
    "Can I update my application after submission?",
    "What is the eligibility criteria for registration?",
    "How do I apply for financial aid?",
    "Is there an age limit for applications?",
    "Can I apply for more than one program at a time?",
    "How will I know if my application is complete?",
    "What if I need help with my application?",
    "How can I contact the admissions office?",
    "What is the interview process like?",
    "Do I need to submit a personal statement?",
    "Can I defer my admission if I’m accepted?",
    "What are the tuition fees for the program?",
    "Is there a scholarship application process?",
    "How can I check my application status?",
    "What if I encounter technical issues while applying?",
    "What should I do if my documents are delayed?",
  ];

  const faqsLine2 = [
    "How to track my application status?",
    "What if I miss the deadline?",
    "How to schedule an interview?",
    "Is there an application fee?",
    "What are the eligibility criteria?",
    "What happens after I submit my application?",
    "When will I receive my admission decision?",
    "Can I change my program choice after applying?",
    "What is the process for submitting transcripts?",
    "How do I submit letters of recommendation?",
    "Are there any specific formats for documents?",
    "How do I apply for residency programs?",
    "What if I need to withdraw my application?",
    "Can I appeal my admission decision?",
    "How do I register for orientation?",
    "Are there any pre-admission workshops?",
    "What resources are available for new students?",
    "Can I attend classes before officially enrolling?",
    "How do I get my student ID?",
    "Is there a waitlist for admission?",
  ];

  const faqsLine3 = [
    "How do I pay the application fee?",
    "Can I apply for multiple programs?",
    "What is the process after acceptance?",
    "Do I need to submit recommendations?",
    "What is the process for international students?",
    "How do I obtain my I-20 for visa purposes?",
    "What health documentation do I need to provide?",
    "What are the housing options for new students?",
    "How can I find a roommate?",
    "What support services are available for international students?",
    "What are the orientation dates for new students?",
    "How do I set up my student email account?",
    "Are there clubs or organizations I can join?",
    "What is the campus culture like?",
    "How can I get involved in student government?",
    "What academic resources are available?",
    "How do I register for classes?",
    "What is the refund policy for tuition and fees?",
    "How can I get assistance with my studies?",
    "What career services are available for students?",
  ];

  // Create a function to duplicate the FAQ items
  const duplicateItems = (items) => [...items, ...items];

  return (
    <div className="overflow-hidden relative h-96 flex flex-col justify-center">
      {/* First line of FAQs */}
      <div className="whitespace-nowrap animate-marquee-slow">
        {duplicateItems(faqsLine1).map((faq, index) => (
          <div
            key={index}
            className="inline-block text-2xl bg-primary text-light px-8 py-8 m-2 mb-0 rounded-md shadow-md hover:bg-secondary cursor-pointer transition-colors"
            onClick={() => onFAQClick(faq)} // Call the handler when an FAQ is clicked
          >
            {faq} &#8594;
          </div>
        ))}
      </div>

      {/* Second line of FAQs, scrolling in the opposite direction */}
      <div className="whitespace-nowrap animate-marquee-reverse-slow mt-4">
        {duplicateItems(faqsLine2).map((faq, index) => (
          <div
            key={index}
            className="inline-block text-2xl bg-primary text-light px-8 py-8 m-2 mb-0 rounded-md shadow-md hover:bg-secondary cursor-pointer transition-colors"
            onClick={() => onFAQClick(faq)} // Call the handler when an FAQ is clicked
          >
            {faq} &#8594;
          </div>
        ))}
      </div>

      {/* Third line of FAQs, scrolling in the same direction as the first but slower */}
      <div className="whitespace-nowrap animate-marquee-slow mt-4">
        {duplicateItems(faqsLine3).map((faq, index) => (
          <div
            key={index}
            className="inline-block text-2xl bg-primary text-light px-8 py-8 m-2 rounded-md shadow-md hover:bg-secondary cursor-pointer transition-colors"
            onClick={() => onFAQClick(faq)} // Call the handler when an FAQ is clicked
          >
            
            {faq} &#8596;
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
