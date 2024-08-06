import { useCallback, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import './multiconversation.css';  // Make sure this CSS file exists

const handleStyle = { left: 10 };

function MultiConversationNode({ id, data, isConnectable }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState('');
  
  const { onAddFeedBackNode, onDeleteNode } = data;

  useEffect(() => {
    if (data.questions) {
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(''));
    }
  }, [data.questions]);

  const handleDelete = () => {
    onDeleteNode(id);
  };

  const handleAnswerChange = useCallback((index, value) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setStatus('Loading');

      const formData = new FormData();
      formData.append('answers', JSON.stringify(answers));

      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setResponse(result.message || 'Success');
      setStatus('Success');
      onAddFeedBackNode(id, result.message);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error');
      setResponse('Failed to get response from server');
    }
  }, [answers, onAddFeedBackNode, id]);

  return (
    <div className="text-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="questions-container">
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            <label>{question}</label>
            <textarea
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="answer-textarea"
              placeholder="Enter your answer..."
            />
          </div>
        ))}
      </div>
      <button onClick={onSubmit} className="submit-button">
        Submit
      </button>
      <button onClick={handleDelete} className="delete-button">
        Delete
      </button>
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

export default MultiConversationNode;
