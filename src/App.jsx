import { Button, Container, Navbar, Card, Nav, Spinner } from "react-bootstrap";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import axiosInstance from "./axiosInstance";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Profile from "./pages/Profile";
import NavbarTop from "./components/NavbarTop";
import ScanPage from "./pages/ScanPage";


function Home({ user, handleGoogleLogin, loginText }) {
  console.log(loginText, "loginText");
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Welcome</h3>
        {!user ? (
          <div className="d-flex justify-content-center">
            <Button
              variant="danger"
              onClick={handleGoogleLogin}
              className="w-50"
              disabled={loginText} // 🔹 disable while logging in
            >
              {loginText ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Logging in...
                </>
              ) : (
                "Sign in with Google"
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={user.photo}
              alt="avatar"
              className="rounded-circle mb-3"
              width="80"
            />
            <h5>{user.displayName}</h5>
            <p className="text-muted">{user.email}</p>
            <Button
              as={Link}
              to="/profile"
              className="w-100 mt-3"
              variant="secondary"
            >
              Check Profile
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
}

function Dashboard({ user, handleLogout }) {
  return (
    <Container className="mt-5 text-center">
      <h2>Dashboard</h2>
      <p>Welcome back, {user.displayName} 🎉</p>
      <Button variant="secondary" onClick={handleLogout} className="mt-3">
        Logout
      </Button>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loginText, setLoginText] = useState(false);
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
          // const res = await axios.post(
          //   `${import.meta.env.VITE_API_URL}/auth/google`,
          //   { token: idToken }
          // );
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

  const handleGoogleLogin = async () => {
    setLoginText(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // const res = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/auth/google`,
      //   { token: idToken }
      // );

      const res = await axiosInstance.post("/auth/google", { token: idToken });
      // console.log(res,'res')
      // ✅ Save to localStorage
      // localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setLoginText(false); // 🔹 re-enable button
    }
  };

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
