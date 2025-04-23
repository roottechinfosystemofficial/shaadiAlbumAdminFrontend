import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ScanFace,
  Heart,
  Upload,
  ShoppingCart,
  Share2,
  ArrowDownToLineIcon,
} from "lucide-react";

const ClientPhotosView = ({ singleEvent }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [fetchedImages, setFetchedImages] = useState([]);

  const goBack = () => {
    navigate(-1);
  };
  const fetchImages = async () => {
    try {
      console.log(eventId);

      const { data } = await axios.get(
        "http://localhost:5000/api/v1/list-images",
        {
          params: { eventId: eventId, page, limit: 300 },
        }
      );

      setFetchedImages(data.images);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [eventId, page]);

  return (
    <div className="container mx-auto p-4 pb-24">
      <button
        onClick={goBack}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
      >
        <span className="text-black">&larr; Back</span>
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {singleEvent?.eventName || "Event Name"}
          </h2>
          <p className="text-sm text-gray-500">
            {singleEvent?.eventCode || "Event Code"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-black">
          {[
            ScanFace,
            Heart,
            Upload,
            ShoppingCart,
            Share2,
            ArrowDownToLineIcon,
          ].map((Icon, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition"
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
      {fetchedImages?.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-5 mx-auto">
            {fetchedImages?.map((image, index) => (
              <img
                key={index}
                src={image}
                width={355}
                className="object-cover  rounded shadow"
                alt={`Event Image ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <p>No Images Found</p>
        </>
      )}
    </div>
  );
};

export default ClientPhotosView;
