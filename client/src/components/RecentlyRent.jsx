import React, { useEffect, useState } from "react";
import RentBookCard from "./RentBookCard";

const RecentlyRent = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/recent_rent_books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);
  return (
    <div>
      <RentBookCard books={books} headline="Recently Added Books for Rent" />
    </div>
  );
};

export default RecentlyRent;
