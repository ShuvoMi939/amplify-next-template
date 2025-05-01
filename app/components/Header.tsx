"use client";

import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsSubMenuOpen(false);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
          <Link href="/" className="text-2xl font-bold text-blue-600">Nirdeshona</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-600 text-lg">Home</Link>
          <Link href="/about" className="hover:text-blue-600 text-lg">About</Link>
          <Link href="/services" className="hover:text-blue-600 text-lg">Services</Link>
          <Link href="/contact" className="hover:text-blue-600 text-lg">Contact</Link>
          <div className="relative group">
            <button className="hover:text-blue-600 text-lg">Dashboard</button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded p-2 space-y-2 z-10">
              <Link href="/dashboard/profile" className="block hover:text-blue-600 text-sm">Profile</Link>
              <Link href="/dashboard/settings" className="block hover:text-blue-600 text-sm">Settings</Link>
              <Link href="/dashboard/feed" className="block hover:text-blue-600 text-sm">Feed</Link>
              <Link href="/dashboard/courses" className="block hover:text-blue-600 text-sm">Courses</Link>
              <Link href="/dashboard/posts" className="block hover:text-blue-600 text-sm">Posts</Link>
              <Link href="/dashboard/support" className="block hover:text-blue-600 text-sm">Support</Link>
            </div>
          </div>

          {/* Search box for desktop */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search..."
              className="p-1.5 pl-4 pr-8 rounded-full border border-gray-300 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>

          {/* Login */}
          <Link href="/login" className="text-blue-600 text-lg">
            <FaUser />
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile search icon */}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="text-xl text-gray-700" />
          </button>

          {/* Mobile user icon */}
          <Link href="/login">
            <FaUser className="text-xl text-gray-700" />
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <FaTimes className="text-xl text-gray-700" />
            ) : (
              <FaBars className="text-xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Mobile nav menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow-md">
          <nav className="space-y-3 text-sm">
            <Link href="/" className="block hover:text-blue-600" onClick={handleNavClick}>Home</Link>
            <Link href="/about" className="block hover:text-blue-600" onClick={handleNavClick}>About</Link>
            <Link href="/services" className="block hover:text-blue-600" onClick={handleNavClick}>Services</Link>
            <Link href="/contact" className="block hover:text-blue-600" onClick={handleNavClick}>Contact</Link>
            <div>
              <button
                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                className="block w-full text-left hover:text-blue-600"
              >
                Dashboard
              </button>
              {isSubMenuOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link href="/dashboard/profile" className="block hover:text-blue-600" onClick={handleNavClick}>Profile</Link>
                  <Link href="/dashboard/settings" className="block hover:text-blue-600" onClick={handleNavClick}>Settings</Link>
                  <Link href="/dashboard/feed" className="block hover:text-blue-600" onClick={handleNavClick}>Feed</Link>
                  <Link href="/dashboard/courses" className="block hover:text-blue-600" onClick={handleNavClick}>Courses</Link>
                  <Link href="/dashboard/posts" className="block hover:text-blue-600" onClick={handleNavClick}>Posts</Link>
                  <Link href="/dashboard/support" className="block hover:text-blue-600" onClick={handleNavClick}>Support</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
