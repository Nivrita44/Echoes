import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingCard from "./ListingCard";
import RentListingCard from "./RentListingCard";
import LoginNavbar from "./LoginNavbar";

const CategoryPage = () => {
  const { categoryLabel } = useParams();
  const [sellBooks, setSellBooks] = useState([]);
  const [rentBooks, setRentBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [categoryLabel]);

  const fetchBooks = async () => {
    try {
      const saleResponse = await fetch("http://localhost:3002/all_books");
      const saleData = await saleResponse.json();

      const rentResponse = await fetch("http://localhost:3002/all_rent_books");
      const rentData = await rentResponse.json();

      const filteredSellBooks = saleData.filter((book) =>
        book.category
          .split(",")
          .map((cat) => cat.trim())
          .includes(categoryLabel)
      );
      setSellBooks(filteredSellBooks);

      const filteredRentBooks = rentData.filter((book) =>
        book.category
          .split(",")
          .map((cat) => cat.trim())
          .includes(categoryLabel)
      );
      setRentBooks(filteredRentBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Inline styles for headings
  const mainHeadingStyle = {
    textAlign: "center",
    fontSize: "4em",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const sectionHeadingStyle = {
    textAlign: "center",
    fontSize: "1.8em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  };

  return (
    <>
      <div style={{ marginTop: "50px" }}>
        <LoginNavbar />
      </div>
      <div className="category-page-container">
        <h1 style={mainHeadingStyle}>Books in {categoryLabel}</h1>

        {/* Section for Books for Sale */}
        {sellBooks.length > 0 && (
          <div className="sell-books-section">
            <h2 style={sectionHeadingStyle}>Sale</h2>
            <div className="listings">
              {sellBooks.map((book, index) => (
                <ListingCard key={`sell-${index}`} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Section for Books for Rent */}
        {rentBooks.length > 0 && (
          <div className="rent-books-section">
            <h2 style={sectionHeadingStyle}>Rent</h2>
            <div className="listings">
              {rentBooks.map((book, index) => (
                <RentListingCard key={`rent-${index}`} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Message when no books are available in the category */}
        {sellBooks.length === 0 && rentBooks.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            Sorry, no books are available in this category.
          </p>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
