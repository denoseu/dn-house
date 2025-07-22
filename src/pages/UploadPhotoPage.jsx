import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { uploadPhoto } from "../api/photos";
import Postcard from "../components/Postcard";
import Polaroid from "../components/Polaroid";

const UploadPhotoPage = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [type, setType] = useState("postcard"); // default ke postcard

  // Handle file input change
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setErrorMsg("");
    } else {
      setFile(null);
      setPreview(null);
      setErrorMsg("Only image files are allowed.");
    }
  };

  // Handle caption input
  const handleCaptionChange = (e) => setCaption(e.target.value);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!file) {
      setErrorMsg("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      await uploadPhoto({ file, caption, type });
      setSuccessMsg("Photo uploaded successfully!");
      setFile(null);
      setCaption("");
      setPreview(null);
      setType("postcard"); // reset ke default
    } catch (err) {
      setErrorMsg(err.message || "Upload failed.");
    }
    setUploading(false);
  };

  // Handle open camera
  const handleOpenCamera = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setErrorMsg("Cannot access camera.");
      setCameraActive(false);
    }
  };

  // Handle capture photo from camera
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const imgFile = new File([blob], "captured.jpg", { type: "image/jpeg" });
        setFile(imgFile);
        setPreview(URL.createObjectURL(blob));
        setErrorMsg("");
      }
    }, "image/jpeg");
    // Stop camera
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Handle close camera
  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  return (
    <>
      <title>Upload Photo</title>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
        <h1 className="text-3xl font-louis font-bold mb-6">Upload a Photo</h1>
        
        {/* Preview area */}
        <div className="mb-8 flex flex-col items-center">
          <div className="font-louis text-gray-700 mb-2">Preview</div>
          <div className="shadow-lg rounded-lg bg-white p-4 flex items-center justify-center min-h-[350px] min-w-[300px]">
            {preview ? (
              type === "postcard" ? (
                <Postcard
                  imageSrc={preview}
                  text={caption}
                  stampNumber={1}
                />
              ) : (
                <Polaroid
                  imageSrc={preview}
                  text={caption}
                  stampNumber={1}
                />
              )
            ) : (
              <div className="text-gray-400 font-louis text-center">
                No image selected.<br />Choose a file or use camera to preview.
              </div>
            )}
          </div>
        </div>

        <form
          className="bg-white rounded-lg shadow-md p-6 w-full max-w-md flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {/* File input */}
          <div>
            <label className="block font-louis mb-2">Select Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full"
              disabled={uploading}
            />
          </div>
          {/* Camera button */}
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded font-louis hover:bg-blue-600 transition"
              onClick={handleOpenCamera}
              disabled={cameraActive || uploading}
            >
              Open Camera
            </button>
            {cameraActive && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded font-louis hover:bg-gray-500 transition"
                onClick={handleCloseCamera}
              >
                Close Camera
              </button>
            )}
          </div>
          {/* Camera preview */}
          {cameraActive && (
            <div className="flex flex-col items-center">
              <video ref={videoRef} width={320} height={240} autoPlay className="rounded border mb-2" />
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded font-louis hover:bg-green-600 transition"
                onClick={handleCapture}
              >
                Capture Photo
              </button>
            </div>
          )}
          {/* Image preview */}
          {preview && (
            <div className="flex flex-col items-center">
              <img src={preview} alt="Preview" className="max-h-48 rounded border mb-2" />
              <button
                type="button"
                className="text-red-500 font-louis underline"
                onClick={() => { setFile(null); setPreview(null); }}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          )}
          {/* Caption input */}
          <div>
            <label className="block font-louis mb-2">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={handleCaptionChange}
              className="w-full border rounded px-2 py-1 font-louis"
              maxLength={200}
              disabled={uploading}
              placeholder="Enter a caption..."
            />
          </div>
          {/* Type toggle */}
          <div>
            <label className="block font-louis mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 font-louis">
                <input
                  type="radio"
                  name="type"
                  value="postcard"
                  checked={type === "postcard"}
                  onChange={() => setType("postcard")}
                  disabled={uploading}
                />
                Postcard
              </label>
              <label className="flex items-center gap-1 font-louis">
                <input
                  type="radio"
                  name="type"
                  value="polaroid"
                  checked={type === "polaroid"}
                  onChange={() => setType("polaroid")}
                  disabled={uploading}
                />
                Polaroid
              </label>
            </div>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded font-louis hover:bg-green-700 transition"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          {/* Success/Error messages */}
          {successMsg && <div className="text-green-600 font-louis">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 font-louis">{errorMsg}</div>}
        </form>
      </div>
    </>
  );
};

export default UploadPhotoPage;
