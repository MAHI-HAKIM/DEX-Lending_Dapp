import React, { useState } from "react";
import Eth from "./Eth";

function StatBar(props) {
  const [isFullValue, setIsFullValue] = useState(false); // Track if the full value should be shown

  // Function to handle toggling between full and truncated values
  const handleClick = () => {
    console.log("StatBar.js - handleClick - isFullValue: ", isFullValue);
    setIsFullValue(!isFullValue); // Toggle the state
  };

  // Function to format the number (truncate after 3 decimals)
  const formatNumber = (number) => {
    if (!number) return "0";

    const num = parseFloat(number);
    const strNum = num.toString();
    const decimalIndex = strNum.indexOf(".");

    if (decimalIndex !== -1 && strNum.length - decimalIndex > 4) {
      return `${num.toFixed(3)}...`; // Truncate after 3 decimals and add "..."
    }
    return strNum;
  };

  // Get the display value, either full or truncated
  const displayValue = isFullValue ? props.value : formatNumber(props.value);

  return (
    <>
      <article className="rounded-lg border border-gray-100 bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md text-gray-500">{props.title}</p>
            <p
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
            </p>
          </div>

          <span className="rounded-full bg-blue-100 p-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>

        <div className="mt-1 flex gap-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>

          <p className="flex gap-2 text-xs">
            <span className="font-medium">67.81%</span>
            <span className="text-gray-500">Since last week</span>
          </p>
        </div>
      </article>
    </>
  );
}

export default StatBar;
