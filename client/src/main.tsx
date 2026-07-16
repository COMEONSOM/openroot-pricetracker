import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./theme-init";
import App from "./App";
import { getThemeManager } from "./components/otherfiles/theme";
import "./styles/global.css";

getThemeManager();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
