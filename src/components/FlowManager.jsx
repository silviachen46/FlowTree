import React, { useState } from 'react';
import Flow from './flow';
import './FlowManager.css'; // Optional: Add some basic styling

const FlowManager = () => {
  const [flows, setFlows] = useState([]);

  const addFlow = () => {
    setFlows((prevFlows) => [
      ...prevFlows,
      { id: Date.now().toString() } // Unique ID for each flow
    ]);
  };

  return (
    <div className="flow-manager">
      <button onClick={addFlow}>Add New Flow Board</button>
      <div className="flow-list">
        {flows.map((flow) => (
          <div key={flow.id} className="flow-container">
            <Flow flowId={flow.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowManager;
