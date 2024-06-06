import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const FavoriteBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/all_books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);
  return (
    <div>
      <BookCard books={books} headline="Recently Added Books" />
    </div>
  );
};

export default FavoriteBooks;
