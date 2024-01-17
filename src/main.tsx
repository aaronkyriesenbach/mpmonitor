import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage.tsx";
import UserPage from "./UserPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/user/:id", element: <UserPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
