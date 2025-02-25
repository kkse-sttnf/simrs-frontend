import React from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import SecureImage from "../assets/images/Secure-login.png";

const LoginForm = () => {
  return (
    <div className="wrapper">
      <div className="wrapper-image">
        <h1>Akses informasi dan layanan kesehatan dengan lebih mudah!</h1>
        <img src={SecureImage} alt="Secure Login" /> 
      </div>
      <div className="wrapper-form">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <label htmlFor="Username">Username</label>
            <input type="text" id="Username" placeholder="Masukan Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <label htmlFor="Password">Password</label>
            <input type="password" id="Password" placeholder="Masukan Password" required />
            <FaLock className="icon" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
