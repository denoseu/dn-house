import React from "react";

const Postcard = ({ imageSrc, text, stampNumber }) => {
  return (
    <div className="relative w-[500px] h-[350px]">
      {/* LATER Image */}
      <img
        src={imageSrc}
        alt="User content"
        className="absolute left-[130px] top-[100px] w-[100px] h-auto object-cover rounded"
      />
      
      {/* Postcard Base Image */}
      <img
        src="/images/photo/postcard.svg"
        alt="Postcard base"
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Text */}
        <div className="absolute top-[180px] right-[120px] w-[100px] text-black text-[12px] font-louis font-bold leading-[18px] text-center">
        {text}

        <div className="absolute top-[-86px] right-[-1px] w-[25px] text-black text-[8px] font-louis font-bold leading-[18px] text-center">{stampNumber}</div>
      </div>
    </div>
  );
};

// CONTOH PAKE
// const App = () => {
//   return (
//     <div>
//       <Postcard 
//         imageSrc="/images/demo.jpg" 
//         text="Hello this is our little cute cat named Georgie. We rlly love him" 
//         stampNumber={1}
//       />
//     </div>
//   );
// };

export default Postcard;
