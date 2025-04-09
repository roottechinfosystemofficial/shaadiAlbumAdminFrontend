import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Notfound from "./pages/Notfound";
import EventlistPage from "./pages/EventlistPage";
import PersonalFolder from "./pages/PersonalFolder";
import MainSetting from "./pages/MainSetting";
import EventSetting from "./pages/EventSetting";
import Clientview from "./pages/Clientview";
import  Users  from "./pages/Users";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/event",
        element: <EventlistPage />,
      },
      {
        path: "/setting",
        element: <MainSetting />,
      },
      {
        path: "/personalfolder/:folderId",
        element: <PersonalFolder />,
      },
      {
        path: "/eventsetting",
        element: <EventSetting />,
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/:id/clientview",
    element: <Clientview />,
  },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <Notfound /> },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
