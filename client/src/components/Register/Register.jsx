import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  // const navigate = useNavigate();

  const createUser = () => {
    Axios.post("http://localhost:3002/register", {
      Email: email,
      RegNo: regNo,
      UserName: username,
      Password: password,
      ProfileImage: profileImage,
    }).then(() => {
      console.log("User has been registered");
      // navigate("/login");
    });
  };

  return (
    <div className="registerPage flex">
      <div className="container flex">
        <div className="imgDiv">
          <div className="textDiv">
            <h2 className="title">Buy and Sell Your Books and Stationaries</h2>
          </div>

          <div className="footerDiv flex">
            <span className="text">Have an account?</span>
            <Link to={"/login"}>
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <form action="" className="form grid">
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email address"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="regNo">Registration No</label>
              <div className="input flex">
                <input
                  type="regNo"
                  id="regNo"
                  placeholder="Enter Registration No"
                  onChange={(event) => {
                    setRegNo(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Username"
                  onChange={(event) => {
                    setUserName(event.target.value);
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
                    setPassword(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="profileImage">Upload Your Image</label>
              <div className="input flex">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  placeholder="Upload Your Photo"
                  onChange={(event) => {
                    setProfileImage(event.target.value);
                  }}
                  // onChange={(event) => {
                  //   setProfileImage(event.target.files[0]);
                  // }}
                />
              </div>
            </div>
            <button type="submit" className="btn flex" onClick={createUser}>
              <span>Register</span>
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

export default Register;
