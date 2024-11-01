import React from "react";
import BannerCard from "../home/BannerCard";

const Banner = () => {
  const divStyle = {
    width: "100%",
    height: "730px", // Adjust the height as needed
    backgroundImage:
      "url(https://t3.ftcdn.net/jpg/03/48/29/16/360_F_348291651_3CXlnV4Fd3JnyWQ3GwkPrxMVrHUqq58j.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "all 0.5s ease-in-out",
    paddingTop: "4rem", // Adjust if needed to ensure space for the navbar
  };
  return (
    <div
      className="px-4 lg:px-24 bg-teal-100 flex items-center"
      style={divStyle}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
    >
      <div className="flex w-full flex-col md:flex-row justify-between item-center gap-12 py-40">
        <div className="md:w-1/2 space-y-8 h-full">
          <h2 className="text-5xl font-bold leading-snug text-black">
            Buy,Sell and Rent Your books
          </h2>
          <p className="md:w-4/5">
            Welcome to Echoes! Your one-stop shop for affordable, gently-used
            books and quality stationery, exclusively for university students.
            Find everything you need for your studies at unbeatable prices. Shop
            now and save big on essential supplies!
          </p>
          {/* <div>
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search an item"
              className="py-2 px-2 rounded-s-sm outline-none"
            /> */}
          {/* <button className="bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200">
              Search
            </button> */}
        </div>
      </div>
      <div>
        <BannerCard></BannerCard>
      </div>
    </div>
  );
};

export default Banner;
