// Sidebar.js
import React from 'react';
import './sidebar.css'; // For sidebar styling

const Sidebar = ({ onAddCustomNode }) => {
  const handleAddNode = (type) => {
    onAddCustomNode(type);
  };

  return (
    <div className="sidebar">
      <button onClick={() => handleAddNode('textUpdate')}>Add Text Update Node</button>
      <button onClick={() => handleAddNode('pureText')}>Add Pure Text Node</button>
      <button onClick={() => handleAddNode('feedBackNode')}>Add Feedback Node</button>
      <button onClick={() => handleAddNode('multiConversation')}>Add multiConversation Node</button>
    </div>
  );
};

export default Sidebar;
