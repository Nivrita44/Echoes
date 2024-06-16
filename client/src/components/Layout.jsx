import React from "react";
import LoginNavbar from "./LoginNavbar";

const Layout = ({ children }) => {
  return (
    <div>
      <LoginNavbar />
      {children}
    </div>
  );
};

export default Layout;
