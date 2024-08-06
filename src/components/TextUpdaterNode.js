import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import './text-updater-node.css'; // Ensure CSS file is imported

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [image, setImage] = useState(null); // State to store the uploaded image
  const [imagePreview, setImagePreview] = useState(''); // State for image preview

  const { onAddFeedBackNode } = data;

  const options = ['Brainstorming Mode', 'ChainOfThought Mode', 'Mix Mode', 'Multi-Modal Mode']; // Dropdown options

  const onChange = useCallback((evt) => {
    setText(evt.target.value);
    console.log(evt.target.value);
  }, []);

  const onDropdownChange = useCallback((evt) => {
    setSelectedOption(evt.target.value);
    console.log('Selected option:', evt.target.value);
    if (evt.target.value !== 'Multi-Modal Mode') {
      setImage(null);
      setImagePreview('');
    }
  }, []);

  const onImageChange = useCallback((evt) => {
    const file = evt.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setStatus('Loading');
      const formData = new FormData();
      formData.append('text', text);
      // formData.append('option', selectedOption);
      if (image) {
        formData.append('image', image);
      }
      console.log(formData)
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // console.log('Success:', result);
      // setResponse(result.text);
      setStatus('Success');
      // Trigger the addition of a new node and connection
      onAddFeedBackNode('1', result.text); // Pass appropriate ID and response
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error');
      setResponse('Failed to get response from server');
    }
  }, [text, selectedOption, image, onAddFeedBackNode]);

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <div>
        <label htmlFor="dropdown">Choose an option:</label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={onDropdownChange}
          className="dropdown"
        >
          <option value="">Select...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {selectedOption === 'Multi-Modal Mode' && (
        <div>
          <label htmlFor="image-upload">Upload an image:</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="image-upload"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-img" />
            </div>
          )}
        </div>
      )}
      <button onClick={onSubmit}>Submit</button>
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

export default TextUpdaterNode;
