import React, { useEffect, useState } from "react";
import { categories } from "../../data";
import "../styles/Listing.scss";
import ListingCard from "./ListingCard";

const Listing = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3002/all_books");
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); // Initially show all books
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory && selectedCategory.label === category.label) {
      // Deselect category and show all books
      setSelectedCategory(null);
      setFilteredBooks(books);
    } else {
      // Select category and filter books
      setSelectedCategory(category);
      const filtered = books.filter((book) => book.category === category.label);
      setFilteredBooks(filtered);
    }
  };

  return (
    <div className="listing-container">
      <h1 className="listing-heading">Books for sale</h1>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${
              selectedCategory?.label === category.label ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category_icon">
              <img src={category.icon} alt={category.label} />
            </div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>
      <div className="listings">
        {/* Use Link component to wrap around each ListingCard */}
        {/* Check if there are no books and display a message */}
        {filteredBooks.length === 0 ? (
          <p>Sorry, No book is available in this category.</p> // Message when no books are found
        ) : (
          filteredBooks.map((book) => <ListingCard book={book} />)
        )}
      </div>
    </div>
  );
};

export default Listing;
