// Admin_Login.js (Frontend)
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './index.css'; // Import the custom styles

const Admin_Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5002/api/admin/login', { email, password });
      setMessage(response.data.message);
      if (response.data.message === 'Admin login successful') {
        alert('Login successful');
        localStorage.setItem('token', response.data.token);
        navigate('/admin_dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setMessage('Login failed. Please try again.');
      alert('Login failed. Please try again.');
    }
  };
  

  return (
    <div className="admin-background-image">
      <div className="admin-login-container">
        <form className="form-signin text-center" onSubmit={handleLogin}>
          <div className="login-form">
            <h2 className="admin-form-heading">Admin Login</h2>
            <div className="mb-4">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="admin-form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="admin-form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="admin-btn-outline-light btn-lg btn-block" type="submit">
              Log in
            </button>
            <br />
            {message && <p className="admin-message">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin_Login;
