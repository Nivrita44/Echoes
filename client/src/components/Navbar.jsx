import React, { useEffect, useState } from "react";
import { FaBarsStaggered, FaBlog } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [];

  const menuItems = [
    { link: "Home", path: "/" },
    { link: "About", path: "/about" },
    { link: "Shop", path: "/shop" },
    { link: "Login", path: "/login" },
    { link: "Sign Up", path: "/register" },
  ];

  return (
    <header className="w-full bg-transparent fixed top-0 left-0 right-0 z-50 transition-all ease-in duration-300">
      <nav
        className={`py-4 lg:px-24 px-4 ${
          isSticky ? "sticky top-0 left-0 right-0 bg-blue-300 " : ""
        }`}
      >
        <div className="flex justify-between items-center text-base gap-10">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center gap-2"
          >
            <FaBlog className="inline-block" />
            Echoes
          </Link>

          {/* nav items*/}
          <ul className="md:flex space-x-12 hidden">
            {navItems.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
              >
                {link}
              </Link>
            ))}
          </ul>

          <div className="space-x-4 flex items-center relative">
            {/* Be a host */}
            {/* <img
              src="path_to_profile_photo.jpg" // Replace with actual path to profile photo
              alt="Profile"
              className="hidden lg:block w-8 h-8 rounded-full"
            /> */}
            <button onClick={toggleMenu}>
              <FaBarsStaggered className="w-5 hover:text-blue-700" />
            </button>
            {/* Mobile Dropdown */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-blue-700 py-2 px-4 space-y-2">
                {menuItems.map(({ link, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block text-base text-white uppercase cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
