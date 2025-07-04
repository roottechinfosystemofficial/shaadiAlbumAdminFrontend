import React from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Notfound from "./pages/Notfound";
import EventlistPage from "./pages/EventlistPage";
import PersonalFolder from "./pages/PersonalFolder";
import MainSetting from "./pages/MainSetting";
import EventSetting from "./pages/EventSetting";
import Clientview from "./pages/Clientview";
import Users from "./pages/Users";
import MyProfile from "./pages/Myprofile";
import StandyShow from "./pages/StandyShow";
import FlipbookShow from "./component/Personalfoldercomponent/FlipbookShow";
import NavLayout from "./component/NavLayout";
import MainLayout from "./component/MainLayout";
import PublicOnlyRoute from "./component/PublicOnlyRoute";
import ProtectedRoute from "./component/ProtectedRoute";
import { FaceRecognitionHistory } from "./component/FaceRecognitionHistory";
import SubscriptionPlans from "./component/SubSriptions/SubScriptionPlans";
import { getPlanSubscriptionInfo } from "./Redux/thunkfunctions/plansubscription";
import { store } from "./Redux/Store";
import { useEffect } from "react";
import { BASEURI } from "./constant";
import PlanExpiredPopup from "./component/ClientSideComponent/Popups/PlanExpiredModal";
import SubscriptionDeactivatedModal from "./component/ClientSideComponent/Popups/PlanStatsShowModal";
import { useDispatch, useSelector } from "react-redux";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Global layout
    children: [
      // ✅ Protected area (requires auth)
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <NavLayout />,
            children: [
              { path: "/", element: <Dashboard /> },
              { path: "event", element: <EventlistPage /> },
              { path: "setting", element: <MainSetting /> },
              { path: "personalfolder/:eventId", element: <PersonalFolder /> },
              { path: "eventsetting", element: <EventSetting /> },
              { path: "users", element: <Users /> },
              { path: "myprofile", element: <MyProfile /> },
              { path: "standyshow", element: <StandyShow /> },
            ],
          },
          // ✅ Flipbook user view (only after login)
        ],
      },

      // 🔓 Public pages (but block if already logged in)
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <Signup /> },
        ],
      },

      // 🌐 External client view (no auth needed)
      { path: ":eventId/clientview", element: <Clientview /> },

      { path: "*", element: <Notfound /> },
      {
        path: "history", element: <FaceRecognitionHistory />
      },
      {
        path: "subscription-plan", element: <SubscriptionPlans />
      }
    ],
  },
  {
    path: "flipbookUser/:eventId/:flipBookId",
    element: <FlipbookShow />,
  },
]);

const App = () => {

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.authUser?._id);

  // ✅ Subscribe to the updated Redux values here
  const { planExpired, isActive } = useSelector(
    (state) => state.subscription.subscriptionState
  );

  const getPlan=async()=>{
    await dispatch(getPlanSubscriptionInfo({id:userId}))
  }

  useEffect(()=>{
    getPlan()
  },[])



  useEffect(() => {

    const eventSource = new EventSource(`${BASEURI}/sse-events`);

    eventSource.onopen = (ev) => {
      console.log("opned event", ev)
    }

    eventSource.addEventListener("subscription_deactivated", async(event) => {
      const data = JSON.parse(event.data);
      await dispatch(getPlanSubscriptionInfo({id:userId}))
      console.log("Received subscription deactivated", data);
    });

    eventSource.addEventListener("plan_expired", async(event) => {
      const data = JSON.parse(event.data);
      await dispatch(getPlanSubscriptionInfo({id:userId}))
      console.log("Received subscription deactivated", data);
    });


    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [userId]);



  return (
    <React.Fragment>
      <PlanExpiredPopup
        onUpgrade={() => (window.location.href = "/subscription-plan")}
        isOpen={planExpired}
      />
      <SubscriptionDeactivatedModal
        isOpen={!isActive}
      />
      <RouterProvider router={appRouter} />
    </React.Fragment>
  );
};

export default App;
