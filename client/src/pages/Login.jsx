import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = { userEmail, userPassword };
      const response = await axios.post(`${BACKEND_URL}/auth/login`, user);

      const { token, user: userData } = response.data;

       localStorage.setItem("auth", JSON.stringify({ token, user: userData }));
      
      setAuth({ token, user: userData });

      toast.success("Welcome back! Redirecting...");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (error.response?.status === 401 
          ? "Invalid email or password" 
          : "Something went wrong. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.form
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        onSubmit={loginUser}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white">
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="text-blue-100 mt-2">
            Log in to access your account
          </motion.p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {error && (
            <motion.div variants={itemVariants} className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div variants={itemVariants} className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userEmail">
              Email Address
            </label>
            <input
              type="email"
              id="userEmail"
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="userPassword">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="userPassword"
                className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                placeholder="••••••••"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex justify-center items-center"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 mr-2 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Guest Login Button */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={async () => {
              setError("");
              try {
                setLoading(true);
                const guestUser = {
                  userEmail: "email@gmail.com",
                  userPassword: "email123",
                };
                const response = await axios.post(`${BACKEND_URL}/auth/login`, guestUser);

                const { token, user: userData } = response.data;
                localStorage.setItem("token", token);
                dispatch(setUserData(userData));
                toast.success("Logged in as Guest");
                navigate("/");
              } catch (error) {
                toast.error("Guest login failed.");
              } finally {
                setLoading(false);
              }
            }}
            className="w-full mt-3 rounded-lg bg-gray-200 px-5 py-3.5 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200 shadow-md flex justify-center items-center"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Try as Guest
          </motion.button>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </motion.div>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
