import React, { useState } from "react";
import {
  Star,
  ScanFace,
  Rocket,
  Crown,
  ShieldCheck,
  Check,
  Database,
  ArrowLeft,
  Gift
} from "lucide-react";
import CreateSubscriptionModal from "../ClientSideComponent/Popups/AddPlanSubscriptionModel";
import SubscriptionConfirmedModal from "../ClientSideComponent/Popups/SubscriptionConfirmModal";
import TransactionProcessingModal from "../ClientSideComponent/Popups/PaymentLoader";
import PaymentFailedModal from "../ClientSideComponent/Popups/PaymentErrorModal";
import { useSelector, useDispatch } from "react-redux";
import {
  initiatePayment,
  createSubscription,
} from "../../Redux/thunkfunctions/plansubscription";
import { setSubScriptionState } from "../../Redux/Slices/planSubscriptionSlice";
import { useNavigate, useNavigation } from "react-router-dom";
import { printReceipt } from "../../utils/printReceipt";

// Plan data
const plans = [
  // 🚀 Free Trial Plan
  

  {
    name: "Plan 1",
    price: "₹599 (3 Months)",
    subScriptionPrice: 599,
    icon: Star,
    gradient: "from-gray-300 to-gray-100",
    features: ["5 GB Storage", "50 Face Recognition"],
    storageLimitGB: 5,
    faceRecognitionLimit: 50,
    qrDesignLimit: 0,
    eAlbumLimit: 0,
    crmAccess: false,
    watermarkAccess: false,
    albumPhotoSelection: false,
    imageDownloadControl: false,
    durationInMonths: 3,
  },
  {
    name: "Plan 2",
    price: "₹1,499 (1 Year)",
    subScriptionPrice: 1499,
    icon: ScanFace,
    gradient: "from-green-400 to-emerald-500",
    features: ["20 GB Storage", "100 Face Recognition", "Unlimited E-Album"],
    storageLimitGB: 20,
    faceRecognitionLimit: 100,
    qrDesignLimit: 0,
    eAlbumLimit: Infinity,
    crmAccess: false,
    watermarkAccess: false,
    albumPhotoSelection: false,
    imageDownloadControl: false,
    durationInMonths: 12,
  },
  {
    name: "Plan 3",
    price: "₹3,499 (1 Year)",
    subScriptionPrice: 3499,
    icon: Rocket,
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "40 GB Storage",
      "Unlimited QR Code Design",
      "250 Face Recognition",
    ],
    storageLimitGB: 40,
    faceRecognitionLimit: 250,
    qrDesignLimit: Infinity,
    eAlbumLimit: 0,
    crmAccess: false,
    watermarkAccess: false,
    albumPhotoSelection: false,
    imageDownloadControl: false,
    durationInMonths: 12,
  },
  {
    name: "Plan 4",
    price: "₹7,499 (6 Months)",
    subScriptionPrice: 7499,
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "60 GB Storage",
      "250 Face Recognition",
      "Unlimited QR Code Design",
      "Unlimited E-Album",
      "CRM Portal",
    ],
    storageLimitGB: 60,
    faceRecognitionLimit: 250,
    qrDesignLimit: Infinity,
    eAlbumLimit: Infinity,
    crmAccess: true,
    watermarkAccess: false,
    albumPhotoSelection: false,
    imageDownloadControl: false,
    durationInMonths: 6,
  },
  {
    name: "Plan 5",
    price: "₹15,000 (1 Year)",
    subScriptionPrice: 15000,
    icon: ShieldCheck,
    gradient: "from-yellow-400 to-orange-500",
    features: [
      "150 GB Storage",
      "Unlimited Face Recognition",
      "Unlimited QR Code Design",
      "Unlimited E-Album",
      "Add Watermarks Function",
      "Album Photo Selection",
      "Image Download Control",
      "CRM Portal",
    ],
    storageLimitGB: 150,
    faceRecognitionLimit: Infinity,
    qrDesignLimit: Infinity,
    eAlbumLimit: Infinity,
    crmAccess: true,
    watermarkAccess: true,
    albumPhotoSelection: true,
    imageDownloadControl: true,
    durationInMonths: 12,
  },
  {
    name: "Plan 6",
    price: "₹29,999 (1 Year)",
    subScriptionPrice: 29999,
    icon: Database,
    gradient: "from-fuchsia-500 to-rose-500",
    features: [
      "400 GB Storage",
      "Unlimited Face Recognition",
      "Unlimited QR Code Design",
      "Unlimited E-Album",
      "Add Watermarks Function",
      "Album Photo Selection",
      "Image Download Control",
      "CRM Portal",
    ],
    storageLimitGB: 400,
    faceRecognitionLimit: Infinity,
    qrDesignLimit: Infinity,
    eAlbumLimit: Infinity,
    crmAccess: true,
    watermarkAccess: true,
    albumPhotoSelection: true,
    imageDownloadControl: true,
    durationInMonths: 12,
  },
];


const SubscriptionCard = ({ plan, onChoosePlan }) => {
  const Icon = plan.icon;
  return (
    <div
      style={{
        cursor: "pointer"
      }}
      onClick={onChoosePlan}
      className={`bg-gradient-to-br ${plan.gradient} min-w-[280px] max-w-full h-[400px]
      rounded-2xl p-6 shadow-xl text-white transition-transform duration-300 
      hover:scale-105 hover:shadow-2xl animate-fadeInUp flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-7 h-7" />
          <h3 className="text-xl font-bold">{plan.name}</h3>
        </div>
        <p className="text-2xl font-semibold mb-2">{plan.price}</p>
        <ul className="text-sm space-y-2">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-1" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onChoosePlan}
        className="mt-4 w-full py-2 bg-white text-black font-semibold rounded-lg transition hover:bg-gray-100"
      >
        Choose Plan
      </button>
    </div>
  );
};

const SubscriptionPlans = () => {
  const [plan, setPlan] = useState(null);
  const [orderId, setOrderId] = useState('')
  const subscriptionState = useSelector((state) => state.subscription.subscriptionState);
  const { authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubscription = async () => {
    if(plan.subScriptionPrice===0){
      dispatch(
              createSubscription({
                userId: authUser?._id,
                orderId,
                planName: plan.name,
                price: plan.subScriptionPrice,
                storageLimitGB: plan.storageLimitGB,
                faceRecognitionLimit: plan.faceRecognitionLimit,
                qrDesignLimit: plan.qrDesignLimit,
                eAlbumLimit: plan.eAlbumLimit,
                crmAccess: plan.crmAccess,
                watermarkAccess: plan.watermarkAccess,
                albumPhotoSelection: plan.albumPhotoSelection,
                imageDownloadControl: plan.imageDownloadControl,
                durationInMonths: plan.durationInMonths,
              })
            );
          
          return;

    }
    try {
      const { paymentSessionId, orderId } = await dispatch(
        initiatePayment({
          userId: authUser?._id,
          amount: plan.subScriptionPrice,
          planName: plan.name,
        })
      ).unwrap();
      setOrderId(orderId)
      dispatch(setSubScriptionState({
        ...subscriptionState,
        paymentId: paymentSessionId,
        orderId: orderId
      }))

      const cashfree = window.Cashfree({ mode: "sandbox" });
      cashfree
        .checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        })
        .then((result) => {
          if (result && !result.error) {
            dispatch(
              createSubscription({
                userId: authUser?._id,
                orderId,
                planName: plan.name,
                price: plan.subScriptionPrice,
                storageLimitGB: plan.storageLimitGB,
                faceRecognitionLimit: plan.faceRecognitionLimit,
                qrDesignLimit: plan.qrDesignLimit,
                eAlbumLimit: plan.eAlbumLimit,
                crmAccess: plan.crmAccess,
                watermarkAccess: plan.watermarkAccess,
                albumPhotoSelection: plan.albumPhotoSelection,
                imageDownloadControl: plan.imageDownloadControl,
                durationInMonths: plan.durationInMonths,
              })
            );
          }
        })
        .catch((err) => {
          console.error("Checkout error:", err);
        });

      setPlan(null);
    } catch (err) {
      console.error("Payment initiation error:", err.message);
    }
  };

  const navigate = useNavigate()

  const onback = () => {
    navigate("/")

  }

  const onCreate = async () => handleSubscription();
  const toggleSubscription = (key, value) => {
    dispatch(setSubScriptionState({ ...subscriptionState, [key]: value }));
  };

  const onContinue = () => {
    toggleSubscription("isConfirmPaymentSuccess", false)

    setPlan(null)
    onback()
  };




  const onPrint = async () => {
    console.log("clicking", authUser)
    onContinue()
    await printReceipt({
      user: authUser,
      plan: subscriptionState.subscriptions,
      orderId: subscriptionState.orderId,
      paymentDate: new Date().toDateString(),
      paymentId: subscriptionState.paymentId

    })

  }

  console.log(subscriptionState.subscriptions)

  const setCurrentPlanInfo = (p) => {
    toggleSubscription("subscriptions", p)
    setPlan(p)

  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🌈 Background Gradient + Shadow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f5e1ff] to-[#ffe0e0] opacity-40 animate-backgroundShift bg-[length:400%_400%] z-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.2)]" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 px-4 py-10  ">
        {/* 🧊 Sticky Header */}
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative">
          <button
            onClick={onback}
            className="flex items-center gap-2 text-sm text-black hover:text-gray-700 transition"
          >
            <ArrowLeft onClick={onback} className="w-15 h-15" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-center w-full absolute left-1/2 transform -translate-x-1/2 text-black">
            Choose Your AI Face Scan Plan
          </h2>

        </div>
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-md py-8 my-10 mb-8 rounded-lg px-6">

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-12">
            {plans.map((p) => (
              <SubscriptionCard key={p.name} plan={p} onChoosePlan={() => setCurrentPlanInfo(p)} />
            ))}
          </div>
        </header>

        {/* 🔲 Plan Grid */}

      </div>

      {/* Modals */}
      <CreateSubscriptionModal
        onCreate={onCreate}
        onClose={() => setPlan(null)}
        selectedPlan={plan}
        isOpen={!!plan}
      />
      <SubscriptionConfirmedModal
        onClose={onContinue}
        onContinue={onContinue}
        onPrint={onPrint}
        isOpen={subscriptionState.isConfirmPaymentSuccess}
      />
      <TransactionProcessingModal isOpen={subscriptionState.subScriptionLoading} />
      <PaymentFailedModal
        message={subscriptionState.subscriptionError}
        onRetry={onCreate}
        isOpen={subscriptionState.subscriptionError !== ""}
      />
    </div>
  );
};

export default SubscriptionPlans;
