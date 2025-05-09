import axios from 'axios';

// Create an axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8081/api', // Replace with your backend URL
  withCredentials: true, // Send cookies with requests, if required
});

// Debug function to log token info
const logTokenInfo = (token) => {
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 0);
  if (token) {
    console.log('Token first 10 chars:', token.substring(0, 10) + '...');
  }
};

// Function to get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem('auth-token');
  logTokenInfo(token);
  return token;
};

// Axios request interceptor to add the token to the Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Retrieve the token
    if (token) {
      // Log the request being made
      console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
      
      // Log the full headers for debugging
      console.log('Request headers:', config.headers);
    } else {
      console.warn('No auth token available for request to:', config.url);
    }
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
instance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    console.log('Response received:', response.status, response.statusText);
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    if (error.response) {
      console.error(`Error response: ${error.response.status} ${error.response.statusText}`);
      console.error('Error response headers:', error.response.headers);
      
      if (error.response.status === 401) {
        console.error('Authentication error (401) detected');
        console.error('Current token:', getToken());
        
        // You might want to redirect to login or clear the token
        // localStorage.removeItem('auth-token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;