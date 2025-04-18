import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
              { path: "personalfolder/:folderId", element: <PersonalFolder /> },
              { path: "eventsetting", element: <EventSetting /> },
              { path: "users", element: <Users /> },
              { path: "myprofile", element: <MyProfile /> },
              { path: "standyshow", element: <StandyShow /> },
            ],
          },
          // ✅ Flipbook user view (only after login)
          { path: "flipbookUser", element: <FlipbookShow /> },
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
      { path: ":id/clientview", element: <Clientview /> },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
