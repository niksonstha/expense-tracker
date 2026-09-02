import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./features/auth/auth.context";

import "./index.css";
import { AppRouter } from "./routes/AppRouter";
import { ToastProvider } from "./components/ui/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
