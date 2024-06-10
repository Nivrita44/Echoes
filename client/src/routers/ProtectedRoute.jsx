import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useState, useEffect } from "react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3002/protected", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await Axios.post(
        "http://localhost:3002/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner if you like
  }

  return (
    <>
      {isAuthenticated ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <Outlet />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default ProtectedRoute;
