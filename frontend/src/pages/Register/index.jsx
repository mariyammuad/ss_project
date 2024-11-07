import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
      });

      // Log the response for debugging
      console.log(response);

      // Check if registration was successful (status code 200 or 201)
      if (response.status === 200 || response.status === 201) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      } else {
        alert('Unexpected response code: ' + response.status);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleAdminLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert("Please enter both username and password.");
      return;
    }
    await handleLogin("admin");
  };

  const handleUserLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert("Please enter both username and password.");
      return;
    }
    await handleLogin("user");
  };

  const handleLogin = async (role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: loginUsername,
        password: loginPassword,
        role,
      });

      if (response.status === 200) {
        onLogin(role);
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center">Secure AAA System</h2>

        <div className="auth-section">
          <h4>Register</h4>
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block register-btn">Register</button>
          </form>
          {showPopup && (
            <div className="alert alert-success mt-3" role="alert">
              Successfully Registered!
            </div>
          )}
        </div>

        <div className="auth-section">
          <h4>Login</h4>
          <form>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </form>
          <div className="d-flex mt-3">
            <button onClick={handleAdminLogin} className="btn btn-primary flex-grow-1 mr-2">
              Log in as Admin
            </button>
            <button onClick={handleUserLogin} className="btn btn-primary flex-grow-1">
              Log in as User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
