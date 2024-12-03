import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="row w-100 h-100 align-items-center">
        {/* Text Section */}
        <div className="col-lg-6 text-section d-flex flex-column align-items-center text-center p-5">
          <h1 className="display-3 text-primary mb-4">Welcome to Secure AAA System</h1>
          <p className="lead text-dark mb-4">
            Experience next-level security with seamless access to your personalized dashboard.
          </p>
          <div className="button-group">
            <Link to="/register" className="btn btn-primary btn-lg mx-3 mb-2">
              Register
            </Link>
            <Link to="/login" className="btn btn-outline-dark btn-lg mx-3 mb-2">
              Login
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6733/6733466.png"
            alt="Security Icon"
            className="homepage-image img-fluid rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
