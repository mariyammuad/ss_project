import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [role, setRole] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    return (
      password.length > 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert("Password must be more than 6 characters, contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

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

      if (response.status === 200 || response.status === 201) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
        alert("Registration successful! Please check your email for the verification link.");
      } else {
        alert('Unexpected response code: ' + response.status);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleLogin = async (loginRole) => {
    if (!loginUsername || !loginPassword) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: loginUsername,
        password: loginPassword,
        role: loginRole,
      });

      // Handle successful login
      console.log(response.data); // You can use this response to store the token or proceed with the logged-in user

      // Redirect to another page or show success message
      const { token } = response.data;
      localStorage.setItem('authToken', token); // Store the token in localStorage
      setRole(loginRole);
      onLogin(loginRole); // Update the state with the role
      console.log(`User ${loginUsername} logged in as ${loginRole}`);
      navigate('/dashboard'); // Navigate to the dashboard after successful login

    } catch (error) {
      console.error(error);
      alert("Invalid credentials or server error.");
    }
  };

  const handleAdminLogin = async () => {
    await handleLogin("admin");
  };

  const handleUserLogin = async () => {
    await handleLogin("user");
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setRole(null);
    setLoginUsername('');
    setLoginPassword('');
    console.log(`User logged out`);
  };

  const checkAuthorization = (requiredRole) => {
    return role === requiredRole;
  };

  return (
    <div className="auth-container">
      {role ? (
        <div className="welcome-section">
          <h2>Welcome, {loginUsername}!</h2>
          {checkAuthorization("admin") && (
            <p>You have admin access. You can manage user data and system settings.</p>
          )}
          {checkAuthorization("user") && (
            <p>You have user access. Enjoy exploring the application!</p>
          )}
          <button onClick={handleLogout} className="btn btn-danger mt-3">
            Logout
          </button>
        </div>
      ) : (
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
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="btn btn-link toggle-password"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <div className="form-group">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="btn btn-link toggle-password"
                >
                  {confirmPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit" className="btn btn-primary btn-block register-btn">Register</button>
            </form>
            {showPopup && (
              <div className="alert alert-success mt-3" role="alert">
                Registration Successful!
              </div>
            )}
          </div>

          <div className="login-section">
            <h4>Login</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button onClick={handleAdminLogin} className="btn btn-primary mt-2">Login as Admin</button>
            <button onClick={handleUserLogin} className="btn btn-secondary mt-2">Login as User</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
