import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import App from "../App";
import Dashboard from "../Component/Dashboard";

// Auth protection component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>} />
        <Route path="/login" element={<App />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<h2>404: This page doesn't exist</h2>} />
      </Routes>
    </Suspense>
  );
}

export default Router;