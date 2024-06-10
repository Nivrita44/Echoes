import Axios from "axios";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./LoginBanner.css";

const LoginBanner = () => {
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
    <div
      className="login-banner-container"
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
    >
      <div className="login-banner-inner">
        <div className="login-banner-left">
          {user && (
            <div className="login-banner-user">
              <h2>Welcome, {user.username}!</h2>
              <h1>
                Give your old books and stationery a new life - sell them with
                ease on our platform!
              </h1>
              {/* <img src={`http://localhost:3002${user.image}`} alt="Profile" /> */}
            </div>
          )}
          <div className="search-container">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search an item"
              className="py-2 px-2 rounded-s-sm outline-none"
            />
            <button className="bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBanner;
