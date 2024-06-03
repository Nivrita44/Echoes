import React from "react";
import Banner from "../components/Banner";
import FavoriteBooks from "./FavoriteBooks";
import Categories from "../components/Categories";
// import Catagories from "../components/Catagories";
const Home = () => {
  return (
    <div>
      <Banner />
      <FavoriteBooks />
      {/* <Catagories /> */}
      <Categories />
    </div>
  );
};

export default Home;
