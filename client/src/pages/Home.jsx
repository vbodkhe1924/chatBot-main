import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import FAQSection from '../components/FAQSection'; // Correct import path
import Navbar from '../components/Navbar';
import axios from 'axios'; // Import axios

const Home = () => {
  // Function to handle FAQ click
  const handleFAQClick = async (faq) => {
    try {
      // Send the clicked FAQ question to the backend
      const response = await axios.post('http://127.0.0.1:5000/ask', { question: faq });
      // Handle the response if needed
      console.log(response.data);
    } catch (error) {
      console.error('Error sending FAQ question:', error);
    }
  };

  return (
    <div className="bg-black text-light min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Call-to-action section */}
      <section className="flex flex-col items-center justify-center text-center mt-44">
        <h2 className="text-5xl">Get guidance. Stay informed.</h2>
        <p className="text-2xl mt-4">
          Simplify your admissions journey. <br />
          Free to use. Easy to try. Just ask and get the information you need to start your admissions journey.
        </p>
        <div className="mt-6">
          {/* Register button links to /register */}
          <Link to="/register">
            <button className="bg-secondary text-dark px-4 py-2 rounded-md shadow-md hover:bg-light">
              Register
            </button>
          </Link>

          {/* Login button links to /login */}
          <Link to="/login">
            <button className="ml-4 bg-secondary text-dark px-4 py-2 rounded-md shadow-md hover:bg-light">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative mt-24 bg-dark text-light py-10">
        <FAQSection onFAQClick={handleFAQClick} /> {/* Pass the handler to FAQSection */}
      </section>
    </div>
  );
};

export default Home;
