"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { Menu, X, LogIn, UserPlus, LogOut, PlusCircle, Plane } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-blue-600/95 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90"
        >
          <Plane size={22} />
          Travel Experiences
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          {user ? (
            <>
              <Link
                href="/create"
                className="flex items-center gap-1 hover:text-blue-200 transition"
              >
                <PlusCircle size={18} />
                Create Listing
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 hover:text-blue-200 transition"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-3 px-6 pb-4 text-sm font-medium">

          {user ? (
            <>
              <Link
                href="/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <PlusCircle size={18} />
                Create Listing
              </Link>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-left hover:text-blue-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;