const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function getHeaders() {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export { API_URL };
