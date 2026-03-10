"use client";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useContext } from "react";



const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between p-4 bg-blue-600 text-white">
      <Link href="/">Travel Experiences</Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link href="/create">Create Listing</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;