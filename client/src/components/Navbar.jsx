import React from 'react';
import { Link } from 'react-router-dom';  // Import Link

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-6 flex justify-between items-center px-24">
      <div className="text-4xl font-bold">CampusCompass</div>
      <ul className="flex gap-6">
        {/* Use Link instead of <a> */}
        <li><Link to="/" className="text-xl hover:text-green-600">Home</Link></li>
        <li><Link to="/register" className="text-xl hover:text-green-600">Register</Link></li>
        <li><Link to="/login" className="text-xl hover:text-green-600">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
