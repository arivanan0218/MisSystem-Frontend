import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import { useUserRole } from '../Context/UserRoleContext';

const Login = () => {
  const { setUserRole } = useUserRole();
/*   // Dummy data to simulate logged-in user role (in real apps, you would get this from your backend)
const userRoles = {
  student: 'student',
  teacher: 'teacher',
  superadmin: 'superadmin',
};       */

useEffect(() => {
  // Check if a user role is stored in localStorage when the app loads
  const storedUserRole = localStorage.getItem('userRole');
  if (storedUserRole) {
    setUserRole(storedUserRole); // Set role from localStorage
  }
}, [setUserRole]);

const handleLogin = () => {
  // Simulate a login process
  const loggedInUserRole = 'superadmin'; // Example of setting superadmin
  setUserRole(loggedInUserRole);
  localStorage.setItem('userRole', loggedInUserRole); // Store the role in localStorage
};


    

  /* // This function simulates logging in and getting the user's role from the backend
  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5173/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save the JWT token to localStorage (optional)
        localStorage.setItem('auth-token', data.token);
        // Set the user role in state
        setUserRole(data.role);
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }; */

  return (
    <div className='transform translate-x-4 font-poppins'>
      <Header />
      <div className='text-blue-950 flex justify-center'>
        <div className='py-[51px] px-[62px] border-[2px] border-blue-950 rounded-2xl flex flex-col items-center'>
          <p className='text-center text-blue-950 text-[80px] font-bold leading-[80px]'>FEMIS</p>
          <p className='text-center text-xl font-medium mb-3 mt-2'>Welcome to the Management Information System!</p>
          <p className='text-center text-blue-950 text-[27px] font-semibold'>Your User name and Password</p>
          <input
            className='text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none'
            type="text"
            placeholder='User name'
          />
          <input
            className='text-sm w-[380px] p-2 m-2 border border-gray-400 hover:border-gray-300 placeholder-gray-400 focus:outline-none'
            type="password"
            placeholder='Password'
          />
          <Link to={'/departments'}>
            <button onClick={handleLogin} className='w-[380px] h-[60px] bg-blue-950 rounded-md text-center text-white text-lg font-medium'>Sign in</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
