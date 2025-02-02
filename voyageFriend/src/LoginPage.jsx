import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Popup.css";

const LoginPage = ({ closeModal, openSignup }) => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (formValues.username === storedUsername && formValues.password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true");
      closeModal();
      window.location.reload(); 
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <motion.div className="popup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="popup">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <span className="close-icon" onClick={closeModal}>✖</span>
          <input type="text" name="username" placeholder="Username" value={formValues.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleChange} />
          <button type="submit" className="up-btn">Login</button>
        </form>
        <p>Don't have an account? <span onClick={openSignup}>Sign Up</span></p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
