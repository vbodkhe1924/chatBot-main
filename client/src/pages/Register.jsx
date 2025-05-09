// import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link

// const RegisterPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-black">
//       {/* Left side (Gradient background with steps) */}
//       <div className="md:w-1/2 bg-gradient-to-br from-purple-700 via-purple-800 to-black flex flex-col items-center justify-center p-8 rounded-2xl mt-4">
//         <div className="text-center">
//           <h1 className="text-white text-3xl font-bold mb-4">CampusCompass</h1>
//           <h2 className="text-white text-4xl font-bold mb-6">Get Started with Us</h2>
//           <p className="text-white text-lg mb-8">
//             Complete these easy steps to register your account.
//           </p>
//           <div className="space-y-4">
//             <div className="bg-white text-black text-xl py-3 px-4 rounded-lg">
//               <span className="font-bold mr-2">1</span>
//               Sign up your account
//             </div>
//             <div className="bg-gray-800 text-gray-400 text-xl py-3 px-4 rounded-lg">
//               <span className="font-bold mr-2">2</span>
//               Login into your account
//             </div>
//             <div className="bg-gray-800 text-gray-400 text-xl py-3 px-4 rounded-lg">
//               <span className="font-bold mr-2">3</span>
//               Get Started
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right side (Form) */}
//       <div className="md:w-1/2 bg-black flex flex-col items-center justify-center p-8">
//         <div className="bg-black rounded-lg p-8 shadow-md w-full max-w-md">
//           <h2 className="text-white text-3xl font-semibold mb-6">Sign Up Account</h2>
//           <p className="text-gray-400 mb-4">Enter your personal data to create your account.</p>

//           {/* Form */}
//           <form>
//             <div className="flex space-x-4 mb-4">
//               <input
//                 type="text"
//                 placeholder="eg. Ramu"
//                 className="bg-gray-800 text-white py-3 px-4 rounded-md w-1/2"
//               />
//               <input
//                 type="text"
//                 placeholder="eg. Sharma"
//                 className="bg-gray-800 text-white py-3 px-4 rounded-md w-1/2"
//               />
//             </div>
//             <div className="mb-4">
//               <input
//                 type="email"
//                 placeholder="eg. ramusharma@gmail.com"
//                 className="bg-gray-800 text-white py-3 px-4 rounded-md w-full"
//               />
//             </div>
//             <div className="mb-6">
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="bg-gray-800 text-white py-3 px-4 rounded-md w-full"
//               />
//               <p className="text-gray-400 text-sm mt-2">Must be at least 8 characters.</p>
//             </div>
//             <button
//               type="submit"
//               className="bg-white text-black py-3 px-4 rounded-md w-full"
//             >
//               Sign Up
//             </button>
//           </form>

//           {/* Log In Link */}
//           <p className="text-gray-400 text-center mt-4">
//             Already have an account? <Link to="/login" className="text-white underline">Log in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

const RegisterPage = () => {
  // State to hold form input values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        'first-name': firstName,
        'last-name': lastName,
        email,
        password,
      });

      if (response.data.success) {
        setMessage(response.data.message); // Set success message
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message); // Set error message from the server
      } else {
        setMessage('An error occurred. Please try again.'); // Generic error message
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left side (Gradient background with steps) */}
      <div className="md:w-1/2 bg-gradient-to-br from-purple-700 via-purple-800 to-black flex flex-col items-center justify-center p-8 rounded-2xl mt-4">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">CampusCompass</h1>
          <h2 className="text-white text-4xl font-bold mb-6">Get Started with Us</h2>
          <p className="text-white text-lg mb-8">
            Complete these easy steps to register your account.
          </p>
          <div className="space-y-4">
            <div className="bg-white text-black text-xl py-3 px-4 rounded-lg">
              <span className="font-bold mr-2">1</span>
              Sign up your account
            </div>
            <div className="bg-gray-800 text-gray-400 text-xl py-3 px-4 rounded-lg">
              <span className="font-bold mr-2">2</span>
              Login into your account
            </div>
            <div className="bg-gray-800 text-gray-400 text-xl py-3 px-4 rounded-lg">
              <span className="font-bold mr-2">3</span>
              Get Started
            </div>
          </div>
        </div>
      </div>

      {/* Right side (Form) */}
      <div className="md:w-1/2 bg-black flex flex-col items-center justify-center p-8">
        <div className="bg-black rounded-lg p-8 shadow-md w-full max-w-md">
          <h2 className="text-white text-3xl font-semibold mb-6">Sign Up Account</h2>
          <p className="text-gray-400 mb-4">Enter your personal data to create your account.</p>

          {/* Display messages */}
          {message && <p className={`text-white text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

          {/* Form */}
          <form onSubmit={handleSignup}>
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="bg-gray-800 text-white py-3 px-4 rounded-md w-1/2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="bg-gray-800 text-white py-3 px-4 rounded-md w-1/2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="bg-gray-800 text-white py-3 px-4 rounded-md w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-gray-800 text-white py-3 px-4 rounded-md w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-gray-400 text-sm mt-2">Must be at least 8 characters.</p>
            </div>
            <button
              type="submit"
              className="bg-white text-black py-3 px-4 rounded-md w-full"
            >
              Sign Up
            </button>
          </form>

          {/* Log In Link */}
          <p className="text-gray-400 text-center mt-4">
            Already have an account? <Link to="/login" className="text-white underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
