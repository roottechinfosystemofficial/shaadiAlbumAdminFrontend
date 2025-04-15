import React from "react";
import { useNavigate } from "react-router-dom";
import box1 from "../../assets/box1.png";
import box2 from "../../assets/box2.png";
import box3 from "../../assets/box5.png";

const cardData = [
  {
    imgSrc: box1,
    title: "Client Gallery",
    description: "Face Recognition Based Image Sharing Platform",
    link: "/event",
  },
  {
    imgSrc: box2,
    title: "Face Scan Pre Registration",
    description:
      "Register attendees with facial recognition before the event for quick and secure check-in.",
    link: "/standyshow",
  },
  {
    imgSrc: box3,
    title: "Flipbook",
    description:
      "Interactive digital book experience to showcase event memories or brand stories.",
    link: "/personalfolder/1",
  },
];

const DirectLinkCard = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[2%] p-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl px-4 py-10 flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-xl"
        >
          <img
            src={card.imgSrc}
            alt={card.title}
            className="w-full h-40 object-contain rounded-md"
          />
          <h2 className="text-xl font-bold mt-4 max-w-[80%]">{card.title}</h2>
          <p className="text-gray-600 mt-2 text-sm px-2">{card.description}</p>
          <button
            className="mt-4 bg-primary hover:bg-primary-dark transition-colors duration-300 text-white w-1/2 py-2 rounded-lg font-medium"
            onClick={() => navigate(card.link)}
          >
            Start
          </button>
        </div>
      ))}
    </div>
  );
};

export default DirectLinkCard;
