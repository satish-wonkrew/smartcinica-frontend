"use client";
import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB part size for S3

function FileUpload() {
  const [uploadId, setUploadId] = useState(null);
  const [file, setFile] = useState(null);
  const [parts, setParts] = useState([]); // State for tracking uploaded parts
  const [uploading, setUploading] = useState(false);

  // Start Multipart Upload
  const startUpload = async (file) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/start-upload",
        {
          fileName: file.name,
          fileType: file.type,
        }
      );
      const newUploadId = response.data.uploadId;
      setUploadId(newUploadId);
      console.log("Uploaded ID:", newUploadId);
      return newUploadId;
    } catch (error) {
      console.error("Error starting multipart upload:", error);
      alert("Failed to start upload.");
      throw error;
    }
  };

  // Upload Each Part Using Pre-signed URLs
  const uploadPart = async (partNumber, chunk) => {
    if (!uploadId || !file) {
      console.error("Missing uploadId or file");
      return null;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/get-upload-url",
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
      console.log(`Uploaded part ${partNumber}:`, uploadedPart);
      return uploadedPart;
    } catch (error) {
      console.error("Error uploading part:", error);
      alert("Failed to upload a part. Please retry.");
      throw error;
    }
  };

  // Complete Multipart Upload
  const completeUpload = async () => {
    console.log("Upload ID:", uploadId);
    console.log("File:", file);
    console.log("Parts:", parts);

    if (!uploadId || !file || parts.length === 0) {
      console.error("Missing required parameters for completing upload");
      alert("Upload ID, file name, or parts are missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/complete-upload",
        {
          fileName: file.name,
          uploadId,
          parts,
        }
      );

      if (response.status === 200) {
        alert("Upload complete!");
      } else {
        console.error("Error completing upload:", response.data);
        alert("Failed to complete upload.");
      }
    } catch (error) {
      console.error("Error completing upload:", error);
      alert("Failed to complete upload.");
    }
  };

  // Handle File Selection
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("No file selected");
      return;
    }
    setFile(selectedFile);
    setParts([]); // Reset parts when a new file is selected
  };

  // Upload File Parts
  const uploadFileParts = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    const fileParts = []; // Use a local variable to track parts

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
          console.log(`Uploaded part ${partNumber}:`, uploadedPart);
        }
      }

      // Update the state with all uploaded parts only after all parts have been uploaded
      setParts(fileParts);
      console.log("All uploaded parts:", fileParts); // Debugging line

      // Now complete the upload with the collected parts
      await completeUpload(); // This function will now have all the correct parameters
    } catch (error) {
      console.error("File upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={uploading} />
      <button onClick={uploadFileParts} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {uploading && <p>Uploading... Please wait.</p>}
    </div>
  );
}

export default FileUpload;
