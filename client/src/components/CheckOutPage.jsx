import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.scss";
import ListingCard from "./ListingCard";

const CheckOutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBooks, totalPayment } = location.state || {};
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  if (!selectedBooks || !totalPayment) {
    navigate("/HomeAfterLogin");
  }
  console.log("Selected Books:", selectedBooks);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookIds = selectedBooks.map((book) => book.id);
      await axios.post(
        "http://localhost:3002/checkout",
        {
          email,
          phone,
          shippingAddress,
          paymentMethod,
          totalPayment,
          bookIds,
        },
        { withCredentials: true }
      );
      alert("Checkout successful");
      navigate("/");
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Mobile Number</label>
          <input
            type="phone"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address</label>
          <input
            type="text"
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div className="book-details">
          <h3>Selected Books:</h3>
          <ul>
            {selectedBooks.map((book) => (
              <li key={book.id}>
                <ListingCard book={book} />
              </li>
            ))}
          </ul>
        </div>
        <div className="total-payment">
          <h3>Total Payment: TK {totalPayment.toFixed(2)}</h3>
        </div>
        <div className="checkout-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate("/view_buy_cart")}>
            Back to Cart
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckOutPage;
