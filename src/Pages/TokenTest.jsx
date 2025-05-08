import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const TokenTest = () => {
  const [tokenInfo, setTokenInfo] = useState({
    exists: false,
    value: "",
    length: 0
  });
  const [testResult, setTestResult] = useState({
    status: "Not tested",
    message: "",
    details: ""
  });

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("auth-token");
    setTokenInfo({
      exists: !!token,
      value: token ? `${token.substring(0, 10)}...` : "",
      length: token ? token.length : 0
    });
  }, []);

  const testAuth = async () => {
    try {
      setTestResult({
        status: "Testing...",
        message: "Sending request to test endpoint...",
        details: ""
      });

      // Try to access a simple endpoint that requires authentication
      const response = await axios.get("/auth/username", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`
        }
      });

      setTestResult({
        status: "Success",
        message: "Authentication successful!",
        details: `Response: ${JSON.stringify(response.data)}`
      });
    } catch (error) {
      setTestResult({
        status: "Failed",
        message: `Authentication failed: ${error.message}`,
        details: error.response 
          ? `Status: ${error.response.status}, Message: ${error.response.statusText}`
          : "No response details available"
      });
    }
  };

  const clearToken = () => {
    localStorage.removeItem("auth-token");
    setTokenInfo({
      exists: false,
      value: "",
      length: 0
    });
    setTestResult({
      status: "Token cleared",
      message: "Auth token has been removed from localStorage",
      details: ""
    });
  };

  return (
    <div className="font-poppins">
      <Header />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Token Test</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Token Information</h2>
          <p><strong>Token exists:</strong> {tokenInfo.exists ? "Yes" : "No"}</p>
          <p><strong>Token preview:</strong> {tokenInfo.value}</p>
          <p><strong>Token length:</strong> {tokenInfo.length} characters</p>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={testAuth}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Authentication
          </button>
          <button 
            onClick={clearToken}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear Token
          </button>
        </div>
        
        <div className={`p-4 rounded-lg mb-6 ${
          testResult.status === "Success" ? "bg-green-100" : 
          testResult.status === "Failed" ? "bg-red-100" : "bg-gray-100"
        }`}>
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          <p><strong>Status:</strong> {testResult.status}</p>
          <p><strong>Message:</strong> {testResult.message}</p>
          {testResult.details && (
            <div className="mt-2">
              <p><strong>Details:</strong></p>
              <pre className="bg-gray-800 text-white p-2 rounded mt-1 overflow-x-auto">
                {testResult.details}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>If authentication fails, try logging out and logging back in</li>
            <li>Check that your backend server is running</li>
            <li>Verify that the token format is correct</li>
            <li>Check for CORS issues in the browser console</li>
            <li>Make sure the token hasn't expired</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TokenTest;
