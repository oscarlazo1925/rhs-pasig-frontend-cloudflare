import { Container, Spinner } from "react-bootstrap";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import axiosInstance from "./axiosInstance";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Profile from "./pages/Profile";
import NavbarTop from "./components/NavbarTop";
import ScanPage from "./pages/ScanPage";
import Dashboard from "./components/dashboard";
import Home from "./pages/Home";

import { useAuthActions } from "./hooks/useAuthActions"; // 👈 import custom hook

//
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { handleGoogleLogin, handleLogout, loginText } =
    useAuthActions(setUser);

  // 🔹 Load token from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();

        try {
          const res = await axiosInstance.post("/auth/google", {
            token: idToken,
          });

          // ✅ Store in localStorage
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);

          setUser(res.data.user);
        } catch (err) {
          console.error("Backend sync failed:", err);
        }
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" style={{ width: "4rem", height: "4rem" }} />
      </Container>
    );
  }

  return (
    <>
      <NavbarTop
        user={user}
        handleGoogleLogin={handleGoogleLogin}
        handleLogout={handleLogout}
        loginText={loginText}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              handleGoogleLogin={handleGoogleLogin}
              loginText={loginText}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scan"
          element={
            <ProtectedRoute user={user}>
              <ScanPage user={user} />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/scan" element={<ScanPage />} /> 👈 new page */}
      </Routes>
    </>
  );
}

export default App;
