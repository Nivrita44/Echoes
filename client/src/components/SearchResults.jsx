import React, { useEffect, useState } from "react";
import Axios from "axios";
import ListingCard from "./ListingCard";
import { useLocation } from "react-router-dom";
import "../styles/SearchResults.scss";
import RentListingCard from "./RentListingCard";
import LoginNavbar from "./LoginNavbar";

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch books from both the sale and rent endpoints
        const [saleResponse, rentResponse] = await Promise.all([
          Axios.get(
            `http://localhost:3002/search-books?query=${encodeURIComponent(
              query
            )}`
          ),
          Axios.get(
            `http://localhost:3002/search-r-books?query=${encodeURIComponent(
              query
            )}`
          ),
        ]);

        // Add a 'type' field to indicate if the book is for sale or rent
        const saleBooks = saleResponse.data.map((book) => ({
          ...book,
          type: "sale", // Mark the book as "sale"
        }));

        const rentBooks = rentResponse.data.map((book) => ({
          ...book,
          type: "rent", // Mark the book as "rent"
        }));

        // Combine both sets of books
        const combinedBooks = [...saleBooks, ...rentBooks];
        setBooks(combinedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    if (query) {
      fetchBooks();
    }
  }, [query]);

  // Separate books into sale and rent arrays
  const saleBooks = books.filter((book) => book.type === "sale");
  const rentBooks = books.filter((book) => book.type === "rent");

  return (
    <>
      <div>
        <LoginNavbar />
      </div>
      <div className="search-results-container">
        <h2>Search Results for "{query}"</h2>

        {/* Sale Books Section */}
        {saleBooks.length > 0 && (
          <div className="sale-books-section">
            <h3>Sale</h3>
            <div className="listing-cards-container">
              {saleBooks.map((book) => (
                <ListingCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Books Section */}
        {rentBooks.length > 0 && (
          <div className="rent-books-section">
            <h3>Rent</h3>
            <div className="listing-cards-container">
              {rentBooks.map((book) => (
                <RentListingCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* If no books are found */}
        {saleBooks.length === 0 && rentBooks.length === 0 && (
          <p>No books found for your search.</p>
        )}

        {/* Inline CSS */}
        <style jsx>{`
          .search-results-container {
            padding: 60px;
          }

          .search-results-container h2 {
            text-align: center;
            font-size: 3.5em;
            font-weight: bold;
            margin-bottom: 20px;
            margin-top: 80px;
          }

          .sale-books-section,
          .rent-books-section {
            margin-top: 30px;
            margin-bottom: 20px;
          }

          .sale-books-section h3,
          .rent-books-section h3 {
            text-align: center;
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 45px;
            color: #333;
          }

          .listing-cards-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }
        `}</style>
      </div>
    </>
  );
};

export default SearchResults;
