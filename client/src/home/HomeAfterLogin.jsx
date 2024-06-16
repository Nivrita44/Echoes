import React from "react";
import Categories from "../components/Categories";
import Listing from "../components/Listing";
import LoginBanner from "../components/LoginBanner";
import LoginNavbar from "../components/LoginNavbar";
import FavoriteBooks from "./FavoriteBooks";
import RecentlyRent from "../components/RecentlyRent";
import RentListing from "../components/RentListing";
const HomeAfterLogin = () => {
  return (
    <div>
      <LoginNavbar />
      <LoginBanner />
      <RecentlyRent />
      <FavoriteBooks />
      <Categories />
      <Listing />
      <RentListing />
    </div>
  );
};

export default HomeAfterLogin;
