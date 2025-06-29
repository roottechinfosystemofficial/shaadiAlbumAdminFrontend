// ============================
// Clientview.jsx (Updated)
// ============================

import React, { useState, useEffect, useRef } from "react";
import "../css/Clientview.css";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import ClientForm from "../component/ClientForm";
import apiRequest from "../utils/apiRequest";
import { CLIENTVU_API_END_POINT, S3_API_END_POINT } from "../constant";
import { setCoverImg } from "../Redux/Slices/CoverImgSlice";
import { setImagePath } from "../Redux/Slices/S3Images";
import FaceRecognitionPopup from "../../../App/src/Components/FaceCaptureModal";
import LoaderModal from "../component/LoadingModal";
import ErrorModal from "../component/UsersComponent/ErrorModal";
import ClientPhotosView from "../component/ClientSideComponent/ClientPhotosView";
import toast from "../utils/toast";
const Clientview = () => {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();

  const { currentEvent, currentSubEvent } = useSelector((state) => state.event);
  const { accessToken, authUser } = useSelector((state) => state.user);
  const { position, coverImg } = useSelector((state) => state.coverImg);
  const s3ImageState = useSelector((state) => state.s3Images);
  const s3Keys = s3ImageState?.s3Keys?.map(
    (i) => `eventimages/${currentEvent?._id}/${currentSubEvent?._id}/Original/${i.filename}`
  );

  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFormAnimated, setShowFormAnimated] = useState(false);
  const [whichView, setWhichView] = useState("");
  const [animateUnderView, setAnimateUnderView] = useState(false);

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    canvas.getContext("2d").drawImage(webcamRef.current, 0, 0);
    const image = canvas.toDataURL("image/png");
    setCapturedImage(image);
    dispatch(setImagePath(image));
    webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
  };

  const handleSubmit = async () => {
    setLoader(true);

    try {
      toast.loading("Uploading captured image...");

      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], "face-scan.png", { type: blob.type });

      // const urlResponse = await apiRequest(
      //   "POST",
      //   `${S3_API_END_POINT}/get-presigned-url`,
      //   {
      //     eventId: currentEvent._id,
      //     subEventId: currentSubEvent._id,
      //     files: [{ fileName: file.name, fileType: file.type, fileSize: file.size }],
      //   },
      //   accessToken,
      //   dispatch
      // );

      // const presignedUrl = urlResponse?.data?.urls?.[0]?.url;
      // if (!presignedUrl) throw new Error("No presigned URL");

      // await fetch(presignedUrl, {
      //   method: "PUT",
      //   headers: { "Content-Type": file.type },
      //   body: file,
      // });

      toast.dismiss();
      toast.success("Image uploaded ✅");
      dispatch(setCoverImg(capturedImage));
      setIsOpen(false);
      setWhichView("faceScanResults");
    } catch (err) {
      toast.dismiss();
      setError("Something went wrong ❌");
    } finally {
      setLoader(false);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    if (webcamRef.current?.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsOpen(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case "left": return "items-center justify-start";
      case "center": return "items-center justify-center";
      case "right": return "items-center justify-end";
      case "bottom": return "items-end justify-center";
      default: return "items-center justify-start";
    }
  };

  const scrollToPhotos = () => {
    setTimeout(() => {
      const el = document.getElementById("under-client-view");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const viewAllHandler = async () => {
    const token = Cookies.get("clientViewToken");
    if (token) {
      try {
        const res = await apiRequest(
          "POST",
          `${CLIENTVU_API_END_POINT}/verifyClientToken`,
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
        setShowForm(true);
        setTimeout(() => setShowFormAnimated(true), 50);
      }
    } else {
      setShowForm(true);
      setTimeout(() => setShowFormAnimated(true), 50);
    }
  };

  useEffect(() => {
    if (isOpen && webcamRef.current && !capturedImage) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => (webcamRef.current.srcObject = stream))
        .catch((err) => console.error("Camera error", err));
    }
  }, [isOpen, capturedImage]);

  useEffect(() => {
    if (whichView === "main") {
      const timer = setTimeout(() => setAnimateUnderView(true), 50);
      return () => clearTimeout(timer);
    }
  }, [whichView]);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const res = await apiRequest(
          "GET",
          `${S3_API_END_POINT}/cover-image?eventId=${currentEvent?._id}&subEventId=${currentSubEvent?._id}`
        );
        dispatch(setCoverImg(res.data.url));
      } catch (err) {
        console.log("Cover fetch error", err);
      }
    };
    fetchCover();
  }, [currentEvent?._id]);

  return (
    <>
      <div
        style={{
          backgroundImage: coverImg
            ? `url(${coverImg})`
            : `url("https://picsum.photos/id/1015/800/400")`,
        }}
        className="pics__header overflow-hidden relative md:h-[100vh] h-[50vh] bg-gray-800"
      >
        <div className={`absolute inset-0 text-white flex p-4 md:p-8 ${getPositionClasses()}`}>
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
              <button
                onClick={() => setIsOpen(true)}
                className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base"
              >
                Face Scan
              </button>
              {capturedImage && (
                <button
                  onClick={() => setWhichView("faceScanResults")}
                  className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base"
                >
                  View Face Scan Results
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-start justify-center overflow-hidden">
          <div className={`transition-transform duration-500 ease-in-out transform mt-10 w-full max-w-md ${showFormAnimated ? "translate-y-0" : "-translate-y-full"}`}>
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

      {whichView === "faceScanResults" && capturedImage && (
        <ClientPhotosView
          image={capturedImage}
          eventId={currentEvent?._id}
          subEventId={currentSubEvent?._id}
          eventName={currentEvent?.eventName}
          accessToken={accessToken}
          authUser={authUser}
          s3Keys={s3Keys}
        />
      )}

      <FaceRecognitionPopup
        isOpen={isOpen}
        onCancel={handleClose}
        onCapture={handleCapture}
        onSubmit={handleSubmit}
        webcamRef={webcamRef}
        capturedImage={capturedImage}
      />

      <LoaderModal message="Processing Your Image..." isOpen={loader} />
      <ErrorModal onClose={() => setError("")} isOpen={!!error} message={error} />
    </>
  );
};

export default Clientview;
