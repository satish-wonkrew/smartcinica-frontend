/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              SMARTCNICA
            </Link>
            {/* <div className="ml-10 space-x-4">
              <Link href="/" className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Home
              </Link>
              <Link href="/about" className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                About
              </Link>
              <Link href="/dashboard" className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Dashboard
              </Link>
              <Link href="/contact" className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Contact
              </Link>
            </div> */}
          </div>

          <div className="flex items-center">
            {user ? (
              <>
              <FaUser/>
                
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
