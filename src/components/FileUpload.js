import React, { useState } from "react";
import { toast } from "sonner";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(""); // Clear any previous errors
    }
  };

  const formatFileSize = (size) => {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    let index = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && index < units.length - 1) {
      formattedSize /= 1024;
      index++;
    }

    return `${formattedSize.toFixed(2)} ${units[index]}`;
  };

  const estimateTimeRemaining = (uploadedParts, totalParts) => {
    const elapsedTime = (Date.now() - uploadStartTime) / 1000; // in seconds
    const remainingParts = totalParts - uploadedParts;
    const estimatedTime = (elapsedTime / uploadedParts) * remainingParts;
    return Math.ceil(estimatedTime); // return in seconds
  };

  const uploadFile = async () => {
    if (!file) return;

    const partSize = 5 * 1024 * 1024; // 5 MB
    const totalParts = Math.ceil(file.size / partSize);
    setUploadStartTime(Date.now());
    setUploading(true);

    try {
      // Step 1: Start the upload and get signed URLs
      const { uploadId, signedUrls } = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/start-upload`,
        {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            totalParts,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      const parts = [];

      // Step 2: Upload each part using the signed URLs
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, file.size);
        const partData = file.slice(start, end);
        const signedUrl = signedUrls[partNumber - 1];

        const response = await fetch(signedUrl, {
          method: "PUT",
          body: partData,
          headers: {
            "Content-Type": file.type,
          },
        });

        const etag = response.headers.get("ETag");
        parts.push({ ETag: etag, PartNumber: partNumber });
        setUploadProgress(((partNumber / totalParts) * 100).toFixed(2)); // Update progress
      }

      // Step 3: Complete the upload
      const { location } = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/complete-upload`,
        {
          method: "POST",
          body: JSON.stringify({
            uploadId,
            fileName: file.name,
            parts,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      toast.success("Upload complete!");
      setIsModalOpen(false); // Close the modal after upload completion
      window.location.reload(); // Refresh the page
    } catch (err) {
      setError("Upload failed, please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-600"
        onClick={() => setIsModalOpen(true)}
      >
        Upload File
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white text-gray-800">
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
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload .zip format files
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading} // Disable the input if uploading
                />
              </label>
            </div>

            {file && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Selected File:</h3>
                <p>Name: {file.name}</p>
                <p>Size: {formatFileSize(file.size)}</p>
              </div>
            )}

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={uploadFile}
                disabled={!file || uploading}
              >
                {uploading
                  ? `Uploading ${uploadProgress}%... (Estimated time: ${estimateTimeRemaining(
                      uploadProgress,
                      100
                    ).toFixed(0)}s)`
                  : "Start Upload"}
              </button>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Upload Progress: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
