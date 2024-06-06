import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const loginUser = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3002/login", {
      LoginEmail: loginEmail,
      LoginPassword: loginPassword,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="imgDiv">
          <div className="textDiv">
            <h2 className="title">Buy and Sell Your Books and Stationaries</h2>
          </div>

          <div className="footerDiv flex">
            <span className="text">Don't have an account?</span>
            <Link to={"/register"}>
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <h3>Welcome Back!</h3>
          </div>

          <form className="form grid" onSubmit={loginUser}>
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email address"
                  onChange={(event) => {
                    setLoginEmail(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  onChange={(event) => {
                    setLoginPassword(event.target.value);
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Login</span>
            </button>
            <span className="forgotPassword">
              Forgot your password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
