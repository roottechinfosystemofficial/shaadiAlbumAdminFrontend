import React from "react";
import {
  Star,
  ScanFace,
  Rocket,
  Crown,
  ShieldCheck,
  Check,
  Database,
} from "lucide-react";
import CreateSubscriptionModal from "../ClientSideComponent/Popups/AddPlanSubscriptionModel";
import { useState } from "react";
import SubscriptionConfirmedModal from "../ClientSideComponent/Popups/SubscriptionConfirmModal";

const plans = [
  {
    name: "Plan 1",
    price: "₹599 (3 Months)",
    features: ["5 GB Storage", "50 Face Recognition"],
    icon: Star,
    gradient: "from-gray-300 to-gray-100",
  },
  {
    name: "Plan 2",
    price: "₹1,499 (1 Year)",
    features: [
      "20 GB Storage",
      "100 Face Recognition",
      "Unlimited E-Album",
    ],
    icon: ScanFace,
    gradient: "from-green-400 to-emerald-500",
  },
  {
    name: "Plan 3",
    price: "₹3,499 (1 Year)",
    features: [
      "40 GB Storage",
      "Unlimited QR Code Design",
      "250 Face Recognition",
    ],
    icon: Rocket,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Plan 4",
    price: "₹7,499 (6 Months)",
    features: [
      "60 GB Storage",
      "250 Face Recognition",
      "Unlimited QR Code Design",
      "Unlimited E-Album",
      "CRM Portal",
    ],
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Plan 5",
    price: "₹15,000 (1 Year)",
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
    icon: ShieldCheck,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    name: "Plan 6",
    price: "₹15,000 (1 Year)",
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
    icon: Database,
    gradient: "from-fuchsia-500 to-rose-500",
  },
];

const SubscriptionCard = ({ plan,onChoosePlan }) => {
  const Icon = plan.icon;
  return (
    <div
      className={`bg-gradient-to-br ${plan.gradient} min-w-[300px] max-w-[300px] h-[400px] 
      rounded-2xl p-6 shadow-lg text-white transition-transform duration-300 
      animate-float animate-pulseGlow flex flex-col justify-between`}
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

      <div className="mt-4">
        <button onClick={onChoosePlan}
          className="w-full py-2 px-4 bg-white text-black font-semibold rounded-lg
          transition-all duration-300 ease-in-out shadow-md"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};

const SubscriptionPlans = () => {
  const[plan,setPlan]=useState(null)

  const setCurrentPlan=(p)=>{
    setPlan(p)
  }
  return (
    <div className="max-w-full overflow-x-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-8">
        AI Face Scan Subscription Plans
      </h2>
      <div className="flex space-x-6">
        {plans.map((plan) => (
          <SubscriptionCard onChoosePlan={()=>{setCurrentPlan(plan)}}  key={plan.name} plan={plan} />
        ))}
      </div>
      <CreateSubscriptionModal onClose={()=>{setCurrentPlan(null)}} selectedPlan={plan} isOpen={plan!=null}/>
      <SubscriptionConfirmedModal isOpen={false}/>
    </div>
  );
};

export default SubscriptionPlans;
