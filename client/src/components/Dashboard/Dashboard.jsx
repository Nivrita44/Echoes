import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Axios.post(
        "http://localhost:3002/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login"); // Navigate to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
