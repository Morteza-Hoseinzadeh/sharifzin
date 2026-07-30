import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000' || process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000' || process.env.BASE_URL,
  },
});

export default axiosInstance;
