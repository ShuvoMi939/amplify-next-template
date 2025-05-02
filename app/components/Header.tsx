"use client";

import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const dashboardLinks = [
  "profile",
  "settings",
  "feed",
  "courses",
  "posts",
  "support",
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSearch = () => setSearchOpen(!isSearchOpen);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    if (isSearchOpen) setSearchOpen(false);
  };
  const handleNavClick = () => {
    setMenuOpen(false);
    setSubMenuOpen(false);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-blue-600 text-2xl font-bold">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
          <span>Nirdeshona</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-blue-600 text-lg">
              {label}
            </Link>
          ))}

          {/* Dashboard Dropdown */}
          <div className="relative group">
            <button className="hover:text-blue-600 text-lg">Dashboard</button>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded p-2 z-10 space-y-1">
              {dashboardLinks.map((item) => (
                <Link
                  key={item}
                  href={`/dashboard/${item}`}
                  className="block hover:text-blue-600 text-sm capitalize"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-1.5 pl-4 pr-8 rounded-full border border-gray-300 text-base"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>

          {/* Login */}
          <Link href="/login" className="text-blue-600 text-lg">
            <FaUser />
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleSearch}>
            <FaSearch className="text-xl text-gray-700" />
          </button>
          <Link href="/login">
            <FaUser className="text-xl text-gray-700" />
          </Link>
          <button onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="absolute w-full bg-white shadow-sm border-t z-40">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute w-full bg-white shadow-sm border-t z-40">
          <div className="px-5 py-4 space-y-2 text-sm">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className="block hover:text-blue-600"
              >
                {label}
              </Link>
            ))}
            <div>
              <button
                onClick={() => setSubMenuOpen(!isSubMenuOpen)}
                className="w-full text-left hover:text-blue-600"
              >
                Dashboard
              </button>
              {isSubMenuOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {dashboardLinks.map((item) => (
                    <Link
                      key={item}
                      href={`/dashboard/${item}`}
                      onClick={handleNavClick}
                      className="block hover:text-blue-600 capitalize"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
