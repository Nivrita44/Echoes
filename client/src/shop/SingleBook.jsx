import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleBook.css"; // Import CSS file for styling

function SingleBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/book-sell/${id}`
        );
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading book: {error.message}</div>;

  return (
    <div className="single-book-container">
      {book && (
        <>
          <div className="book-details">
            {book.image_url &&
              JSON.parse(book.image_url).map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3002${image}`}
                  alt={book.book_title}
                  className="book-image"
                />
              ))}
            <div className="book-info">
              <h1>{book.book_title}</h1>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Published Date:</strong> {book.published_date}
              </p>
              <p>
                <strong>Description:</strong> {book.description}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>Price:</strong> {book.price}
              </p>
              <div className="buttons">
                <button className="buy-button">Buy</button>
                <button className="rent-button">Rent</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleBook;
