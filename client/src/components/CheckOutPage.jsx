import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.scss";
import ListingCard from "./ListingCard";
import LoginNavbar from "./LoginNavbar";
import Reciept from "./Reciept";

const CheckOutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBooks, totalPayment } = location.state || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [showReciept, setShowReciept] = useState(false);
  if (!selectedBooks || !totalPayment) {
    navigate("/HomeAfterLogin");
    return null;
  }
  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    const bookIds = selectedBooks.map((book) => book.id);

    if (paymentMethod === "Cash on Delivery") {
      try {
        await axios.post("http://localhost:3002/sslcommerz/init", {
          name,
          address,
          amount: totalPayment,
          currency: "BDT",
          bookIds,
          status: "pending",
        });
        setShowReciept(true);
      } catch (error) {
        setMessage("Error placing order: " + error.message);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3002/sslcommerz/init",
          {
            name,
            address,
            amount: totalPayment,
            currency: "BDT",
            bookIds,
          }
        );

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          setMessage("Failed to initiate payment.");
        }
      } catch (error) {
        setMessage("Error initiating payment: " + error.message);
      }
    }
  };
  if (showReciept) {
    return (
      <>
        <div>
          <LoginNavbar />
        </div>
        <Reciept
          recieptData={{
            name,
            email,
            phone,
            address,
            paymentMethod,
            totalPayment,
            selectedBooks,
          }}
        />
      </>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <label htmlFor="address">Shipping Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
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
        <div className="amount">
          <h3>Total Payment: TK {(Number(totalPayment) || 0).toFixed(2)}</h3>
        </div>
        <div className="checkout-actions">
          <button type="submit">
            {paymentMethod === "Cash on Delivery" ? "Place Order" : "Pay Now"}
          </button>
          <button type="button" onClick={() => navigate("/view_buy_cart")}>
            Back to Cart
          </button>
        </div>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default CheckOutPage;
