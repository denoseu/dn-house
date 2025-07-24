import React, { useRef, useState, useEffect } from "react";
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
  const [screenSize, setScreenSize] = useState('desktop');
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [isMobile, setIsMobile] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);

  // Handle screen size changes and detect mobile
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 640 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobileDevice);
      
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check available cameras on component mount
  useEffect(() => {
    const checkAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (err) {
        console.log('Could not enumerate devices:', err);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      checkAvailableCameras();
    }
  }, []);

  // Get scale factor based on screen size
  const getScaleFactor = () => {
    switch (screenSize) {
      case 'mobile': return 0.75;
      case 'tablet': return 0.85;
      default: return 1;
    }
  };

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

  // Start camera with specified facing mode
  const startCamera = async (facing = facingMode) => {
    try {
      // Stop any existing stream first
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setFacingMode(facing);
    } catch (err) {
      console.error('Camera error:', err);
      throw err;
    }
  };

  // Handle open camera
  const handleOpenCamera = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setCameraActive(true);
    try {
      await startCamera();
    } catch (err) {
      setErrorMsg("Cannot access camera.");
      setCameraActive(false);
    }
  };

  // Handle flip camera
  const handleFlipCamera = async () => {
    if (!cameraActive) return;
    
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    try {
      await startCamera(newFacingMode);
    } catch (err) {
      setErrorMsg("Cannot switch camera.");
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
    
    // If using front camera, flip the image horizontally
    if (facingMode === 'user') {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

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
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Main heading */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-black font-louis relative">
              Share a Memory!
            </h1>
            <p className="text-gray-700 text-base md:text-lg font-louis">
              Upload a photo and it'll appear in the menu! 
            </p>
          </div>

          {/* Preview area - Responsive size */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-louis">
              Preview 
            </div>
            
            <div className="relative bg-white p-3 md:p-6 rounded-3xl shadow-xl border-4 border-gray-200 w-full max-w-lg">
              {/* Responsive container with aspect ratio */}
              <div className="flex items-center justify-center w-full aspect-[5/4] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
                {preview ? (
                  <div className="flex items-center justify-center w-full h-full p-1 md:p-2">
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        transform: `scale(${getScaleFactor()})`,
                        transformOrigin: 'center'
                      }}
                    >
                      {type === "postcard" ? (
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
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center p-4 md:p-8 font-louis">
                    <div className="text-base md:text-lg font-medium">
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

          {/* Upload form - Below preview, centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <form
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-4 border-gray-200 relative overflow-hidden"
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
                          className="px-4 py-3 bg-gray-400 text-white rounded-full font-louis font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 shadow"
                          onClick={handleCloseCamera}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Camera preview - Responsive */}
                  {cameraActive && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                      <div className="relative">
                        <video 
                          ref={videoRef} 
                          className={`w-full max-w-sm h-auto rounded-xl border-4 border-white shadow ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                          autoPlay 
                        />
                        
                        {/* Camera flip button - only show on mobile or when multiple cameras available */}
                        {(isMobile || availableCameras.length > 1) && (
                          <button
                            type="button"
                            className="absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                            onClick={handleFlipCamera}
                            title="Flip camera"
                          >
                            <svg 
                              className="w-5 h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1l-1-2H7l-1 2H5a2 2 0 00-2 2v0" 
                              />
                              <circle cx={12} cy={13} r={3} />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M16 6l2 2-2 2M8 6L6 8l2 2" 
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="bg-gray-800 text-white px-6 py-3 rounded-full font-louis font-semibold hover:bg-black transition-all duration-200 transform hover:scale-105 shadow"
                          onClick={handleCapture}
                        >
                          Snap Photo!
                        </button>
                        
                        {/* Camera mode indicator */}
                        {isMobile && (
                          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border">
                            {facingMode === 'user' ? 'Front' : 'Back'} cam
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image preview in form - Responsive */}
                  {preview && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-100 rounded-2xl border-2 border-gray-200">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-24 md:max-h-32 w-auto rounded-xl border-4 border-white shadow" 
                      />
                      <button
                        type="button"
                        className="text-red-500 font-louis font-semibold underline hover:text-red-700 transition-colors"
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