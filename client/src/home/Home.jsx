import React from "react";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import FavoriteBooks from "./FavoriteBooks";
const Home = () => {
  return (
    <div>
      <Banner />
      <FavoriteBooks />
      <Categories />
    </div>
  );
};

export default Home;
