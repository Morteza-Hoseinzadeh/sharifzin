import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || 'https://sharifzin.ir',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.BASE_URL,
  },
});

export default axiosInstance;
