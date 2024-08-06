
import { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import './feedBackTextNode.css';

const handleStyle = { left: 10 };

function FeedbackTextNode({ id, data, isConnectable }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState('');
  const textareaRef = useRef(null);
  const { onAddFeedBackNode } = data;
  const { onDeleteNode } = data;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.width = 'auto';
      textareaRef.current.style.height = 'auto';
    }
  }, [data.label]);

  const handleDelete = () => {
    onDeleteNode(id);
  };

  const onChange = useCallback((evt) => {
    setText(evt.target.value);
    console.log(evt.target.value);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setStatus('Loading');
      
      const formData = new FormData();
      formData.append('text', text);
      

      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    //   setResponse(result.text);
    //   setStatus('Success');
      onAddFeedBackNode(id, result.text);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error');
      setResponse('Failed to get response from server');
    }
  }, [text, onAddFeedBackNode, id]);

  return (
    <div className="text-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          readOnly
          value={data.label}
          className="scrollable-textarea"
        />
      </div>
      <div className="second-textarea-container">
        <textarea
          value={text}
          onChange={onChange}
          className="second-textarea"
          placeholder="Enter text here..."
        />
        <button onClick={onSubmit} className="node-button">
          Submit
        </button>
        <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
      </div>
      {status && <div className={`status ${status.toLowerCase()}`}>{status}</div>}
      {response && <div className="response">Response: {response}</div>}
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default FeedbackTextNode;