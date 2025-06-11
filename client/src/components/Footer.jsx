import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black to-gray-800 text-white p-16">
      <div className="flex h-full w-full flex-col gap-10 px-8 lg:px-20 lg:flex-row lg:justify-between">
        <div className="lg:w-[450px] space-y-6">
          <h2 className="relative text-2xl font-black text-white mb-3 before:absolute before:top-[30px] before:h-[3px] before:w-[50px] before:bg-blue-500">
            About Us
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Because your planning is not always perfect, you need to be able to
            study whenever, wherever. Just read your notes one last time on your
            tablet or phone while you're on the go.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="relative text-2xl font-black text-white mb-3 before:absolute before:top-[30px] before:h-[3px] before:w-[50px] before:bg-blue-500">
            Quick Links
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li>
              <Link to="/about" className="hover:text-blue-500 transition duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-blue-500 transition duration-300">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="relative text-2xl font-black text-white mb-3 before:absolute before:top-[30px] before:h-[3px] before:w-[50px] before:bg-blue-500">
            Contact Info
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-500 transition duration-300">
                +91 99999 99999
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-500 transition duration-300">
                +91 99999 99999
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-500 transition duration-300">
                prepmate@gmail.com
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;