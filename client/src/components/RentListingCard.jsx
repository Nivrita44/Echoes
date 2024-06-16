import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
} from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListingCard.scss";

const RentListingCard = ({ book }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null); // New state for total price
  const [rentDays, setRentDays] = useState(null); // New state for rent days
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3002/rent-wishlist", { withCredentials: true })
      .then((response) => {
        const wishlist = response.data;
        setIsFavorite(wishlist.includes(book.id));
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });

    axios
      .get(`http://localhost:3002/rent-cart/total-price/${book.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTotalPrice(response.data.total_price); // Assuming the response structure
        setRentDays(response.data.rent_days); // Fetch rent_days from backend
      })
      .catch((error) => {
        console.error("Error fetching total price:", error);
      });
  }, [book.id]);

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

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    axios
      .post(
        "http://localhost:3002/add-to-rent-wishlist",
        { book_id: book.id },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error adding/removing book from wishlist:", error);
      });
  };

  const imageUrls = JSON.parse(book.image_url);

  return (
    <div
      className="listing-card"
      onClick={() => navigate(`/book-rent/${book.id}`)}
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
        <span>Price (per day): Tk {book.price}</span>
      </p>
      <p>
        <span>Total Price: Tk {book.total_price}</span>
      </p>

      <p>
        <span>Rent Days: {book.rent_days}</span>
      </p>

      <button
        className={`favorite ${isFavorite ? "active" : ""}`}
        onClick={handleFavoriteClick}
      >
        <Favorite sx={{ fontSize: "20px" }} />
      </button>
    </div>
  );
};

export default RentListingCard;
