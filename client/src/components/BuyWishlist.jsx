import React, { useState, useEffect } from "react";
import axios from "axios";
import ListingCard from "./ListingCard";
import "../styles/BuyWishlist.scss";

const BuyWishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/sell_wishlist",
          { withCredentials: true }
        );
        setWishlistBooks(response.data);
      } catch (err) {
        console.error("Error fetching wishlist books:", err);
      }
    };

    fetchWishlistBooks();
  }, []);

  return (
    <div className="buy-wishlist">
      <h2>Your Wishlist</h2>
      <div className="wishlist-container">
        {wishlistBooks.length > 0 ? (
          wishlistBooks.map((book) => <ListingCard key={book.id} book={book} />)
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default BuyWishlist;
