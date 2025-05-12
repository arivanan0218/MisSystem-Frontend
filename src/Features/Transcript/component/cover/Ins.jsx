import React from 'react';

const Ins = () => {
  return (
    <div className="font-poppins transform translate-x-4 p-8">
      <h1 className="text-blue-950 text-3xl font-bold mb-8">Explanation of Transcript</h1>

      <div className="flex w-full">
        {/* Left div (2 parts) */}
        <div className="w-2/5 bg-gray-200 p-4 border-2 border-blue-950 rounded-2xl mb-8">
        <h2 className="text-blue-950 text-2xl font-semibold mb-4">Creating System</h2>
        
        <div className="ml-4">
            <h3 className="text-blue-950 text-xl font-medium mb-2">For GPA Modules</h3>
            <p className="font-semibold mb-2">Grade:</p>
            <div className="space-y-1 ml-4">
              <p>Grade I was:</p>
              <p>1.0</p>
              <p>2.5</p>
              <p>3.0</p>
              <p>4.0</p>
              <p>5.0</p>
            </div>
          </div>
        </div>
        
        {/* Right div (3 parts) */}
        <div className="w-3/5 bg-gray-300 p-4 border-2 border-blue-950 rounded-2xl mb-8">
        <h2 className="text-blue-950 text-2xl font-semibold mb-4">Use of the GPA Modules</h2>
        
        <div className="ml-4">
          <p className="font-semibold mb-2">Grade:</p>
          <p className="mb-2">Grade II was:</p>
          <div className="space-y-1 ml-4">
            <p>Major: 1.0</p>
            <p>Major: 2.5</p>
            <p>Major: 3.0</p>
            <p>Major: 4.0</p>
          </div>
        </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Ins;