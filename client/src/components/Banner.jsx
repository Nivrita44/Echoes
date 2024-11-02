import React from "react";
import BannerCard from "../home/BannerCard";

const Banner = () => {
  const divStyle = {
    width: "100%",
    height: "730px", // Adjust the height as needed
    backgroundImage:
      "url(https://img.freepik.com/premium-photo/bookshelf-with-various-books-some-top_921860-44479.jpg)",
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
      <div className="flex w-full flex-col md:flex-row justify-between item-center gap-12 py-0 md:py-20 -mt-32">
        <div className="md:w-1/2 space-y-8 h-full">
          <h2 className="text-5xl font-bold leading-snug text-black">
            Buy, Sell and Rent Your books
          </h2>
          <p className="text-lg md:w-6/5">
            Welcome to Echoes! Your one-stop shop for affordable, gently-used
            books and quality stationery, exclusively for university students.
            Find everything you need for your studies at unbeatable prices. Shop
            now and save big on essential supplies!
          </p>
        </div>
      </div>
      <div>
        <BannerCard />
      </div>
    </div>
  );
};

export default Banner;
