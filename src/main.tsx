import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./LandingPage.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserPage from "./UserPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/user/:userId", element: <UserPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
