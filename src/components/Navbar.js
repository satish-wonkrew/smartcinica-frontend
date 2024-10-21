/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { FaUser, FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img from "../img/cnica.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                src={img}
                alt="SmartCinica logo"
                className="object-contain h-32"
              />
            </Link>
          </div>

          {/* <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Services
            </Link>
          </div> */}

          <div className="relative flex items-center">
            {user ? (
              <>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-900 dark:text-white relative"
                >
                  <FaBell className="h-6 w-6 mr-4" />
                  <FaUser className="h-6 w-6" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
        </div>

        {/* Mobile Menu */}
      </div>
    </nav>
  );
};

export default Navbar;
