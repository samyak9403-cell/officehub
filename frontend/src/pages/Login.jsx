import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (error) {
      setMessage('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={login}>
        <h1>OfficeHub</h1>
        <p>Login to continue</p>

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />

        {message && <p className="error">{message}</p>}

        <button className="primary full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p>
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/register')}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
