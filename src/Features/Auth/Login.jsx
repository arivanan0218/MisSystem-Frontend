import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useUserRole } from "../../Context/UserRoleContext";
import axios from "../../axiosConfig";

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

      if (!response.data) throw new Error("Empty response from server");

      let jwtToken = null;
      if (response.data.jwtToken) jwtToken = response.data.jwtToken;
      else if (response.data.token) jwtToken = response.data.token;
      else {
        const authHeader = response.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          jwtToken = authHeader.substring(7);
        }
      }

      if (jwtToken && typeof jwtToken === "string" && jwtToken.includes("=")) {
        const tokenParts = jwtToken.split(";");
        const tokenKeyValue = tokenParts[0].split("=");
        if (tokenKeyValue.length > 1) {
          jwtToken = tokenKeyValue[1];
        }
      }

      if (!jwtToken) throw new Error("Could not extract JWT token from response");
      if (!response.data.roles || !Array.isArray(response.data.roles) || response.data.roles.length === 0) {
        throw new Error("No roles found in response");
      }

      const primaryRole = response.data.roles[0];

      localStorage.setItem("auth-token", jwtToken);
      localStorage.setItem("userRole", primaryRole);
      setUserRole(primaryRole);

      navigate("/departments");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white border-2 border-blue-950 rounded-2xl p-6 sm:p-10">
          <h1 className="text-center text-blue-950 text-5xl sm:text-6xl font-bold leading-tight mb-2">
            FEMIS
          </h1>
          <p className="text-center text-base sm:text-lg font-medium mb-4">
            Welcome to the Management Information System!
          </p>
          <p className="text-center text-blue-950 text-lg sm:text-2xl font-semibold mb-2">
            Your Username and Password
          </p>
          <input
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            className="w-full text-sm p-3 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none rounded mb-3"
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className="w-full text-sm p-3 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none rounded mb-5"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-full h-[50px] bg-blue-950 rounded-md text-white text-lg font-medium hover:bg-blue-800 transition-colors duration-300"
          >
            Sign in
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          <p className="text-sm mt-6 text-center">
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
