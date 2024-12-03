import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import './index.css'; // Import the CSS file

const Login = ({ onLogin }) => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setLoginMessage("Please enter both username and password.");
      return;
    }

    if (!recaptchaValue) {
      setLoginMessage("Please complete the reCAPTCHA.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/api/user/login', {
        username: loginUsername,
        password: loginPassword,
        recaptchaResponse: recaptchaValue,
      });

      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token); // Store the token in localStorage
        setLoginMessage("Successfully Logged In");
        onLogin(); // Update the login state in the parent component

        // Log message to confirm successful login
        console.log("Login successful, redirecting to dashboard...");

        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to dashboard route
        }, 1500); // Delay of 1.5 seconds
      } else {
        setLoginMessage("Failed to retrieve the token.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setLoginMessage(`Error: ${message}`);
      console.error("Login error:", message);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h4>User Login</h4>
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
        <div className="recaptcha-container">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </div>
        <button onClick={handleLogin} className="login-btn mt-2">Login</button>
        {loginMessage && (
          <p
            className={`mt-2 ${
              loginMessage === "Successfully Logged In" ? "success-message" : "error-message"
            }`}
          >
            {loginMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
