import FileList from "@/components/FileList";
import FileUpload from "@/components/FileUpload";
import FileUploadModal from "@/components/FileUploads";
import React from "react";

const Files = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-900 h-full">
      <h1 className="text-5xl font-bold mb-8 text-center text-white animate__animated animate__fadeIn">
        File Dashboard
      </h1>

      <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-lg shadow-lg p-6 mb-8 animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-4xl font-semibold mb-4 text-white">
          Upload New File
        </h2>
        <FileUploadModal />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-2xl animate__animated animate__fadeIn animate__delay-2s">
        <h2 className="text-4xl font-semibold mb-4 text-white">
          Uploaded Files
        </h2>
        <FileList />
      </div>
    </div>
  );
};

export default Files;
