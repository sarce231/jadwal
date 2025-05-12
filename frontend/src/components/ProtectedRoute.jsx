// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (role === 'user' && user.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  if (role === 'all' && (user.role === 'admin' || user.role === 'user')) {
    return children; // izinkan dua-duanya
  }

  // Jika role tidak cocok dan bukan "all"
  if (role !== 'all' && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


// // src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, role }) => {
//   const { user } = useAuth(); // Ambil informasi user dari context

//   if (!user || user.role !== role) {
//     return <Navigate to="/login" replace />; // Arahkan ke login jika tidak terotorisasi
//   }

//   return children; // Jika user sesuai role, tampilkan halaman
// };

// export default ProtectedRoute;
