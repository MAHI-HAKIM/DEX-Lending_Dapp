import React from 'react';

const SearchEmployee = () => {
  return (
    <div className="flex items-center justify-center mt-4">
      <input 
        type="text" 
        placeholder="Search Employee..." 
        className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchEmployee;