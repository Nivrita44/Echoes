import React from "react";
import Categories from "../components/Categories";
import Layout from "../components/Layout";
import Listing from "../components/Listing";
import LoginBanner from "../components/LoginBanner";
import LoginNavbar from "../components/LoginNavbar";
import RecentlyRent from "../components/RecentlyRent";
import RentListing from "../components/RentListing";
import FavoriteBooks from "./FavoriteBooks";
const HomeAfterLogin = () => {
  return (
    <div>
      <Layout>
        <LoginNavbar />
        <LoginBanner />
        <RecentlyRent />
        <FavoriteBooks />
        <Categories />
        <Listing />
        <RentListing />
      </Layout>
    </div>
  );
};

export default HomeAfterLogin;
