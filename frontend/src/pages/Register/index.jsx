import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [recaptchaResponse, setRecaptchaResponse] = useState(null);

  const navigate = useNavigate();

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

    if (!recaptchaResponse) {
      alert("Please complete the reCAPTCHA challenge.");
      return;
    }

    try {
      // const response = await axios.post('http://localhost:5004/api/register', {
        username,
        email,
        password,
        recaptchaResponse,
      });

      if (response.status === 200 || response.status === 201) {
        setShowPopup(true);

        setTimeout(() =>{ 
        setShowPopup(false);
        navigate('/login');
      }, 7000); //7 seconds delay
      
        alert("Registration successful! Please check your email for the verification link.");

        // Clear form fields after successful registration
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRecaptchaResponse(null);

        // Don't navigate to login page until email is verified
      } else {
        alert('Unexpected response code: ' + response.status);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMessage);  // Show the error message from the server
    }
  };

  // Validation functions
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const onRecaptchaChange = (value) => {
    setRecaptchaResponse(value);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center">Register</h2>
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

          <div className="form-group">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={onRecaptchaChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block register-btn">Register</button>
        </form>
        {showPopup && (
          <div className="alert alert-success mt-3" role="alert">
            Registration Successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;