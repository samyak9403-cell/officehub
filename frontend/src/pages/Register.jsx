import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  async function registerUser(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Registration failed');
        return;
      }

      setMessage('Account created successfully');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage('Could not connect to server');
    }
  }

  return (
    <div className="register-page">
      <form className="register-box" onSubmit={registerUser}>
        <h1>OfficeHub</h1>

        <p>Create your account</p>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />

        {message && <p className="error">{message}</p>}

        <button className="primary" type="submit">
          Register
        </button>

        <p className="login-link">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
