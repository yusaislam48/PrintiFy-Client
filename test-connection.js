// Simple test script to check API connection
const axios = require('axios');

const API_URL = process.env.VITE_API_URL || 'https://printify-server-production.up.railway.app';

console.log(`Testing connection to: ${API_URL}`);

// Test the root endpoint
axios.get(API_URL)
  .then(response => {
    console.log('Root endpoint test successful!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    // Test CORS by attempting a login with incorrect credentials
    return axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
  })
  .then(response => {
    console.log('Login endpoint test successful (though authentication failed as expected)');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error testing API:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
      
      // If we get a 401/403 for login, that means the API is working but credentials are wrong
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('API connection appears to be working (got expected auth error)');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. This could be a CORS or network issue.');
      console.error(error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
  }); 