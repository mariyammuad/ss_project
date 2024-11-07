// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userRole === 'admin' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={userRole === 'admin' ? <Dashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
