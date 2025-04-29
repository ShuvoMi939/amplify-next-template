"use client"; // Add this line to mark this component as a client component

import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa"; // Example icons

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
          <Link href="/" className="text-2xl font-bold">
            Nirdeshona
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="flex space-x-6">
            <Link href="/" className="text-lg hover:text-gray-200">
              Home
            </Link>
            <Link href="/about" className="text-lg hover:text-gray-200">
              About
            </Link>
            <Link href="/services" className="text-lg hover:text-gray-200">
              Services
            </Link>
            <Link href="/contact" className="text-lg hover:text-gray-200">
              Contact
            </Link>
            <Link href="/dashboard" className="text-lg hover:text-gray-200">
              Dashboard
            </Link>
          </nav>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded bg-white text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-2 right-2 text-gray-500" />
          </div>

          {/* User Profile Link */}
          <Link href="/login">
            <FaUser className="text-xl" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
