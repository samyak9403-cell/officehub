import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, getHeaders } from '../api';

function Leaves() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const [leaves, setLeaves] = useState([]);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ type: 'Casual', fromDate: '', toDate: '', reason: '' });

  async function loadLeaves() {
    try {
      const response = await axios.get(API_URL + '/leaves', {
        headers: getHeaders(),
        params: { status, limit: 50 }
      });
      setLeaves(response.data.leaves);
    } catch (error) {
      setMessage('Could not load leave requests');
    }
  }

  useEffect(() => {
    loadLeaves();
  }, [status]);

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitLeave(event) {
    event.preventDefault();
    try {
      await axios.post(API_URL + '/leaves', form, { headers: getHeaders() });
      setMessage('Leave request submitted');
      setForm({ type: 'Casual', fromDate: '', toDate: '', reason: '' });
      loadLeaves();
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Could not submit leave');
    }
  }

  async function changeStatus(id, newStatus) {
    try {
      await axios.patch(API_URL + '/leaves/' + id + '/status', { status: newStatus }, { headers: getHeaders() });
      setMessage('Leave request ' + newStatus.toLowerCase());
      loadLeaves();
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Could not update leave');
    }
  }

  return (
    <section>
      <div className="page-heading"><div><h2>Leave Management</h2><p>Submit and review leave requests.</p></div></div>
      {message && <p className="message">{message}</p>}

      {!isAdmin && (
        <form className="panel form-grid" onSubmit={submitLeave}>
          <h3>Apply for Leave</h3>
          <label>Leave Type<select name="type" value={form.type} onChange={changeForm}><option>Casual</option><option>Sick</option><option>Earned</option><option>Unpaid</option></select></label>
          <label>From Date<input name="fromDate" value={form.fromDate} onChange={changeForm} type="date" required /></label>
          <label>To Date<input name="toDate" value={form.toDate} onChange={changeForm} type="date" required /></label>
          <label className="wide">Reason<textarea name="reason" value={form.reason} onChange={changeForm} rows="3" required></textarea></label>
          <div className="form-actions"><button className="primary">Submit Leave</button></div>
        </form>
      )}

      <div className="panel toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th>{isAdmin && <th>Action</th>}</tr></thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employee ? leave.employee.name : leave.employeeName}</td>
                <td>{leave.type}</td>
                <td>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td><span className={'badge ' + leave.status.toLowerCase()}>{leave.status}</span></td>
                {isAdmin && <td>{leave.status === 'Pending' ? <><button onClick={() => changeStatus(leave._id, 'Approved')}>Approve</button> <button onClick={() => changeStatus(leave._id, 'Rejected')}>Reject</button></> : '-'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {leaves.length === 0 && <p>No leave requests found.</p>}
      </div>
    </section>
  );
}

export default Leaves;
