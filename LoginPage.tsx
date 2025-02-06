import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  closeModal: () => void;
  openSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ closeModal, openSignup }) => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem(formValues.email);

    if (!storedUserData) {
      setError("No account found with this email.");
      return;
    }

    const userData = JSON.parse(storedUserData);
    if (userData.password !== formValues.password) {
      setError("Incorrect password.");
      return;
    }

    sessionStorage.setItem("isLoggedIn", "true");
    closeModal();
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 md:w-96 flex flex-col items-center relative">
        <button className="absolute top-3 right-4 text-gray-500 text-lg hover:text-gray-700" onClick={closeModal} aria-label="Close Login Modal">
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full">
          <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mb-3" />

          <div className="relative w-full mb-3">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formValues.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700" aria-label="Toggle Password Visibility">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Login</button>
        </form>

        <p className="mt-3">
          Don't have an account?{" "}
          <span onClick={openSignup} className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
