import React, { useState } from "react";

interface SignupPageProps {
  closeModal: () => void;
  openLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ closeModal, openLogin }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, username, password, confirmPassword } = formValues;

    // Validate username and email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (localStorage.getItem(username) || localStorage.getItem(email)) {
      setError("Username or email already exists! Choose another.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Save user data as JSON object in localStorage
    const userData = { email, username, password };
    localStorage.setItem(email, JSON.stringify(userData));

    closeModal();
    openLogin(); // Redirect to login after successful signup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 md:w-96 flex flex-col items-center relative">
        <span className="absolute top-3 right-4 text-gray-500 text-lg cursor-pointer hover:text-gray-700" onClick={closeModal}>
          ✖
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full">
          <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
          <input type="text" name="username" placeholder="Username" value={formValues.username} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
          <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formValues.confirmPassword} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mb-3" />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
        </form>

        <p className="mt-3">
          Already have an account?{" "}
          <span onClick={openLogin} className="text-blue-600 font-semibold cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
