"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter(); // Initialize the router
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, user } = useAuth();
  useEffect(() => {
    if (user) {
      router.push("/files"); // Redirect to the files page if logged in
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(username, email, password); // Calling register function
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error occurred during signup.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign up to get started!
        </p>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="username"
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
              placeholder=" "
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label
              htmlFor="username"
              className="absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 origin-[0] bg-white dark:bg-gray-800 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Username
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="email"
              className="absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 origin-[0] bg-white dark:bg-gray-800 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="password"
              className="absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 origin-[0] bg-white dark:bg-gray-800 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Password
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
              placeholder=" "
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 origin-[0] bg-white dark:bg-gray-800 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-500 hover:underline dark:text-green-400"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
