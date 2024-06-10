import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Axios from "axios";

const Dashboard = () => {
  const { user } = useOutletContext();
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
      {user && (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <img src={`http://localhost:3002${user.image}`} alt="Profile" />
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
