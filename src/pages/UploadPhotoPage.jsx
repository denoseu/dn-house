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
  const [type, setType] = useState("postcard");

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
      setType("postcard");
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
      <div className="min-h-[calc(100vh-80px)] bg-white p-4 relative overflow-hidden">
        {/* Neutral background accents */}
        
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto relative z-10">
          {/* Main heading with neutral styling */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black font-louis relative">
              Share a Memory!
            </h1>
            <p className="text-gray-700 text-lg font-louis">
              Upload a photo and it'll appear in the menu! 
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
            {/* Preview area - styled like a photo frame */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-louis">
                Preview 
              </div>
              
              <div className="relative bg-white p-6 rounded-3xl shadow-xl border-4 border-gray-200">
                {/* Decorative neutral corners */}
                
                <div className="flex items-center justify-center min-h-[350px] min-w-[300px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
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
                    <div className="text-gray-400 text-center p-8 font-louis">
                      <div className="text-lg font-medium">
                        No image selected yet!
                      </div>
                      <div className="text-sm mt-2">
                        Choose a file or snap a photo to see the magic
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload form - neutral style */}
            <div className="flex-1 max-w-md w-full">
              <form
                className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200 relative overflow-hidden"
                onSubmit={handleSubmit}
              >
                {/* Decorative neutral header */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100"></div>
                
                <div className="pt-4 space-y-6">
                  {/* File input section */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-800 font-louis">
                      Choose Your Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-700 font-louis file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 file:transition-colors cursor-pointer file:font-louis"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Camera section */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-800 font-louis">
                      Or Take a Photo
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full font-louis font-semibold hover:bg-black transition-all duration-200 transform hover:scale-105 shadow disabled:opacity-50 disabled:transform-none"
                        onClick={handleOpenCamera}
                        disabled={cameraActive || uploading}
                      >
                        {cameraActive ? "Camera On" : "Open Camera"}
                      </button>
                      {cameraActive && (
                        <button
                          type="button"
                          className="px-4 py-3 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 shadow"
                          onClick={handleCloseCamera}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Camera preview */}
                  {cameraActive && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                      <video 
                        ref={videoRef} 
                        width={280} 
                        height={210} 
                        autoPlay 
                        className="rounded-xl border-4 border-white shadow" 
                      />
                      <button
                        type="button"
                        className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition-all duration-200 transform hover:scale-105 shadow"
                        onClick={handleCapture}
                      >
                        Snap Photo!
                      </button>
                    </div>
                  )}

                  {/* Image preview in form */}
                  {preview && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-100 rounded-2xl border-2 border-gray-200">
                      <img src={preview} alt="Preview" className="max-h-32 rounded-xl border-4 border-white shadow" />
                      <button
                        type="button"
                        className="text-red-500 font-semibold underline hover:text-red-700 transition-colors"
                        onClick={() => { setFile(null); setPreview(null); }}
                        disabled={uploading}
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}

                  {/* Caption input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-800 font-louis">
                      Add a Caption
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={handleCaptionChange}
                      className="w-full border-2 border-gray-200 rounded-full px-4 py-3 font-louis font-medium focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all bg-white text-gray-800"
                      maxLength={200}
                      disabled={uploading}
                      placeholder="Share your thoughts..."
                    />
                  </div>

                  {/* Type selection */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-800 font-louis">
                      Choose Style
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-semibold text-gray-800 cursor-pointer p-3 rounded-full hover:bg-gray-100 transition-colors font-louis">
                        <input
                          type="radio"
                          name="type"
                          value="postcard"
                          checked={type === "postcard"}
                          onChange={() => setType("postcard")}
                          disabled={uploading}
                          className="w-4 h-4 text-gray-800"
                        />
                        Postcard
                      </label>
                      <label className="flex items-center gap-2 font-semibold text-gray-800 cursor-pointer p-3 rounded-full hover:bg-gray-100 transition-colors font-louis">
                        <input
                          type="radio"
                          name="type"
                          value="polaroid"
                          checked={type === "polaroid"}
                          onChange={() => setType("polaroid")}
                          disabled={uploading}
                          className="w-4 h-4 text-gray-800"
                        />
                        Polaroid
                      </label>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white px-6 py-4 rounded-full text-lg font-bold font-louis hover:bg-black transition-all duration-200 transform hover:scale-105 shadow disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading Magic...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Share My Memory!
                      </span>
                    )}
                  </button>

                  {/* Success/Error messages */}
                  {successMsg && (
                    <div className="text-center p-3 bg-gray-100 border-2 border-gray-300 text-gray-800 rounded-full font-semibold font-louis">
                      {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="text-center p-3 bg-red-100 border-2 border-red-300 text-red-700 rounded-full font-semibold font-louis">
                      {errorMsg}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPhotoPage;