import React, { useState, useCallback } from 'react';
import 'reactflow/dist/style.css';
import './text-updater-node.css';
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextUpdaterNode from './TextUpdaterNode.js';

import './text-updater-node.css';
import PureTextNode from './PureTextNode.js';
import FeedbackTextNode from './feedBackTextNode.js';
import MultiConversationNode from './multiconversation.js';
import Sidebar from './sidebar.js';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};



const nodeTypes = {
  textUpdate:TextUpdaterNode,
  pureText:PureTextNode,
  feedBackNode: FeedbackTextNode,
  multiConversation: MultiConversationNode
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('LLM Response:', data.text);

      // Add a new node for the LLM response
      const newNode = {
        id: Date.now().toString(),
        type: 'default',
        data: { label: `LLM Response: ${data.text}` },
        position: { x: 250, y: 150 },
      };
      setNodes((nds) => [...nds, newNode]);

      // Connect the input node to the new LLM response node
      setEdges((eds) => [
        ...eds,
        { id: `e1-${newNode.id}`, source: '1', target: newNode.id },
      ]);

      setInputText('');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const onAddNode = (responseText) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'textUpdate',
      data: { label: `LLM Response: ${responseText}` },
      position: { x: 250, y: 150 },
    };

    // Add new node
    setNodes((nds) => [...nds, newNode]);

    // Connect new node to the previous node
    const newEdge = {
      id: `e1-${newNode.id}`,
      source: '1', // Assuming the initial node has id '1'
      target: newNode.id,
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };

  const onAddCustomNode = (type) => {
    const newNode = {
      id: Date.now().toString(),
      type: type,
      data: {},
      position: { x: 250, y: 150 },
    };

    // Add new node
    setNodes((nds) => [...nds, newNode]);

    // Connect new node to the previous node
    const newEdge = {
      id: `e1-${newNode.id}`,
      source: '1', // Assuming the initial node has id '1'
      target: newNode.id,
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };
  
  const onAddTextNode = (responseText) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'pureText',
      data: { label: `LLM Response: ${responseText}` },
      position: { x: 250, y: 150 },
    };

    // Add new node
    setNodes((nds) => [...nds, newNode]);

    // Connect new node to the previous node
    const newEdge = {
      id: `e1-${newNode.id}`,
      source: '1', // Assuming the initial node has id '1'
      target: newNode.id,
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };

  
  const onAddFeedBackNode = (id_prev, responseText) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'feedBackNode',
      data: { label: `LLM Response: ${responseText}`, onAddFeedBackNode, onDeleteNode },
      position: { x: 250, y: 150 },
    };

    // Add new node
    setNodes((nds) => [...nds, newNode]);

    // Connect new node to the previous node
    const newEdge = {
      id: `e1-${newNode.id}`,
      source: id_prev, // Assuming the initial node has id '1'
      target: newNode.id,
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };
  // Initial nodes setup with handleSubmit and setInputText
  
  
  const initialNodes = [
    {
      id: '1',
      type: 'textUpdate',
      position: { x: 250, y: 25 },
      data: { inputText, setInputText, handleSubmit,onAddNode, onAddTextNode,onAddFeedBackNode }
    },
  ];
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  const resetFlow = () => {
    setNodes(initialNodes);
    setEdges([]);
  };


  // Set initial nodes
  useState(() => {
    setNodes(initialNodes);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ display: 'flex' }}>
    <Sidebar onAddCustomNode={onAddCustomNode} />
    <button onClick={resetFlow} style={{ margin: '10px' }}>Reset Flow</button>
    <div style={{ flexGrow: 1 }}>
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
    </div>
    </div>
  );
};

export default Flow;
