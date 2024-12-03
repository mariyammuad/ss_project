import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';  // Import custom CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // If no token, redirect to login page
      navigate('/login');
    } else {
      // Fetch logs from the server
      axios.get('http://localhost:5002/api/user/logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => setLogs(response.data))
      .catch(err => {
        console.error(err);
        navigate('/login'); // Redirect to login if token is invalid or error occurs
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="dashboard container mt-5">
      <div className="header d-flex justify-content-between align-items-center">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      
      <h2 className="mt-4">User Action Logs</h2>
      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
