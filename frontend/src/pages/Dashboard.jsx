import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, getHeaders } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');

  async function loadStats() {
    try {
      const response = await axios.get(API_URL + '/dashboard/stats', {
        headers: getHeaders()
      });
      setStats(response.data.stats);
    } catch (error) {
      setMessage('Could not load dashboard');
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) {
    return <section><p>{message || 'Loading dashboard...'}</p></section>;
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your office</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Total Employees</span><strong>{stats.totalEmployees}</strong></div>
        <div className="stat-card"><span>Active</span><strong>{stats.activeEmployees}</strong></div>
        <div className="stat-card"><span>Inactive</span><strong>{stats.inactiveEmployees}</strong></div>
        <div className="stat-card"><span>On Leave</span><strong>{stats.onLeaveEmployees}</strong></div>
        <div className="stat-card"><span>Pending Leaves</span><strong>{stats.pendingLeaves}</strong></div>
        <div className="stat-card"><span>Approved Leaves</span><strong>{stats.approvedLeaves}</strong></div>
        <div className="stat-card"><span>Rejected Leaves</span><strong>{stats.rejectedLeaves}</strong></div>
      </div>

      <div className="panel">
        <h3>Employees by Department</h3>
        {stats.departmentBreakdown.length === 0 ? (
          <p>No department data available.</p>
        ) : (
          <div className="bars">
            {stats.departmentBreakdown.map((item) => (
              <div key={item.department}>
                <span>{item.department}</span>
                <b style={{ width: `${Math.max(10, item.count * 10)}%` }}></b>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
