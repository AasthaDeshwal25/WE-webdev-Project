import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Popup.css";

const SignupPage = ({ closeModal, openLogin }) => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValues.username && formValues.password) {
      localStorage.setItem("username", formValues.username);
      localStorage.setItem("password", formValues.password);
      alert("Signup successful! Please login.");
      openLogin();
    }
  };

  return (
    <motion.div className="popup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="popup">
        <h2>Sign Up</h2>
        <span className="close-icon" onClick={closeModal}>✖</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formValues.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleChange} />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <span onClick={openLogin}>Login</span></p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
