import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../Redux/slices/user-slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUserData());
    toast.success("User successfully logout");
    navigate("/");
    setIsMenuOpen(false); 
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex h-[80px] bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="mx-5 flex w-full max-w-[1550px] items-center justify-between">
        {/* Text-Based Logo */}
        <div className="text-3xl font-extrabold text-blue-600 tracking-wide focus:outline-none focus:ring-4 focus:ring-blue-500">
          PrepMate
        </div>

        {/* Center Navigation Links for Desktop */}
        <nav className={`hidden md:flex flex-grow gap-6 ${isAuthenticated ? 'justify-center' : 'justify-end'}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/notecardrender">ViewNote</NavLink>
              <NavLink to="/geminiai">Ask AI</NavLink>
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/upload">Upload</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            className="hidden md:block px-6 py-3 font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 rounded-lg duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* Hamburger Menu - Only for Small Screens */}
        <div className="md:hidden">
          <GiHamburgerMenu
            className="text-2xl text-black cursor-pointer transition duration-300 transform hover:scale-110"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Menu with Backdrop */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-md z-50">
          <div className="w-[250px] h-full bg-gradient-to-r from-blue-700 to-purple-700 text-white p-5 rounded-r-lg">
            <button
              className="text-white text-2xl absolute top-5 right-5"
              onClick={toggleMenu}
            >
              ✕
            </button>
            <nav className="flex flex-col gap-2 mt-10">
              <NavLinkMobile to="/" onClick={toggleMenu}>Home</NavLinkMobile>
              <NavLinkMobile to="/about" onClick={toggleMenu}>About</NavLinkMobile>
              {isAuthenticated ? (
                <>
                  <NavLinkMobile to="/notecardrender" onClick={toggleMenu}>ViewNote</NavLinkMobile>
                  <NavLinkMobile to="/geminiai" onClick={toggleMenu}>Ask AI</NavLinkMobile>
                  <NavLinkMobile to="/search" onClick={toggleMenu}>Search</NavLinkMobile>
                  <NavLinkMobile to="/upload" onClick={toggleMenu}>Upload</NavLinkMobile>
                  <NavLinkMobile to="/profile" onClick={toggleMenu}>Profile</NavLinkMobile>
                  <button
                    className="w-full text-left hover:bg-blue-500 p-4 rounded-lg transition duration-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLinkMobile to="/login" onClick={toggleMenu}>Login</NavLinkMobile>
                  <NavLinkMobile to="/signup" onClick={toggleMenu}>Signup</NavLinkMobile>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

// Desktop Animation
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative px-6 py-2 font-semibold text-black hover:text-blue-500 duration-300 group"
  >
    {children}
    <span className="absolute left-1/2 bottom-[2px] h-[1px] w-0 bg-blue-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
  </Link>
);

//NavLink Component for Mobile
const NavLinkMobile = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="w-full hover:bg-blue-500 p-3 rounded-lg transition duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
