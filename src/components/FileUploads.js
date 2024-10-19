"use client";
import React, { useState } from "react";

const FileUploadModal = () => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false); // New state for upload status
  const [error, setError] = useState(null); // New state for error messages
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadProgress(0); // Reset progress when a new file is selected
    setError(null); // Clear any previous error messages
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true); // Start the uploading process
    setError(null); // Reset any previous errors

    // Get the pre-signed URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/upload?fileName=${file.name}&fileType=${file.type}`
    );

    const data = await response.json();

    if (response.ok) {
      // Upload the file to S3 using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      // Update progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      // Handle upload completion
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // Save file metadata to the database
          await saveFileData(file.name, data.url.split("?")[0]); // Assuming the path is the URL without the query

          alert("File uploaded successfully!");
          setIsModalOpen(false); // Close modal after successful upload
          window.location.reload(); // Refresh the page
        } else {
          setError("Failed to upload file."); // Set error state
        }
        setUploading(false); // Stop uploading process
      };

      // Handle errors
      xhr.onerror = () => {
        setError("Failed to upload file."); // Set error state
        setUploading(false); // Stop uploading process
      };

      // Send the file
      xhr.send(file);
    } else {
      setError("Failed to get pre-signed URL."); // Set error state
      setUploading(false); // Stop uploading process
    }
  };

  const saveFileData = async (filename, path) => {
    const userId = "someUserId"; // Replace with the actual user ID

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename, path, userId }),
    });
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Upload File
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Upload Your File
            </h2>
            <div className="flex items-center justify-center w-full mb-4">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG, or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {file && (
              <div className="mb-4 text-white">
                <p className="font-semibold">Selected File:</p>
                <p>{file.name}</p>
                <p>{formatFileSize(file.size)}</p>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Display error messages */}
            {uploading && (
              <div className="mt-2">
                <p className="text-gray-700">
                {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{uploadProgress}%</p>
                </div>
              )}
                  Uploading: {uploadProgress.toFixed(0)}%
                </p>
                <div className="relative w-full bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={uploading ? null : uploadFile} // Disable button while uploading
                disabled={uploading} // Disable button while uploading
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatFileSize = (size) => {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
};

export default FileUploadModal;
