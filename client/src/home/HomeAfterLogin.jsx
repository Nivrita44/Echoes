import React from "react";
import Categories from "../components/Categories";
import LoginBanner from "../components/LoginBanner";
import LoginNavbar from "../components/LoginNavbar";
import FavoriteBooks from "./FavoriteBooks";

const HomeAfterLogin = () => {
  return (
    <div>
      <LoginNavbar />
      <LoginBanner />
      <FavoriteBooks />
      <Categories />
    </div>
  );
};

export default HomeAfterLogin;
