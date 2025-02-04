import React, { useState } from "react";

interface LoginPageProps {
  closeModal: () => void;
  openSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ closeModal, openSignup }) => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (formValues.username === storedUsername && formValues.password === storedPassword) {
      sessionStorage.setItem("isLoggedIn", "true");
      closeModal();
      window.dispatchEvent(new Event("storage"));
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>✖</button>
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formValues.username}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <span onClick={openSignup} className="text-blue-600 cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
