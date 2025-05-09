import React, { useState, useEffect, useRef } from 'react';
import FAQs from '../components/FAQs'; // Assuming FAQs component is in a separate file
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout

const ChatEnvironment = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [feedbackSatisfied, setFeedbackSatisfied] = useState(true);
  const [email, setEmail] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); // To handle navigation

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to get bot response based on user input
  const getBotResponse = async (userInput) => {
    // Update the messages to show the user's input
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: userInput }
    ]);

    try {
      // Send the user input to the backend
      const response = await axios.post(
        'http://127.0.0.1:5000/ask',
        { inputValue: userInput }
      );

      // Extract the actual message content from the response
      const botMessage = response.data.response;

      // Update the state with the new bot message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: botMessage }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: 'Sorry, something went wrong.' }
      ]);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      await getBotResponse(inputValue);
      setInputValue(''); // Clear input field
    }
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to handle clicking on an FAQ
  const handleFAQClick = (faq) => {
    getBotResponse(faq.question);
  };

  // Function to handle Logout
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true });
      localStorage.removeItem('userToken'); // Example if you're using tokens
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = async () => {
    try {
      const feedbackData = { satisfied: feedbackSatisfied, email: feedbackSatisfied ? '' : email };
      await axios.post('http://127.0.0.1:5000/feedback', feedbackData);
      // Reset feedback form
      setFeedbackSatisfied(true);
      setEmail('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="h-screen flex bg-[#24252D]">
      {/* FAQ Section */}
      <div className="w-1/4 bg-[#24252D] p-10 flex flex-col justify-between">
        <div className="text-white text-xl mb-6">FAQs</div>
        <FAQs onFAQClick={handleFAQClick} />
        <button
          onClick={handleLogout}
          className="mt-8 w-3/4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full"
        >
          Log Out
        </button>
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">CampusCompass</h2>

        {/* Chatbox messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] break-words ${
                  msg.sender === 'user'
                    ? 'bg-green-500 text-white text-xl'
                    : 'bg-gray-200 text-gray-800 text-xl'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 p-4 text-lg border border-gray-300 rounded-full focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white ml-3 px-4 py-2 rounded-full text-lg"
          >
            Send
          </button>
        </div>

        {/* Feedback Section */}
        <div className="mt-6">
          <h3 className="text-xl mb-2">Feedback</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={feedbackSatisfied}
              onChange={() => setFeedbackSatisfied(!feedbackSatisfied)}
              className="mr-2"
            />
            <label className="text-lg">I am satisfied with the chatbot response</label>
          </div>
          {!feedbackSatisfied && (
            <input
              type="email"
              placeholder="Enter your feedback along with your email or contact details  "
              className="p-4 text-lg border border-gray-300 rounded-full focus:outline-none w-full mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <button
            onClick={handleFeedbackSubmit}
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-lg ${feedbackSatisfied || email ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!feedbackSatisfied && !email} // Disable button if conditions are not met
          >
            Submit Feedback (GOOD)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatEnvironment;
