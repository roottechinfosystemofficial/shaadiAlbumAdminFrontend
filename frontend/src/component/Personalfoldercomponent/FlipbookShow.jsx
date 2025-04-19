import React from "react";
import Flipbookfun from "./Flipbookfun";

const imageNumbers = [1, 14, 8, 110, 116, 122, 128, 134, 140, 146, 98, 104, 2];
const images = imageNumbers.map((num) => `/FlipBook/img${num}.jpg`);

const FlipbookShow = () => {
  return (
    <div className="w-full  bg-black overflow-hidden">
      <Flipbookfun images={images} />
    </div>
  );
};

export default FlipbookShow;
