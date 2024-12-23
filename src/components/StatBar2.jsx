import React, { useState } from 'react';
import Eth from './Eth';

function StatBar2(props) {
  const [isFullValue, setIsFullValue] = useState(false); // Track if the full value should be shown

  // Function to handle toggling between full and truncated values
  const handleClick = () => {
    setIsFullValue(!isFullValue); // Toggle the state
  };

  // Function to format the number (truncate after 3 decimals)
  const formatNumber = (number) => {
    if (!number) return "0";
    
    const num = parseFloat(number);
    const strNum = num.toString();
    const decimalIndex = strNum.indexOf(".");

    if (decimalIndex !== -1 && strNum.length - decimalIndex > 4) {
      return `${num.toFixed(3)}...`;
    }
    return strNum;
  };

  // Get the display value, either full or truncated
  const displayValue = isFullValue ? props.value : formatNumber(props.value);

  return (
    <div>
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div>
          <strong className="block text-sm font-medium text-gray-500">{props.title}</strong>
          <p>
            <span
              className="text-2xl font-medium text-gray-900 cursor-pointer"
              onClick={handleClick} // Toggle value on click
              style={{
                wordWrap: 'break-word', // Ensure wrapping
                overflowWrap: 'break-word', // Allow word breaking
                whiteSpace: 'normal', // Allow text to break into multiple lines
                display: 'inline-block', // Make sure the element behaves like a block-level element
                maxWidth: '100%' // Prevent the value from exceeding its container's width
              }}
            >
              {displayValue} <Eth />
            </span>
          </p>
        </div>
      </article>
    </div>
  );
}

export default StatBar2;
