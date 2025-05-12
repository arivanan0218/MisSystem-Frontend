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
      
      
      {/* Codeholder Requirements Section */}
      {/* <div className="border-2 border-blue-950 rounded-2xl p-6 mb-8">
        <h2 className="text-blue-950 text-2xl font-semibold mb-4">Codeholder Requirements</h2>
        
        <ul className="list-disc ml-8 space-y-4">
          <li>A registered total of 320 enrolled students in the Career Modules (CBA Technical Library, ETC) General Report (GT) General Form for his official by May her specialization course and General Training.</li>
          <li>Technical Library and General Review modules must be chosen from the list offered by the general Department authorized; the evaluation requirements are appropriate; and the provided by the Institutional Engineer, St Lindsd (IRS).</li>
          <li>Competitized the Development Programme, Industrial Training, Surgical Language Delivery, Test and new other mandatory requirements prescribed by the Faculty Board, with the approval of the Board.</li>
          <li>A maximum Overall Cost Index Average of 2.00.</li>
          <li>A maximum requirement not less academic years as a daily registered full time student of the University.</li>
        </ul>
      </div> */}

      {/* CCFA Formula Section */}
      {/* <div className="border-2 border-blue-950 rounded-2xl p-6 mb-8">
        <h2 className="text-blue-950 text-2xl font-semibold mb-4">The Overall Cost Index Average (CCFA)</h2>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="whitespace-pre-wrap">
            {`COF = ∑_{i=1}^{N} ( (∑_{j=1}^{n} C_i²) / (C_j + C_i²) )\n\n`}
            where C is the number of students that is working the graduation requirement in the P semester.\n
            C/V is the cost level at which the student is enrolled,\n
            N is the number of students that are working the graduation requirement in the P semester.\n
            V_i is defined as follows:\n\n
            - C_i is for i = 1, 2, ..., N\n
            - C_i is for i = 2, ..., N
          </code>
        </div>
      </div> */}
    </div>
  );
};

export default Ins;