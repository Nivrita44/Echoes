import React, { useEffect, useState } from "react";
import Axios from "axios";
import ListingCard from "./ListingCard";
import { useLocation } from "react-router-dom";
import "../styles/SearchResults.scss";

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:3002/search-books?query=${encodeURIComponent(
            query
          )}`
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    if (query) {
      fetchBooks();
    }
  }, [query]);

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      <div className="listing-cards-container">
        {books.map((book) => (
          <ListingCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
