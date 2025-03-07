import React from "react";
import Polaroid from "../components/Polaroid";

const GuestbookPage = () => {
    return (
        <div>
            <Polaroid 
                imageSrc="/images/demo.jpg" 
                text="Hello this is our little cute cat named Georgie. We love him"
            />
        </div>
    );
}

export default GuestbookPage;