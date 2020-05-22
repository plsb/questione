import axios from 'axios';
import { getToken } from "./auth";

const api = axios.create({
  baseURL: 'https://200.17.32.102/api',
  //baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
