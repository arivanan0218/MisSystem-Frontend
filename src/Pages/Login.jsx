import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useUserRole } from "../Context/UserRoleContext";
import axios from "../axiosConfig"; // Adjust the import path as necessary

const Login = () => {
  const { setUserRole } = useUserRole();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("/auth/signin", credentials);
      console.log("Full login response:", response);

      // Check if we have the necessary data
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      // Log the raw response data for debugging
      console.log("Auth response data:", response.data);
      
      // Check for token in different possible locations
      let jwtToken = null;
      
      // Option 1: Direct jwtToken property
      if (response.data.jwtToken) {
        jwtToken = response.data.jwtToken;
        console.log("Found token in response.data.jwtToken");
      } 
      // Option 2: token property
      else if (response.data.token) {
        jwtToken = response.data.token;
        console.log("Found token in response.data.token");
      }
      // Option 3: Check if token is in the response headers
      else {
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          jwtToken = authHeader.substring(7);
          console.log("Found token in authorization header");
        }
      }
      
      console.log("Raw token:", jwtToken);
      
      // If the token includes cookie attributes, extract just the token value
      if (jwtToken && typeof jwtToken === 'string' && jwtToken.includes('=')) {
        const tokenParts = jwtToken.split(';');
        const tokenKeyValue = tokenParts[0].split('=');
        if (tokenKeyValue.length > 1) {
          jwtToken = tokenKeyValue[1];
          console.log("Extracted token from cookie format:", jwtToken);
        }
      }
      
      // Verify we have a token
      if (!jwtToken) {
        throw new Error("Could not extract JWT token from response");
      }
      
      // Check for roles
      if (!response.data.roles || !Array.isArray(response.data.roles) || response.data.roles.length === 0) {
        throw new Error("No roles found in response");
      }
      
      const primaryRole = response.data.roles[0]; // Use the first role as the primary role
      console.log("User role:", primaryRole);

      // Save JWT token and user role
      localStorage.setItem("auth-token", jwtToken);
      console.log("Token saved to localStorage, length:", jwtToken.length);
      
      localStorage.setItem("userRole", primaryRole);
      setUserRole(primaryRole);

      // Redirect all users to the home page regardless of role
      console.log('Redirecting user with role:', primaryRole, 'to home page');
      navigate('/departments');
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="transform translate-x-4 font-poppins">
      <Header />
      <div className="text-blue-950 flex justify-center">
        <div className="py-[51px] px-[62px] border-[2px] border-blue-950 rounded-2xl flex flex-col items-center">
          <p className="text-center text-blue-950 text-[80px] font-bold leading-[80px]">
            FEMIS
          </p>
          <p className="text-center text-xl font-medium mb-3 mt-2">
            Welcome to the Management Information System!
          </p>
          <p className="text-center text-blue-950 text-[27px] font-semibold">
            Your Username and Password
          </p>
          <input
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-[380px] h-[60px] bg-blue-950 rounded-md text-center text-white text-lg font-medium"
          >
            Sign in
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <p className="text-sm mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-700 cursor-pointer underline"
            >
              Create your account
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
