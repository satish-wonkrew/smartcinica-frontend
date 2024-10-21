"use client";
import FileList from "@/components/FileList";
import FileUploader from "@/components/FileUpload";
import FileUploadModal from "@/components/FileUploads"; // Check if you are using this component
import ProtectedRoute from "@/components/Protected";
import React, { useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"; // Importing an icon

const Files = () => {
  useEffect(() => {
    // Trigger animations on component mount
    const elements = document.querySelectorAll(".animate-on-load");
    elements.forEach((el, index) => {
      el.classList.add(
        `animate__animated`,
        `animate__fadeIn`,
        `animate__delay-${index}s`
      );
    });
  }, []);

  return (
    // <ProtectedRoute>
    <div className="bg-gradient-to-r from-blue-100 to-white w-screen h-full min-h-screen flex items-center">
      <div className="mx-auto p-6 w-5/6 max-w-6xl">
        <h1 className="text-5xl font-bold mb-8 text-center text-gray-800 animate-on-load">
          File Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-2xl animate-on-load">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              Uploaded Files
            </h2>
            <FileUploader />
          </div>
          <div className="flex items-center mb-4 text-gray-600">
            <AiOutlineCloudUpload className="text-2xl mr-2" />
            <span className="text-lg">
              Drag and drop files here or click to upload
            </span>
          </div>
          <FileList />
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
};

export default Files;
