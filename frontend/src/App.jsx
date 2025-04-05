import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Notfound from "./pages/Notfound";
import EventlistPage from "./pages/EventlistPage";
import Setting from "./pages/Setting";
import PersonalFolder from "./pages/PersonalFolder";

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
        element: <Setting />,
      },
      {
        path: "/personalfolder/:folderId",
        element: <PersonalFolder />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <Notfound /> },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
