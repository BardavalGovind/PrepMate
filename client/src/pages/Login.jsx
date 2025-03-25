import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../Redux/slices/user-slice";
import { useNavigate, Link } from "react-router-dom"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const user = { userEmail, userPassword };

      const response = await axios.post("https://prepmate-nb0h.onrender.com/auth/login", user);

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      dispatch(setUserData(userData));

      toast.success("User login successfully!");
      navigate("/");

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized. Invalid credentials.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 to-blue-400">
      <form 
        className="flex w-full max-w-[500px] flex-col gap-8 p-8 rounded-xl shadow-2xl border border-gray-200 backdrop-blur-md"
        onSubmit={loginUser}
      >
        <h1 className="text-4xl font-extrabold text-black text-center mb-6">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-6">

          <div className="flex flex-col">
            <label className="font-medium text-black mb-2" htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              className="w-full rounded-lg border border-black p-4 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-black mb-2" htmlFor="userPassword">Password</label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              className="w-full rounded-lg border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="*********"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-105 shadow-md"
        >
          Login
        </button>

        <div className="flex items-center justify-center text-sm text-black mt-4">
          <p>New to FindMyNotes?</p>
          <Link to="/signup" className="ml-2 font-semibold text-blue-900 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
