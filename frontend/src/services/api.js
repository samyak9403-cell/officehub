const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

const api = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  }
};

export default api;
