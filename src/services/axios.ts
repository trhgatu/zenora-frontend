import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;