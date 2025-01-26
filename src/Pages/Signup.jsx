// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../Components/Header";
// import Footer from "../Components/Footer";
// import axios from "../axiosConfig"; // Adjust the import path as necessary

// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const roles = ["ar", "student", "lecturer", "modulecoordinator"]; // Role options

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSignup = async () => {
//     try {
//       // Ensure all fields are filled
//       if (
//         !formData.username ||
//         !formData.email ||
//         !formData.role ||
//         !formData.password
//       ) {
//         throw new Error("All fields are required");
//       }

//       // Prepare the request payload
//       const payload = {
//         username: formData.username,
//         email: formData.email,
//         role: [formData.role],
//         password: formData.password,
//       };

//       const response = await axios.post(
//         "http://localhost:8081/api/auth/signup",
//         payload
//       );

//       if (response.status === 200) {
//         setSuccessMessage("Signup successful! You can now log in.");
//         setError("");

//         // Redirect to login page after a short delay
//         setTimeout(() => navigate("/"), 1000);
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       setError(err.response?.data?.message || err.message);
//       setSuccessMessage("");
//     }
//   };

//   return (
//     <div className="transform translate-x-4 font-poppins">
//       <Header />
//       <div className="text-blue-950 flex justify-center">
//         <div className="py-[51px] px-[62px] border-[2px] border-blue-950 rounded-2xl flex flex-col items-center">
//           <p className="text-center text-blue-950 text-[80px] font-bold leading-[80px]">
//             FEMIS
//           </p>
//           <p className="text-center text-xl font-medium mb-3 mt-2">
//             Create Your Account
//           </p>
//           <input
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
//             type="text"
//             placeholder="Username"
//           />
//           <input
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
//             type="email"
//             placeholder="Email"
//           />
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleInputChange}
//             className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
//           >
//             <option value="" disabled>
//               Select Role
//             </option>
//             {roles.map((role) => (
//               <option key={role} value={role}>
//                 {role.charAt(0).toUpperCase() + role.slice(1)}
//               </option>
//             ))}
//           </select>
//           <input
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
//             type="password"
//             placeholder="Password"
//           />
//           <button
//             onClick={handleSignup}
//             className="w-[380px] h-[60px] bg-blue-950 rounded-md text-center text-white text-lg font-medium"
//           >
//             Sign up
//           </button>
//           {error && <p className="text-red-500 mt-4">{error}</p>}
//           {successMessage && (
//             <p className="text-green-500 mt-4">{successMessage}</p>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "../axiosConfig"; // Adjust the import path as necessary

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roles = ["ar", "student", "lecturer", "modulecoordinator"]; // Role options

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async () => {
    try {
      // Ensure all fields are filled
      if (
        !formData.username ||
        !formData.email ||
        !formData.role ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        throw new Error("All fields are required");
      }

      // Ensure passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Prepare the request payload
      const payload = {
        username: formData.username,
        email: formData.email,
        role: [formData.role],
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8081/api/auth/signup",
        payload
      );

      if (response.status === 200) {
        setSuccessMessage("Signup successful! You can now log in.");
        setError("");

        // Redirect to login page after a short delay
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || err.message);
      setSuccessMessage("");
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
            Create Your Account
          </p>
          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
            type="text"
            placeholder="Username"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
            type="email"
            placeholder="Email"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <div className="relative w-[380px] mr-4">
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="text-sm w-full p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-[50%] right-3 transform -translate-y-[50%] cursor-pointer text-gray-500"
            >
              {showPassword ? "ðŸ‘ï¸" : "ðŸ™ˆ"}
            </span>
          </div>
          <div className="relative w-[380px] mr-4">
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="text-sm w-full p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-[50%] right-3 transform -translate-y-[50%] cursor-pointer text-gray-500"
            >
              {showPassword ? "ðŸ‘ï¸" : "ðŸ™ˆ"}
            </span>
          </div>
          <button
            onClick={handleSignup}
            className="w-[380px] h-[60px] bg-blue-950 rounded-md text-center text-white text-lg font-medium mt-5"
          >
            Sign up
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 mt-4">{successMessage}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
