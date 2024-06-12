import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListingCard.scss";

const ListingCard = ({ book }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + JSON.parse(book.image_url).length) %
        JSON.parse(book.image_url).length
    );
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % JSON.parse(book.image_url).length
    );
  };

  const imageUrls = JSON.parse(book.image_url); // Assuming image_url is stored as a JSON string

  return (
    <div
      className="listing-card"
      onClick={() => navigate(`/properties/${book.id}`)}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageUrls.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3002${photo}`}
                alt={`photo ${index + 1}`}
              />
              <div className="prev-button" onClick={goToPrevSlide}>
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div className="next-button" onClick={goToNextSlide}>
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3>{book.book_title}</h3>
      <p>{book.author}</p>
      <p>{book.category}</p>
      <p>
        <span>Tk : {book.price}</span>
      </p>
      <button className="favorite">
        <Favorite sx={{ color: "white" }} />
      </button>
    </div>
  );
};

export default ListingCard;
