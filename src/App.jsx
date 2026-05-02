import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import LandingPage from "./screens/landing";
import Onboarding from "./screens/onboarding";
import Dashboard from "./screens/dashboard";
import WeekView from "./screens/week";
import Profile from "./screens/profile";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import { useEffect } from "react";
import { T } from "./tokens";

function DevSeed() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("fr_profile", JSON.stringify({ displayName: "Eddie", ambition: "1K", activity: "light", age: "32", gender: "male", height: "178", weight: "82", targetWeight: "-5", injuries: ["ok"], reward: "New trainers", calorieAllowance: 2150 }));
    localStorage.setItem("fr_progress", JSON.stringify({ currentWeek: 3, sessionsDone: { "w1-s0": true, "w1-s1": true, "w1-s2": true, "w2-s0": true, "w2-s1": true, "w2-s2": true, "w3-s0": true }, weighIns: [{ week: 1, value: 82 }, { week: 2, value: 81.2 }], badges: [{ type: "week_1_complete", label: "Week 1 done", message: "First week done", earnedAt: 0 }], startWeight: 82, programmeStarted: true, programmeComplete: false, weekFeedback: {}, walkMult: 1.0, runMult: 1.0 }));
    navigate("/dashboard", { replace: true });
  }, []);
  return null;
}

function SyncErrorBanner({ message, onDismiss }) {
  return (
    <div role="status" aria-live="polite" style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 9999,
      background: T.color.apricotLight,
      borderBottom: `1.5px solid ${T.color.apricot}`,
      padding: "10px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      fontFamily: "'Nunito', sans-serif",
      boxShadow: "0 2px 8px rgba(232,168,124,0.25)",
    }}>
      <div style={{ fontSize: 13, color: T.color.charcoal, fontWeight: 700, flex: 1 }}>
        {message}
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" style={{
        background: "none", border: "none", cursor: "pointer",
        minWidth: 44, minHeight: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 800, color: T.color.charcoalMuted,
        flexShrink: 0,
      }}>×</button>
    </div>
  );
}

function AppRoutes() {
  const { firebaseUser, authLoading, progress, syncError, clearSyncError } = useUser();
  const authed = !!firebaseUser;
  const started = progress?.programmeStarted;

  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: T.color.ivory, fontFamily: "'Nunito', sans-serif",
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: T.color.moss }}>1RUN.UK</div>
      </div>
    );
  }

  return (
    <>
    {authed && syncError && <SyncErrorBanner message={syncError} onDismiss={clearSyncError} />}
    <Routes>
      <Route path="/dev" element={<DevSeed />} />

      {/* Public */}
      <Route path="/" element={authed && started ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/signin" element={authed && started ? <Navigate to="/dashboard" replace /> : authed ? <Navigate to="/onboarding" replace /> : <SignIn />} />
      <Route path="/signup" element={authed && started ? <Navigate to="/dashboard" replace /> : authed ? <Navigate to="/onboarding" replace /> : <SignUp />} />

      {/* Requires auth, onboarding optional */}
      <Route path="/onboarding" element={!authed ? <Navigate to="/signup" replace /> : started ? <Navigate to="/dashboard" replace /> : <Onboarding />} />

      {/* Requires auth + onboarding complete */}
      <Route path="/dashboard" element={!authed ? <Navigate to="/" replace /> : !started ? <Navigate to="/onboarding" replace /> : <Dashboard />} />
      <Route path="/week/:weekNum" element={!authed ? <Navigate to="/" replace /> : !started ? <Navigate to="/onboarding" replace /> : <WeekView />} />
      <Route path="/profile" element={!authed ? <Navigate to="/" replace /> : !started ? <Navigate to="/onboarding" replace /> : <Profile />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}
