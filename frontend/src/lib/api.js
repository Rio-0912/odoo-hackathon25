import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the user ID if needed (optional for simple auth)
// For now, we'll just leave it clean or attach a mock header if the backend expected it.
// Since we removed JWT, we don't need to attach the token.

export default api;
