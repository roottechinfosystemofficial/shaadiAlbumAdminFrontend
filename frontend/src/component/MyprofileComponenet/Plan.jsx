import React from "react";
import logo from "../../assets/logo_1.png";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { store } from "../../Redux/Store";
import { getPlanSubscriptionInfo } from "../../Redux/thunkfunctions/plansubscription";
import { Printer, Receipt } from "lucide-react";
import { printReceipt } from "../../utils/printReceipt";
const Plan = () => {
  const subscriptionState = useSelector((state) => state.subscription.subscriptionState)

 
  const {authUser}=useSelector(state=>state.user)

  const getSubScriptionInfo = async () => {
    await store.dispatch(getPlanSubscriptionInfo({ id: store.getState().user.authUser?._id }))

  }
  useEffect(() => {
    getSubScriptionInfo()
  }, [])
     const info=   subscriptionState.subscriptions

     console.log("info",info)


  const onPrintReceipt=()=>{
    const createdDate = new Date(info.createdAt);
const endDate = new Date(info.endDate);

const durationInMonths =
  (endDate.getFullYear() - createdDate.getFullYear()) * 12 +
  (endDate.getMonth() - createdDate.getMonth());


    const plan={
      name : info?.planName,
      subscriptionPrice:info?.price,
      durationInMonths:durationInMonths}
  
     printReceipt({
      user:authUser,
      plan:plan,
      paymentId:subscriptionState.paymentId,
      paymentDate:new Date().toDateString(),
      orderId:subscriptionState.orderId
     })
  }
  return (
    <div className="px-6 py-2  rounded-lg max-w-6xl mx-auto bg-white">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{info?.planName}</h1>

      {/* Plan Card */}
      <div className=" rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-2">
          {/* Left - Image and Name */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
              <img
                src={logo}
                alt="Plan Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-gray-800 text-lg font-medium leading-tight">
              Shaadi Album <br />
              <span className="text-sm font-normal text-gray-500">Free</span>
            </div>
          </div>

          {/* Middle - Storage Info */}
          <div className="flex flex-col w-full md:w-[40%]">
            <div className="flex justify-between text-sm mb-1">
              <span>Images</span>
              <span className="text-slate-dark">{((subscriptionState?.subscriptions?.usedStorageInBytes)/(1024*1024))?.toFixed(2)} MB / {subscriptionState?.subscriptions?.storageLimitGB*1024} MB</span>
            </div>
            <div className="w-full h-2 bg-slate-dark rounded-md overflow-hidden">
              <div className="w-[20%] h-full bg-primary" />
            </div>
          </div>

          {/* Right - Button */}
          <div className="flex flex-row gap-4 items-center w-full md:w-auto">

            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition w-full md:w-auto">
              Manage Plan
            </button>
            <button onClick={onPrintReceipt}
  className="px-6 py-3 text-white rounded-full font-semibold shadow-sm hover:shadow-md transition hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
>
  <Receipt className="w-5 h-5" />
  Print Receipt
</button>

          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-sm text-gray-600 mt-3">
          * After your subscription ends, a 15-day countdown will commence
          before your data is securely removed.
        </p>
      </div>
    </div>
  );
};

export default Plan;
