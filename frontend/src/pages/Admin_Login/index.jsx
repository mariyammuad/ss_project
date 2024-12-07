import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha"; // Import the reCAPTCHA component
import './index.css'; // Import the custom styles

const Admin_Login = ({ onLogin }) => {  // Make sure onLogin is passed as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaResponse, setRecaptchaResponse] = useState(''); 
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!recaptchaResponse) {
      setMessage('Please complete the reCAPTCHA');
      return;
    }

    try {
      const response = await axios.post('www.mariyammuad.me', {
        email,
        password,
        recaptchaResponse, // Send reCAPTCHA response to backend
      });

      setMessage(response.data.message);
      if (response.data.message === 'Admin login successful') {
        alert('Login successful');
        localStorage.setItem('token', response.data.token);  // Store token
        localStorage.setItem('role', 'admin');  // Store the role
        onLogin('admin');  // Update role in parent App component
        navigate('/Admin_dashboard');  // Navigate to Admin Dashboard
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setMessage('Login failed. Please try again.');
      alert('Login failed. Please try again.');
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaResponse(value);
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
              <div className="form-group">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
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