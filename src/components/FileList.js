/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "lastModified",
    direction: "desc",
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(files.filter((file) => file._id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredFiles = sortedFiles.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Uploaded Files
      </h2>
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 text-black mb-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-blue-300 transition duration-300"
                onClick={() => handleSort("filename")}
              >
                File Name{" "}
                {sortConfig.key === "filename"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-blue-300 transition duration-300"
                onClick={() => handleSort("size")}
              >
                Size (KB){" "}
                {sortConfig.key === "size"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-blue-300 transition duration-300"
                onClick={() => handleSort("lastModified")}
              >
                Uploaded Date{" "}
                {sortConfig.key === "lastModified"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr
                  key={file._id}
                  className="hover:bg-gray-100 transition duration-300"
                >
                  <td className="py-3 px-4 border-b border-gray-300 text-black">
                    {file.filename}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-black">
                    {file.size / 1024 / 1024 > 1024
                      ? `${(file.size / 1024 / 1024 / 1024).toFixed(2)} GB`
                      : file.size / 1024 > 1024
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : `${file.size / 1024} KB`}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <span className="text-green-500">
                      {new Date(file.lastModified).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex space-x-2">
                      <a
                        href={file.downloadUrl}
                        className="px-3 py-1 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300 transform hover:scale-105"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
