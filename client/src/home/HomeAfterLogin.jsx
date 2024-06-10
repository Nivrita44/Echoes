import React from "react";
import LoginBanner from "../components/LoginBanner";
import LoginNavbar from "../components/LoginNavbar";

const HomeAfterLogin = () => {
  return (
    <div>
      <LoginNavbar />
      <LoginBanner />
    </div>
  );
};

export default HomeAfterLogin;
