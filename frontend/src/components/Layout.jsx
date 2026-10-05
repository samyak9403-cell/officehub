import { Link, Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="brand">Office<span>Hub</span></h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/leaves">Leaves</Link>
          <Link to="/change-password">Change Password</Link>
        </nav>

        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Mini Office Management System</h1>
            <p>Manage employees and leave requests</p>
          </div>
          <div className="user-pill">
            {user.name || 'User'}
            <small>{user.role || ''}</small>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
