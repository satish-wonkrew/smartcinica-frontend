"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const { login, user } = useAuth(); // Ensure you get currentUser from context
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if the user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/files"); // Redirect to the files page if logged in
    }
  }, [user, router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-500">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Please login to your account
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
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
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
              type="password"
              id="password"
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&lsquo;t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
