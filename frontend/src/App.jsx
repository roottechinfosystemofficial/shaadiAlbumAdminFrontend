import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/signup", element: <Signup /> },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
