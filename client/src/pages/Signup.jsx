import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (firstName.length > 20) {
      newErrors.firstName = "First name must be less than 20 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (lastName.length > 20) {
      newErrors.lastName = "Last name must be less than 20 characters";
    }

    if (!userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(userEmail)) {
      newErrors.userEmail = "Invalid email format";
    }

    if (!userPassword) {
      newErrors.userPassword = "Password is required";
    } else if (userPassword.length < 6) {
      newErrors.userPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userData = { firstName, lastName, userEmail, userPassword };
      const res = await axios.post(`${BACKEND_URL}/auth/signup`, userData);

      if (res.data.status === "Exists") {
        toast.warn(res.data.message);
      } else {
        toast.success("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to register. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <form
        onSubmit={registerUser}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account</h1>
          <p className="text-blue-100 mt-2">Join us and start your journey</p>
        </div>

        <div className="p-8">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <span className="text-sm text-red-500">{errors.firstName}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <span className="text-sm text-red-500">{errors.lastName}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className={inputClass}
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            {errors.userEmail && <span className="text-sm text-red-500">{errors.userEmail}</span>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            {errors.userPassword && <span className="text-sm text-red-500">{errors.userPassword}</span>}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="w-5 h-5 mr-2 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
