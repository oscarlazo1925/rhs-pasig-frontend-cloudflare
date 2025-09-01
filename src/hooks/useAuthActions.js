// hooks/useAuthActions.js
import { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export function useAuthActions(setUser) {
  const [loginText, setLoginText] = useState(false);
  const navigate = useNavigate();

  // 🔹 Google login
  const handleGoogleLogin = async () => {
    setLoginText(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await axiosInstance.post("/auth/google", { token: idToken });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setLoginText(false);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    setLoginText(false);
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { handleGoogleLogin, handleLogout, loginText };
}
