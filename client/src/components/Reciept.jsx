import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/Reciept.scss";

const Reciept = ({ recieptData }) => {
  const {
    name,
    email,
    phone,
    shippingAddress,
    paymentMethod,
    totalPayment,
    selectedBooks,
  } = recieptData;

  const [booksWithTitles, setBooksWithTitles] = useState([]);

  useEffect(() => {
    const fetchBookTitles = async () => {
      try {
        const bookIds = selectedBooks.map((book) => book.id);
        const responses = await Promise.all(
          bookIds.map((id) =>
            axios.get(`http://localhost:3002/book-sell/${id}`)
          )
        );
        const booksWithTitles = responses.map((response) => response.data);
        setBooksWithTitles(booksWithTitles);
      } catch (error) {
        console.error("Error fetching book titles:", error);
      }
    };

    fetchBookTitles();
  }, [selectedBooks]);

  return (
    <div className="receipt-container">
      <h2>Receipt</h2>
      <div className="receipt-details">
        <h3>Order Details:</h3>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Mobile Number:</strong> {phone}
        </p>
        <p>
          <strong>Shipping Address:</strong> {shippingAddress}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <h3>Selected Books:</h3>
        <ul>
          {booksWithTitles.map((book, index) => (
            <li key={index}>
              <div>
                <strong>Title:</strong> {book.book_title}
              </div>
              <div>
                <strong>Price:</strong> TK{" "}
                {(Number(selectedBooks[index].price) || 0).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <div className="total-payment">
          <h3>Total Payment: TK {(Number(totalPayment) || 0).toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default Reciept;
