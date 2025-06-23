import React from "react";

function ImageUploader({ onUpload }) {
  const cloudName = "dxggxp6so";
  const uploadPreset = "monkey_upload";

  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "camera", "url"],
        cropping: false,
        multiple: false,
        maxFileSize: 2000000,
        folder: "monkeys",
        clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
        resourceType: "image",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          onUpload(result.info.secure_url); // Send image URL to parent
        }
      }
    );

    widget.open();
  };

  return (
    <button
      type="button"
      onClick={handleUpload}
      className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
    >
      Upload Monkey Image
    </button>
  );
}

export default ImageUploader;
