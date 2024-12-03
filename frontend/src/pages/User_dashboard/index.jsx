import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage to log out
    localStorage.removeItem('authToken');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container" style={styles.container}>
      <div className="dashboard-card" style={styles.card}>
        <h1 style={styles.heading}>Welcome User!</h1>
        <h2 style={styles.heading}>User Dashboard</h2>
        <p style={styles.paragraph}>Welcome to your dashboard.</p>
        
        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#d5b3f7',  // Background color for the body
  },
  card: {
    padding: '70px',  // Increased padding
    backgroundColor: '#f6eaff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '700px',  // Increased width
    minHeight: '400px',  // Increased height
    boxSizing: 'border-box',
  },
  heading: {
    marginBottom: '20px',  // Space between heading elements
  },
  paragraph: {
    marginBottom: '20px',  // Space between paragraph and other elements
  },
  logoutButton: {
    backgroundColor: '#6c34a0',
    border: 'none',
    width: '50%',
    fontWeight: 'bold',
    color: '#fff',
    padding: '10px',  /* Decreased padding */
    fontSize: '18px',  /* Smaller font size */
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease', // Add smooth transition for hover effect
    marginTop: '50px',
  },
  // Adding hover effect directly in JS for styles
  logoutButtonHover: {
    backgroundColor: '#5a2c86',
  }
};

export default Dashboard;  