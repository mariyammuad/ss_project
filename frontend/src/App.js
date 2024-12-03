import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/User_Login';
import AdminLogin from './pages/Admin_Login';
import Dashboard from './pages/User_dashboard';
import AdminDashboard from './pages/Admin_dashboard';
import HomePage from './pages/Home_page';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };
  
  

  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* User Register */}
        <Route
          path="/register"
          element={
            userRole === 'admin' ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Register onLogin={handleLogin} />
            )
          }
        />

        {/* User Login */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={userRole === 'user' ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
