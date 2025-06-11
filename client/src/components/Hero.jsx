import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Hero = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-orange-400 to-blue-800 shadow-xl overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse-fast"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-20 rounded-full blur-3xl bottom-[-150px] right-[-100px] animate-pulse-fast"></div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1000px] text-center text-white px-6 md:px-12 py-12 sm:py-16 animate-fadeIn-fast">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Take Control of Your Thoughts, <span className="text-white">Organize & Revise</span>
        </h1>

        <p className="text-xl font-medium mb-10 max-w-[700px] mx-auto">
          Unlock the power of seamless note-taking! Capture ideas, organize them with ease, and access them whenever you need them.  
          Stay productive, stay creative, and keep your notes just a click away—whenever inspiration strikes!
        </p>

        <div className="flex justify-center gap-6 items-center">
          {isAuthenticated ? (
            <Link
              to="/about"
              className="px-8 py-3 rounded-xl text-lg font-semibold text-blue-800 bg-white hover:bg-blue-200 transition duration-150 ease-in transform hover:scale-115 shadow-lg"
            >
              Get Started
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3 rounded-xl text-lg font-semibold text-white border-2 border-white hover:bg-blue-600 hover:border-blue-600 transition duration-150 ease-in transform hover:scale-115 shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 rounded-xl text-lg font-semibold text-white border-2 border-white hover:bg-blue-600 hover:border-blue-600 transition duration-150 ease-in transform hover:scale-115 shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
