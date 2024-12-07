import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './index.css';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to login page
      navigate('/admin-login');
      return;
    }

    // Validate the token
    try {
      const decodedToken = jwtDecode(token); // Decode the token payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp < currentTime) {
        // Token has expired, remove it and redirect to login page
        console.warn('Token expired');
        localStorage.removeItem('token');
        navigate('/admin-login');
        return;
      }
    } catch (error) {
      // Token is invalid or decoding failed, remove it and redirect to login page
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      navigate('/admin-login');
      return;
    }

    // Fetch logs if the token is valid
    axios
      .get('www.mariyammuad.me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLogs(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate('/admin-login');
      });
  }, [navigate]);

  const handleLogout = () => {
    // Remove the token from localStorage when logging out
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {isLoading ? (
        <p>Loading logs...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.userId}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No logs available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
