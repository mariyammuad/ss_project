// src/pages/Dashboard/index.jsx
import React from 'react';
import './index.css';

const Dashboard = () => {
  // Sample data to represent user actions
  const userActions = [
    { user: 'User1', action: 'Logged in', date: '2024-11-01 10:30 AM' },
    { user: 'User2', action: 'Uploaded file', date: '2024-11-01 11:00 AM' },
    { user: 'User3', action: 'Logged out', date: '2024-11-01 11:30 AM' },
    { user: 'User4', action: 'Edited profile', date: '2024-11-01 12:00 PM' },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-content">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {userActions.map((action, index) => (
              <tr key={index}>
                <td>{action.user}</td>
                <td>{action.action}</td>
                <td>{action.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
