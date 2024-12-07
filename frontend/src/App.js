// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/User_Login';
// import AdminLogin from './pages/Admin_Login';
// import Dashboard from './pages/User_dashboard';
// import AdminDashboard from './pages/Admin_dashboard';
// import HomePage from './pages/Home_page';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

//   // This useEffect will run once when the app is mounted and check if the user is logged in
//   useEffect(() => {
//     const savedRole = localStorage.getItem('userRole');
//     if (savedRole) {
//       setUserRole(savedRole); // Set user role if it's found in localStorage
//     }
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   const handleLogin = (role) => {
//     setUserRole(role);
//     localStorage.setItem('userRole', role);
//   };

//   const handleLogout = () => {
//     setUserRole(null);
//     localStorage.removeItem('userRole');
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Home Page */}
//         <Route path="/" element={<HomePage />} />

//         {/* Register */}
//         <Route
//           path="/register"
//           element={
//             userRole === 'admin' ? <Navigate to="/admin-dashboard" replace /> : <Register onLogin={handleLogin} />
//           }
//         />

//         {/* User Login */}
//         <Route
//           path="/login"
//           element={
//             userRole === 'user' ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
//           }
//         />

//         {/* Admin Login */}
//         <Route
//           path="/admin-login"
//           element={
//             userRole === 'admin' ? <Navigate to="/admin-dashboard" replace /> : <AdminLogin onLogin={handleLogin} />
//           }
//         />

//         {/* User Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             userRole === 'user' ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
//           }
//         />

//         {/* Admin Dashboard */}
//         <Route
//           path="/admin-dashboard"
//           element={
//             userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/admin-login" />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


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
    console.log("User role set to:", role); // Debugging log
    setUserRole(role);  // Set the role (admin or user) after successful login
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

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

        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />

        <Route
          path="/User_dashboard"
          element={userRole === 'user' ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/Admin_dashboard"
          element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
