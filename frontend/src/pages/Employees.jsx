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

  async function loadEmployees() {
    try {
      const response = await axios.get(API_URL + '/employees', {
        headers: getHeaders(),
        params: { search, department, status, limit: 50 }
      });
      setEmployees(response.data.employees);
    } catch (error) {
      setMessage('Could not load employees');
    }
  }

  async function loadDepartments() {
    try {
      const response = await axios.get(API_URL + '/employees/meta/departments', { headers: getHeaders() });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log('Could not load departments');
    }
  }

  useEffect(() => {
    loadEmployees();
  }, [search, department, status]);

  useEffect(() => {
    loadDepartments();
  }, []);

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(employee) {
    setEditingId(employee._id);
    setForm({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      joiningDate: employee.joiningDate.substring(0, 10),
      status: employee.status,
      password: ''
    });
    window.scrollTo(0, 0);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        const data = { ...form };
        delete data.password;
        await axios.put(API_URL + '/employees/' + editingId, data, { headers: getHeaders() });
        setMessage('Employee updated successfully');
      } else {
        await axios.post(API_URL + '/employees', form, { headers: getHeaders() });
        setMessage('Employee created successfully');
      }

      resetForm();
      loadEmployees();
      loadDepartments();
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Could not save employee');
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Delete this employee?')) return;

    try {
      await axios.delete(API_URL + '/employees/' + id, { headers: getHeaders() });
      setMessage('Employee deleted successfully');
      loadEmployees();
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Could not delete employee');
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
            <input name="email" value={form.email} onChange={changeForm} type="email" required />
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
            <input name="joiningDate" value={form.joiningDate} onChange={changeForm} type="date" required />
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
              <input name="password" value={form.password} onChange={changeForm} type="password" required />
            </label>
          )}

          <div className="form-actions">
            <button className="primary">{editingId ? 'Update Employee' : 'Add Employee'}</button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="panel toolbar">
        <input placeholder="Search by name, ID, email or designation" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>On Leave</option>
        </select>
      </div>

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
                    <button onClick={() => startEdit(employee)}>Edit</button>{' '}
                    <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
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
