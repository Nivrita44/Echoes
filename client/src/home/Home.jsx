import React from "react";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Navbar from "../components/Navbar";
import FavoriteBooks from "./FavoriteBooks";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <FavoriteBooks />
      <Categories />
    </div>
  );
};

export default Home;
