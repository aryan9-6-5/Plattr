import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GlobalErrorBoundary from "./components/ui/GlobalErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
