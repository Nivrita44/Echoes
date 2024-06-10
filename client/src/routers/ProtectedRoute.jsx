import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3002/protected", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
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
          <Outlet context={{ user }} />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default ProtectedRoute;
