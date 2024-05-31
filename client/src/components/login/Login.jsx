import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
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

          <form action="" className="form grid">
            <span className="showMessage">Login Status will go here</span>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <input type="text" id="username" placeholder="Enter Username" />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
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
