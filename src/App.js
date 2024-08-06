import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Flow from './components/flow';
import FlowManager from './components/FlowManager';
import './App.css'; // Optional: Add some basic styling for the navigation bar

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Flow />} />
          <Route path="/manage-flows" element={<FlowManager />} />
        </Routes>
      </div>
    </Router>
  );
}

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/manage-flows">Manage Flows</Link>
    </nav>
  );
};

export default App;
