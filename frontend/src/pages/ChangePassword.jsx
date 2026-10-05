import { useState } from 'react';
import axios from 'axios';
import { API_URL, getHeaders } from '../api';

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const response = await axios.put(API_URL + '/auth/change-password', form, { headers: getHeaders() });
      setMessage(response.data.message);
      setForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Could not change password');
    }
  }

  return (
    <section>
      <div className="page-heading"><div><h2>Change Password</h2><p>Update your account password.</p></div></div>
      <form className="panel form-grid small-form" onSubmit={submit}>
        <label>Current Password<input type="password" name="currentPassword" value={form.currentPassword} onChange={changeForm} required /></label>
        <label>New Password<input type="password" name="newPassword" value={form.newPassword} onChange={changeForm} required /></label>
        <div className="form-actions"><button className="primary">Change Password</button></div>
        {message && <p className="message">{message}</p>}
      </form>
    </section>
  );
}

export default ChangePassword;
