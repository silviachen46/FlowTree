import { useCallback, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import './PureTextNode.css';

const handleStyle = { left: 10 };

function PureTextNode({ data, isConnectable }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Set the textarea width dynamically based on its content
      textareaRef.current.style.width = 'auto';
      textareaRef.current.style.height = 'auto'; // Reset height to calculate correct scrollHeight
    }
  }, [data.label]);

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

export default PureTextNode;
