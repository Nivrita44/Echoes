import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/BuyWishlist.scss";
import ListingCard from "./ListingCard";
import LoginNavbar from "./LoginNavbar";

const BuyWishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

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

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelected) => {
      if (prevSelected.includes(bookId)) {
        return prevSelected.filter((id) => id !== bookId);
      } else {
        return [...prevSelected, bookId];
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:3002/add-to-cart-from-wishlist",
        { bookIds: selectedBooks },
        { withCredentials: true }
      );
      setWishlistBooks((prevBooks) =>
        prevBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
    } catch (err) {
      console.error("Error adding books to cart:", err);
    }
  };

  return (
    <>
      <div>
        <LoginNavbar />
      </div>
      <div className="buy-wishlist">
        <h2>Your Wishlist</h2>
        <div className="wishlist-container">
          {wishlistBooks.length > 0 ? (
            wishlistBooks.map((book) => (
              <div key={book.id} className="listing-card-container">
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleSelectBook(book.id)}
                />
                <ListingCard book={book} />
              </div>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
        {selectedBooks.length > 0 && (
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </>
  );
};

export default BuyWishlist;
