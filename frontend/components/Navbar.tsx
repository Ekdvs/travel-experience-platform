"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">
        Travel Experiences
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        {user ? (
          <>
            <Link href="/create" className="hover:underline">Create Listing</Link>
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-600 flex flex-col gap-2 p-4 md:hidden">
          {user ? (
            <>
              <Link href="/create" className="hover:underline" onClick={() => setIsOpen(false)}>Create Listing</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="hover:underline text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
              <Link href="/register" className="hover:underline" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;