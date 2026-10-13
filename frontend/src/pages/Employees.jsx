import { useEffect, useState } from 'react';
import { API_URL, getHeaders } from '../api';

const emptyForm = {
  employeeId: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  joiningDate: '',
  status: 'Active',
  password: ''
};

function Employees() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Load employees
  async function loadEmployees() {
    try {
      const params = new URLSearchParams({
        search,
        department,
        status,
        limit: 50
      });

      const response = await fetch(`${API_URL}/employees?${params}`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load employees');
      }

      setEmployees(data.employees || []);
    } catch (error) {
      setMessage(error.message || 'Could not load employees');
    }
  }

  // Load departments
  async function loadDepartments() {
    try {
      const response = await fetch(`${API_URL}/employees/meta/departments`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load departments');
      }

      setDepartments(data.departments || []);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Automatically load employees when filters change
  useEffect(() => {
    loadEmployees();
  }, [search, department, status]);

  // Load departments when the component opens
  useEffect(() => {
    loadDepartments();
  }, []);

  // Update form values
  function changeForm(event) {
    const name = event.target.name;
    const value = event.target.value;

    setForm({
      ...form,
      [name]: value
    });
  }

  // Prepare employee details for editing
  function startEdit(employee) {
    setEditingId(employee._id);

    setForm({
      employeeId: employee.employeeId || '',
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      joiningDate: employee.joiningDate ? employee.joiningDate.substring(0, 10) : '',
      status: employee.status || 'Active',
      password: ''
    });

    window.scrollTo(0, 0);
  }

  // Clear the form
  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  // Add or update an employee
  async function saveEmployee(event) {
    event.preventDefault();
    setMessage('');

    try {
      let url = `${API_URL}/employees`;
      let method = 'POST';

      const data = { ...form };

      if (editingId) {
        url = `${API_URL}/employees/${editingId}`;
        method = 'PUT';

        delete data.password;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not save employee');
      }

      if (editingId) {
        setMessage('Employee updated successfully');
      } else {
        setMessage('Employee created successfully');
      }

      resetForm();

      loadEmployees();
      loadDepartments();
    } catch (error) {
      setMessage(error.message || 'Could not save employee');
    }
  }

  // Delete an employee
  async function deleteEmployee(id) {
    const confirmDelete = window.confirm('Delete this employee?');

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete employee');
      }

      setMessage('Employee deleted successfully');

      loadEmployees();
    } catch (error) {
      setMessage(error.message || 'Could not delete employee');
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Employees</h2>
          <p>Create, search, update and delete employees.</p>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      {isAdmin && (
        <form className="panel form-grid" onSubmit={saveEmployee}>
          <h3>{editingId ? 'Edit Employee' : 'Add Employee'}</h3>

          <label>
            Employee ID
            <input name="employeeId" value={form.employeeId} onChange={changeForm} required />
          </label>

          <label>
            Name
            <input name="name" value={form.name} onChange={changeForm} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={changeForm} required />
          </label>

          <label>
            Phone
            <input name="phone" value={form.phone} onChange={changeForm} required />
          </label>

          <label>
            Department
            <input name="department" value={form.department} onChange={changeForm} required />
          </label>

          <label>
            Designation
            <input name="designation" value={form.designation} onChange={changeForm} required />
          </label>

          <label>
            Joining Date
            <input name="joiningDate" type="date" value={form.joiningDate} onChange={changeForm} required />
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={changeForm}>
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </label>

          {!editingId && (
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={changeForm} required />
            </label>
          )}

          <div className="form-actions">
            <button type="submit" className="primary">
              {editingId ? 'Update Employee' : 'Add Employee'}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Search and filters */}
      <div className="panel toolbar">
        <input placeholder="Search by name, ID, email or designation" value={search} onChange={(event) => setSearch(event.target.value)} />

        <select value={department} onChange={(event) => setDepartment(event.target.value)}>
          <option value="">All Departments</option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>On Leave</option>
        </select>
      </div>

      {/* Employee table */}
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>

              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>

                <td>
                  <strong>{employee.name}</strong>
                  <small>{employee.email}</small>
                </td>

                <td>{employee.department}</td>

                <td>{employee.designation}</td>

                <td>
                  <span className={'badge ' + employee.status.toLowerCase().replace(' ', '-')}>{employee.status}</span>
                </td>

                {isAdmin && (
                  <td>
                    <button type="button" onClick={() => startEdit(employee)}>
                      Edit
                    </button>{' '}
                    <button type="button" onClick={() => deleteEmployee(employee._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && <p>No employees found.</p>}
      </div>
    </section>
  );
}

export default Employees;
