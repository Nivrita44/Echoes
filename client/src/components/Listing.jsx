import React from "react";
import { categories } from "../../data";
import "../styles/Listing.scss";
const Listing = () => {
  return (
    <div className="category-list">
      {categories?.map((category, index) => (
        <div className="category" key={index}>
          <div className="category_icon">
            <img src={category.icon} alt={category.label} />
          </div>
          <p>{category.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Listing;
