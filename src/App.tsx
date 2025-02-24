import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/Landing-page";
import NotFound from "./components/Not-found-404";
import Dashboard from "./components/dashboard/Dashboard";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Toaster } from "../src/components/ui/sonner";
// import ChatPage from "./components/chats/pages/ChatPage";
import ChatBase from "./components/chats/pages/ChatBase";
import LoginSignupPage from "./components/auth/LoginSignUpPage";
// import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-or-signup" element={<LoginSignupPage />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/chats" element={<ChatBase />} />
      </Routes>
      <Toaster duration={1000} closeButton />
    </Provider>
  );
}

export default App;
