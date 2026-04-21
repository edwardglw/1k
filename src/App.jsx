import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Onboarding from "./screens/onboarding";
import Dashboard from "./screens/dashboard";
import { useEffect } from "react";

function DevSeed() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("fr_profile", JSON.stringify({ displayName: "Eddie", ambition: "1K", activity: "light", age: "32", gender: "male", height: "178", weight: "82", targetWeight: "-5", injuries: ["ok"], reward: "New trainers", calorieAllowance: 2150 }));
    localStorage.setItem("fr_progress", JSON.stringify({ currentWeek: 3, sessionsDone: { "w1-s0": true, "w1-s1": true, "w1-s2": true, "w2-s0": true, "w2-s1": true, "w2-s2": true, "w3-s0": true }, weighIns: [{ week: 1, value: 82 }, { week: 2, value: 81.2 }], badges: [{ type: "week_1_complete", label: "Week 1 done", message: "First week done", earnedAt: 0 }], startWeight: 82, programmeStarted: true, programmeComplete: false }));
    navigate("/dashboard", { replace: true });
  }, []);
  return null;
}

function AppRoutes() {
  const { progress } = useUser();
  const started = progress?.programmeStarted;

  return (
    <Routes>
      <Route path="/dev" element={<DevSeed />} />
      <Route path="/" element={started ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
      <Route path="/dashboard" element={started ? <Dashboard /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
