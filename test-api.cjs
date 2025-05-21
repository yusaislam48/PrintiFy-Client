// Simple test script using CommonJS
const https = require('https');

const API_URL = 'https://printify-server-production.up.railway.app';

console.log(`Testing connection to: ${API_URL}`);

// Make a GET request to the API
https.get(API_URL, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    console.log('Response Data:', data);
    console.log('API connection successful!');
  });
}).on('error', (err) => {
  console.error('Error connecting to API:', err.message);
}); 