import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function getHeaders() {
  return {
    Authorization: 'Bearer ' + getToken()
  };
}

export { API_URL };
