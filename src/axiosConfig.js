import axios from 'axios';

// Create an axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8081/api', // Replace with your backend URL
  withCredentials: true, // Send cookies with requests, if required
});

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token'); // Assuming the token is stored in localStorage under 'token'
};

// Axios request interceptor to add the token to the Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Retrieve the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default instance;