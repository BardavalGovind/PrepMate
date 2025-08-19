import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {

  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const isAuthenticated = !!auth?.token;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("User successfully logged out");
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const authRoutes = [
    { to: "/ViewTextNotes", label: "BrowseNotes" },
    { to: "/ai", label: "Ask AI" },
    { to: "/searchFile", label: "Search" },
    { to: "/uploadFile", label: "Upload" },
    { to: "/Userprofile", label: "Profile" },
  ];

  return (
    <header className="flex h-[80px] bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="mx-5 flex w-full max-w-[1550px] items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-blue-600 tracking-wide">
          PrepMate
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex flex-grow gap-6 ${isAuthenticated ? 'justify-center' : 'justify-end'}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          {isAuthenticated ? (
            authRoutes.map(route => (
              <NavLink key={route.to} to={route.to}>{route.label}</NavLink>
            ))
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>

        {/* Desktop Logout Button */}
        {isAuthenticated && (
          <button
            className="hidden md:block px-6 py-3 font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 rounded-lg duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* Hamburger Menu Icon */}
        <div className="md:hidden">
          <GiHamburgerMenu
            className="text-2xl text-black cursor-pointer transition duration-300 transform hover:scale-110"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
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
                  {authRoutes.map(route => (
                    <NavLinkMobile key={route.to} to={route.to} onClick={toggleMenu}>
                      {route.label}
                    </NavLinkMobile>
                  ))}
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

// Desktop NavLink
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative px-6 py-2 font-semibold text-black hover:text-blue-500 duration-300 group"
  >
    {children}
    <span className="absolute left-1/2 bottom-[2px] h-[1px] w-0 bg-blue-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
  </Link>
);

// Mobile NavLink
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
