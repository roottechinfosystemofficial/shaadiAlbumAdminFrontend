import React from "react";
import Flipbookfun from "./Flipbookfun";

const imageNumbers = [
  1, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110,
  116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200,
  206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 332, 338, 344, 350, 362,
  374, 380, 2,
];
const images = imageNumbers.map((num) => `/FlipBook/img${num}.jpg`);

const FlipbookShow = () => {
  return (
    <div className="">
      <Flipbookfun images={images} />
    </div>
  );
};

export default FlipbookShow;
