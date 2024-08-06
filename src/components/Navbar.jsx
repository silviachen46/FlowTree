import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: Add some basic styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/manage-flows">Manage Flows</Link>
    </nav>
  );
};

export default Navbar;
