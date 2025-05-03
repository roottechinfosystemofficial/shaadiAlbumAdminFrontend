import React, { useState, useEffect } from "react";
import "../css/Clientview.css";
import { useDispatch, useSelector } from "react-redux";
import ClientForm from "../component/ClientForm";
import apiRequest from "../utils/apiRequest";
import { CLIENTVU_API_END_POINT } from "../constant";
import Cookies from "js-cookie";
import ClientPhotosView from "../component/ClientSideComponent/ClientPhotosView";

const Clientview = () => {
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { position } = useSelector((state) => state.coverImg);

  const [showForm, setShowForm] = useState(false);
  const [showFormAnimated, setShowFormAnimated] = useState(false);
  const [whichView, setWhichView] = useState("");
  const [animateUnderView, setAnimateUnderView] = useState(false);

  const { currentEvent } = useSelector((state) => state.event);

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "items-center justify-start";
      case "center":
        return "items-center justify-center";
      case "right":
        return "items-center justify-end";
      case "bottom":
        return "items-end justify-center";
      default:
        return "items-center justify-start";
    }
  };

  const scrollToPhotos = () => {
    setTimeout(() => {
      const element = document.getElementById("under-client-view");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const viewAllHandler = async () => {
    const token = Cookies.get("clientViewToken");

    if (token) {
      try {
        const endpoint = `${CLIENTVU_API_END_POINT}/verifyClientToken`;
        const res = await apiRequest(
          "POST",
          endpoint,
          { clientViewToken: token },
          accessToken,
          dispatch
        );

        if (res?.data?.showForm) {
          setShowForm(true);
          setTimeout(() => setShowFormAnimated(true), 50);
        } else {
          setWhichView("main");
          scrollToPhotos();
        }
      } catch (err) {
        console.log("Token invalid or error:", err);
        setShowForm(true);
        setTimeout(() => setShowFormAnimated(true), 50);
      }
    } else {
      setShowForm(true);
      setTimeout(() => setShowFormAnimated(true), 50);
    }
  };

  useEffect(() => {
    if (whichView === "main") {
      const timer = setTimeout(() => {
        setAnimateUnderView(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [whichView]);

  return (
    <>
      <div className="pics__header overflow-hidden relative md:h-[100vh] h-[50vh] bg-gray-800">
        <div
          className={`absolute inset-0 text-white flex p-4 md:p-8 ${getPositionClasses()}`}
        >
          <div className="flex flex-col items-start">
            <p className="text-2xl md:text-3xl uppercase pb-2 md:pb-4 font-extrabold">
              {currentEvent?.eventName}
            </p>
            <div className="flex flex-wrap gap-4 md:gap-10">
              <button
                onClick={viewAllHandler}
                className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base"
              >
                View All
              </button>
              <button className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base">
                Face Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-start justify-center overflow-hidden">
          <div
            className={`transition-transform duration-500 ease-in-out transform mt-10 w-full max-w-md ${
              showFormAnimated ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <ClientForm
              onSubmit={() => {
                setShowForm(false);
                setShowFormAnimated(false);
                setWhichView("main");
                scrollToPhotos();
              }}
              onClose={() => {
                setShowForm(false);
                setShowFormAnimated(false);
              }}
            />
          </div>
        </div>
      )}

      {!showForm && whichView === "main" && (
        <div
          id="under-client-view"
          className={`transition-all duration-700 ease-out transform ${
            animateUnderView
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <ClientPhotosView setWhichView={setWhichView} />
        </div>
      )}
    </>
  );
};

export default Clientview;
