import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const TranscriptLanding = () => {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      if (!regNumber.trim()) {
        throw new Error("Please enter a registration number");
      }

      // Add your API call here to generate transcript
      // Example:
      // const response = await axios.post("/transcript/generate", { regNumber });
      
      // Navigate to TranscriptPage with state
      navigate("/transcriptpage", {
        state: {
          regNumber: regNumber
        }
      });
      
    } catch (err) {
      console.error("Generation error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="transform translate-x-4 font-poppins">
      <Header />
      <div className="text-blue-950 flex justify-center min-h-screen">
        <div className="py-[51px] px-[62px] border-[2px] border-blue-950 rounded-2xl flex flex-col items-center h-fit mt-20">
          <p className="text-center text-blue-950 text-[40px] font-bold leading-[50px] mb-6">
            Generate Academic Transcript
          </p>
          
          <div className="flex flex-col items-center w-full">
            <input
              name="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 
                        placeholder-gray-400 focus:outline-none rounded-md"
              type="text"
              placeholder="Enter Student Registration Number"
            />
            
            <button
              onClick={handleGenerate}
              className="w-[380px] h-[60px] bg-blue-950 rounded-md text-center text-white 
                       text-lg font-medium hover:bg-blue-900 transition-colors duration-200"
            >
              Generate Transcript
            </button>
            
            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            
            <p className="text-sm mt-6 text-gray-600">
              Enter your official university registration number to generate your academic transcript. 
              This document will include all your completed courses and grades.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TranscriptLanding;