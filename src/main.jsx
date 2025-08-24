
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";   // ✅ Add this line

// 👉 Import the PWA service worker register helper
import { registerSW } from "virtual:pwa-register";

// 👉 Register service worker (auto updates + offline support)
registerSW({
  onNeedRefresh() {
    console.log("🔄 New version available, refresh to update.");
  },
  onOfflineReady() {
    console.log("✅ App is ready to work offline!");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/rhs-pasig-frontend">
      <App />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
