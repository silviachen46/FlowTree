import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';



const handleStyle = { left: 10 };

function regenTextNode({ isConnectable }) {

  const onButtonClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="regen-text-node" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 4, textAlign: 'center' }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <button onClick={onButtonClick}>Click Me</button>
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

export default regenTextNode;
