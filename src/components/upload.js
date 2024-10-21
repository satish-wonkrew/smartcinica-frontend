"use client";
import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB part size for S3

function FileUpload() {
  const [uploadId, setUploadId] = useState(null);
  const [file, setFile] = useState(null);
  const [parts, setParts] = useState([]); // Track uploaded parts
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [fileVerification, setFileVerification] = useState(false); // State for file verification
  const [fileSize, setFileSize] = useState(""); // Display file size
  const [fileName, setFileName] = useState(""); // Display file name

  // Utility function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} Bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    if (size < 1024 * 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    return `${(size / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
  };

  // Start Multipart Upload
  const startUpload = async (file) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/start-upload`,
        {
          fileName: file.name,
          fileType: file.type,
        }
      );
      const newUploadId = response.data.uploadId;
      setUploadId(newUploadId);
      return newUploadId;
    } catch (error) {
      console.error("Error starting upload:", error);
      setError("Error starting multipart upload. Please check the server.");
    }
  };

  // Upload Each Part Using Pre-signed URLs
  const uploadPart = async (partNumber, chunk) => {
    if (!uploadId || !file) {
      setError("Missing uploadId or file");
      return null;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/get-upload-url`,
        {
          uploadId,
          fileName: file.name,
          partNumber,
        }
      );

      const { signedUrl } = response.data;

      const uploadResponse = await axios.put(signedUrl, chunk, {
        headers: { "Content-Type": file.type },
      });

      const uploadedPart = {
        PartNumber: partNumber,
        ETag: uploadResponse.headers.etag.replace(/"/g, ""),
      };

      return uploadedPart;
    } catch (error) {
      setError("Error uploading part. Please retry or check network.");
      throw error; // Rethrow to handle in the main upload function
    }
  };

  // Complete Multipart Upload
  const completeUpload = async () => {
    if (!uploadId || !file || parts.length === 0) {
      setError("Missing required parameters for completing upload");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/complete-upload`,
        {
          fileName: file.name,
          uploadId,
          parts,
        }
      );

      if (response.status === 200) {
        alert("Upload complete!");
        setIsModalOpen(false); // Close the modal after upload completion
        window.location.reload(); // Refresh the page
      } else {
        setError("Failed to complete upload");
      }
    } catch (error) {
      setError("Failed to complete upload. Please try again.");
    }
  };

  // Handle File Selection
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError("No file selected");
      return;
    }
    setFile(selectedFile);
    setParts([]); // Reset parts
    setError(""); // Clear previous errors
    setFileSize(formatFileSize(selectedFile.size)); // Set file size
    setFileName(selectedFile.name); // Set file name
    setFileVerification(false); // Reset verification status
  };

  // Upload File Parts
  const uploadFileParts = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const controller = new AbortController();
    setUploading(true);
    const fileParts = []; // Use local variable to track parts

    try {
      const id = await startUpload(file);
      if (!id) return;

      const totalParts = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < totalParts; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const partNumber = i + 1;

        const uploadedPart = await uploadPart(partNumber, chunk);
        if (uploadedPart) {
          fileParts.push(uploadedPart); // Track uploaded parts locally
          setParts(fileParts); // Update the state with all uploaded parts
        }

        // Update the upload progress
        setUploadProgress(((i + 1) / totalParts) * 100);
      }

      // Complete the upload only after all parts have been uploaded
      await completeUpload();
    } catch (error) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0); // Reset progress after upload
    }
  };

  // Handle File Verification
  const handleFileVerification = () => {
    if (file) {
      setFileVerification(true);
      alert(`File Verified:\nName: ${fileName}\nSize: ${fileSize}`);
    } else {
      setError("No file selected for verification.");
    }
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
                aria-label="Dropzone for file upload"
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
                      d="M13 13h3a3 3 0 003-3v-7a3 3 0 00-3-3h-3M4 13H1a3 3 0 01-3-3v-7a3 3 0 013-3h3M7 16v-2M16 16v-2m-6 2v-6m3 3l3-3m-3 3l-3-3m3 3H5"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF or MP4 (MAX 5GB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {file && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Selected File:</h3>
                <p>Name: {fileName}</p>
                <p>Size: {fileSize}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleFileVerification}
                disabled={!file}
              >
                Verify File
              </button>
              <button
                className={`px-4 py-2 ${uploading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
                onClick={uploadFileParts}
                disabled={!file || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {/* {error && <p className="mt-4 text-red-600">{error}</p>} */}
            {uploadProgress > 0 && <p className="mt-4">Upload Progress: {uploadProgress.toFixed(2)}%</p>}

            <button
              className="mt-4 px-4 py-2 text-gray-500 underline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
