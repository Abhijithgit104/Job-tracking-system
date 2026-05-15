import axios from 'axios';

const API_URL =  "https://job-tracking-system-1-c57w.onrender.com/api/";

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
