import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useUserRole } from '../Context/UserRoleContext';
import axios from '../axiosConfig';  // Adjust the import path as necessary

const Login = () => {
  const { setUserRole } = useUserRole();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/signin', credentials);

      if (!response.data.jwtToken || !response.data.roles || response.data.roles.length === 0) {
        throw new Error('Missing token or roles in response');
      }

      const jwtToken = response.data.jwtToken;
      const primaryRole = response.data.roles[0]; // Use the first role as the primary role

      // Save JWT token and user role
      localStorage.setItem('auth-token', jwtToken);
      localStorage.setItem('userRole', primaryRole);
      setUserRole(primaryRole);

      // Redirect based on role
      const roleRoutes = {
        ROLE_AR: '/departments',
        ROLE_LECTURER: '/departments',
        ROLE_HOD: '/departments',
        ROLE_MODULE_COORDINATOR: '/departments',
        ROLE_STUDENT: '/studentDepartments',
      };

      const route = roleRoutes[primaryRole];
      if (route) {
        navigate(route);
      } else {
        throw new Error('Unknown role');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="transform translate-x-4 font-poppins">
      <Header />
      <div className="text-blue-950 flex justify-center">
        <div className="py-[51px] px-[62px] border-[2px] border-blue-950 rounded-2xl flex flex-col items-center">
          <p className="text-center text-blue-950 text-[80px] font-bold leading-[80px]">FEMIS</p>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
