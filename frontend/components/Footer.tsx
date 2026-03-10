"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Logo + Description */}
          <div>
            <h2 className="text-xl font-bold text-white">TravelX</h2>
            <p className="mt-3 text-sm text-gray-400">
              Discover amazing travel destinations and share your experiences
              with travelers around the world.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white">
                <Facebook size={18} />
              </a>

              <a href="#" className="hover:text-white">
                <Instagram size={18} />
              </a>

              <a href="#" className="hover:text-white">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/listings" className="hover:text-white">
                  Listings
                </Link>
              </li>

              <li>
                <Link href="/create-listing" className="hover:text-white">
                  Create Listing
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>Sri Lanka</li>
              <li>support@travelx.com</li>
              <li>+94 77 123 4567</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} TravelX. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;