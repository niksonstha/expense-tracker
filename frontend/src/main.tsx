import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./features/auth/auth.context";

import "./index.css";
import { AppRouter } from "./routes/AppRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
