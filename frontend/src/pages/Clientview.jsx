import React, { useState, useEffect, useRef } from "react";
import "../css/Clientview.css";
import { useDispatch, useSelector } from "react-redux";
import ClientForm from "../component/ClientForm";
import apiRequest from "../utils/apiRequest";
import { CLIENTVU_API_END_POINT, S3_API_END_POINT } from "../constant";
import Cookies from "js-cookie";
import ClientPhotosView from "../component/ClientSideComponent/ClientPhotosView";
import { setCoverImg } from "../Redux/Slices/CoverImgSlice";
import FaceRecognitionPopup from "../../../App/src/Components/FaceCaptureModal";
import toast from "../utils/toast";
import { setImagePath } from "../Redux/Slices/S3Images";
import LoaderModal from "../component/LoadingModal";
import ErrorModal from "../component/UsersComponent/ErrorModal";
const Clientview = () => {
  const webcamRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const[loader,setLoader]=useState(false)
    const [error, setError] = useState("");
  
  const [capturedImage, setCapturedImage] = useState(null);
    const { currentEvent, currentSubEvent } = useSelector((state) => state.event);


  const s3Images=useSelector(state=>state.s3Images.s3Keys)

  const s3Keys=s3Images?.map((i)=>(`eventimages/${currentEvent?._id}/${currentSubEvent?._id}/Original/${i.filename}`))


  console.log("s3Keys:",s3Keys)

  const { accessToken,authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { position, coverImg } = useSelector((state) => state.coverImg);

  const [showForm, setShowForm] = useState(false);
  const [showFormAnimated, setShowFormAnimated] = useState(false);
  const [whichView, setWhichView] = useState("");
  const [animateUnderView, setAnimateUnderView] = useState(false);

  // Setup webcam
  useEffect(() => {
    if (isOpen && webcamRef.current && !capturedImage) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          webcamRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera access error:", err);
        });
    }
  }, [isOpen, capturedImage]);

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    canvas.getContext("2d").drawImage(webcamRef.current, 0, 0);
    const image = canvas.toDataURL("image/png");
    setCapturedImage(image);
    dispatch(setImagePath(image))
    webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
  };

  const handleSubmit = async () => {
    if (!capturedImage || !currentEvent?._id || !currentSubEvent?._id) return;
          setLoader(true)

    try {
      toast.loading("Uploading captured image...");
      setError('')
  
      // Step 1: Convert base64 -> Blob -> File
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], "face-scan.png", { type: blob.type });
  
      // Step 2: Get Presigned URL
      const urlResponse = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/get-presigned-url`,
        {
          eventId: currentEvent._id,
          subEventId: currentSubEvent._id,
          files: [
            {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            },
          ],
        },
        accessToken,
        dispatch
      );
  
      const presignedUrl = urlResponse?.data?.urls?.[0]?.url;
      const uploadedS3Key = urlResponse?.data?.urls?.[0]?.key;
  
      if (!presignedUrl || !uploadedS3Key) {
        toast.dismiss();
        toast.error("Failed to get upload URL ❌");
        return;
      }
  
      // Step 3: Upload file to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
  
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        toast.dismiss();
        toast.error("Upload failed ❌");
        console.error("Upload failed:", errText);
        return;
      }
  
      toast.dismiss();
      toast.success("Image uploaded ✅");
  
      // Step 4: Call backend to match face
      // const matchRes = await apiRequest(
      //   "POST",
      //   `${S3_API_END_POINT}/face-recognition/match`,
      //   {
      //     eventId: currentEvent._id,
      //     subEventId: currentSubEvent._id,
      //     image: capturedImage, // base64 version for Rekognition
      //     // optionally also send uploadedS3Key if backend supports matching with both
      //     // uploadedImageKey: uploadedS3Key,
      //     s3Keys:s3Keys,
      //     userId:authUser?._id,
      //     eventName:currentEvent?.eventName
      //   },
      //   accessToken,
      //   dispatch
      // );
      dispatch(setCoverImg(capturedImage))
  
      //await setCoverImageByFetching(); // Refresh background image
  
      // Close UI
      setIsOpen(false);
     // setCapturedImage(null);
      setLoader(false)
      setError('')
    } catch (err) {
      console.error("Upload error:", err);
      toast.dismiss();
      setError("Something went wrong ❌")
      toast.error("Something went wrong ❌");
            setLoader(false)

    }
    finally{
            setLoader(false)

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

  const setCoverImageByFetching = async () => {
    try {
      const response = await apiRequest(
        "GET",
        `${S3_API_END_POINT}/cover-image?eventId=${currentEvent?._id}&subEventId=${currentSubEvent?._id}`
      );
      dispatch(setCoverImg(response.data.url));
    } catch (error) {
      console.log("cover image fetch error", error);
    }
  };

  useEffect(() => {
    setCoverImageByFetching();
  }, [currentEvent?._id]);

  return (
    <>
      {/* Header section with cover image */}
      <div
        style={{
          backgroundImage:  coverImg?  `url(${coverImg})`:`url("https://picsum.photos/id/1015/800/400")`,
        }}
        className="pics__header overflow-hidden relative md:h-[100vh] h-[50vh] bg-gray-800"
      >
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
              <button
                onClick={() => setIsOpen(true)}
                className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base"
              >
                Face Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client form view */}
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

      {/* Client photo view */}
      {!showForm && whichView === "main" && (
        <div
          id="under-client-view"
          className={`transition-all duration-700 ease-out transform ${
            animateUnderView
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <ClientPhotosView image={capturedImage} setWhichView={setWhichView} />
        </div>
      )}

      {/* Face Recognition Popup: Always Rendered */}
      <FaceRecognitionPopup
        isOpen={isOpen}
        onCancel={handleClose}
        onCapture={handleCapture}
        onSubmit={handleSubmit}
        webcamRef={webcamRef}
        capturedImage={capturedImage}
      />
      <LoaderModal message="Processing Your Image..." isOpen={loader}/>
      <ErrorModal onClose={()=>{setError('')}} isOpen={error!=""} message={error}/>

        
      
    </>
  );
};

export default Clientview;
