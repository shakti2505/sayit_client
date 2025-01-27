// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </HashRouter>
);
