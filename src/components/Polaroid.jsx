import React from "react";

const Polaroid = ({ imageSrc, text, stampNumber }) => {
  return (
    <div className="relative w-[300px] h-[350px]">
      {/* LATER Image */}
      <img
        src={imageSrc}
        alt="User content"
        className="absolute left-[65px] top-[50px] w-[100px] h-auto w-[170px] object-cover rounded"
      />
      
      {/* Polaroid Base Image */}
      <img
        src="/images/photo/polaroid.svg"
        alt="Polaroid base"
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Text */}
        <div className="absolute top-[275px] left-[70px] w-[170px] text-black text-[12px] font-louis font-bold leading-[18px] text-center">
        {text}
      </div>
    </div>
  );
};

export default Polaroid;
