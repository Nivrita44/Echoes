import React from "react";
import Categories from "../components/Categories";
import Listing from "../components/Listing";
import LoginBanner from "../components/LoginBanner";
import LoginNavbar from "../components/LoginNavbar";
const HomeAfterLogin = () => {
  return (
    <div>
      <LoginNavbar />
      <LoginBanner />
      {/* <FavoriteBooks /> */}
      <Categories />
      <Listing />
    </div>
  );
};

export default HomeAfterLogin;
