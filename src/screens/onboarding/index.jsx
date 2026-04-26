import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../tokens";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";
import { useUser } from "../../context/UserContext";

import ScreenAmbition  from "./steps/ScreenAmbition";
import ScreenActivity  from "./steps/ScreenActivity";
import ScreenAboutYou  from "./steps/ScreenAboutYou";
import ScreenWeight    from "./steps/ScreenWeight";
import ScreenInjuries  from "./steps/ScreenInjuries";
import ScreenReward    from "./steps/ScreenReward";
import ScreenPlanReady from "./steps/ScreenPlanReady";

const TOTAL_STEPS = 6;

// Background steps: dark landing green → through design-system greens → ivory
// Stays in green family throughout so CSS transitions don't go grey
const STEP_BGS = ['#0e1410', '#162014', '#1e2e1c', T.color.moss, T.color.sageLight, T.color.ivory];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();

  const [step, setStep]             = useState(0);
  const [animDir, setAnimDir]       = useState(1);
  const [animKey, setAnimKey]       = useState(0);
  const [showPlanReady, setShowPlanReady] = useState(false);
  const [data, setData] = useState({
    ambition: "", activity: "", displayName: "", age: "", gender: "", height: "",
    weight: "", targetWeight: "", injuries: [], reward: "",
  });

  const isUnder18 = parseInt(data.age) >= 14 && parseInt(data.age) < 18;

  const currentBg       = showPlanReady ? T.color.ivory : (STEP_BGS[step] ?? T.color.ivory);
  const isDark          = !showPlanReady && step <= 3;
  const titleCol        = isDark ? "#FAF7F2"                     : T.color.charcoal;
  const subCol          = isDark ? "rgba(250,247,242,0.72)"      : T.color.charcoalMuted;
  const navIconCol      = isDark ? "#FAF7F2"                     : T.color.charcoal;
  const progressTrackBg = isDark ? "rgba(250,247,242,0.18)"      : T.color.ivoryDark;
  const stepLabelCol    = isDark ? "rgba(250,247,242,0.50)"      : T.color.charcoalMuted;

  const canAdvance = () => {
    switch (step) {
      case 0: return !!data.ambition;
      case 1: return !!data.activity;
      case 2: return !!data.displayName && !!data.age && !!data.gender && !!data.height;
      case 3: return isUnder18 || !data.weight || data.targetWeight !== "";
      case 4: return data.injuries.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const goTo = (newStep) => {
    setAnimDir(newStep > step ? 1 : -1);
    setAnimKey((k) => k + 1);
    setStep(newStep);
    setShowPlanReady(false);
  };

  const next = () => {
    if (!canAdvance()) return;
    if (step === 2 && isUnder18) { goTo(4); return; }
    if (step < TOTAL_STEPS - 1)  { goTo(step + 1); return; }
    if (step === TOTAL_STEPS - 1) {
      setAnimDir(1); setAnimKey((k) => k + 1); setShowPlanReady(true);
    }
  };

  const prev = () => {
    if (showPlanReady) { setShowPlanReady(false); setAnimDir(-1); setAnimKey((k) => k + 1); return; }
    if (step === 4 && isUnder18) { goTo(2); return; }
    if (step > 0) goTo(step - 1);
    else navigate("/");
  };

  const handleStart = () => {
    completeOnboarding(data);
    navigate("/dashboard");
  };

  const screens = [
    <ScreenAmbition  data={data} setData={setData} />,
    <ScreenActivity  data={data} setData={setData} />,
    <ScreenAboutYou  data={data} setData={setData} />,
    <ScreenWeight    data={data} setData={setData} />,
    <ScreenInjuries  data={data} setData={setData} />,
    <ScreenReward    data={data} setData={setData} />,
  ];

  const currentContent = showPlanReady
    ? <ScreenPlanReady data={data} onEdit={(s) => { setShowPlanReady(false); setAnimDir(-1); setAnimKey((k) => k + 1); setStep(s); }} />
    : screens[step];

  const progressValue = showPlanReady ? 1 : step / (TOTAL_STEPS - 1);
  const stepLabel     = showPlanReady ? `${TOTAL_STEPS}/${TOTAL_STEPS}` : `${step + 1}/${TOTAL_STEPS}`;
  const buttonLabel   = showPlanReady ? "Start 1RUN.UK"
    : step === 4 ? "Next"
    : step === 5 ? "Review my plan"
    : "Continue";
  const showSkip = step === 5 && !data.reward;
  const ready    = showPlanReady || canAdvance();

  return (
    <div style={{ minHeight: "100vh", background: currentBg, transition: "background-color 0.5s ease", fontFamily: T.font.body, position: "relative", "--title-col": titleCol, "--sub-col": subCol }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(calc(var(--dir) * 24px)); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; }
        select { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <AtmosphericBG />

      <div style={{ maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1 }}>

        <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
          <button onClick={prev} aria-label="Back" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <Icon type="chevronL" size={22} color={navIconCol} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ height: 4, background: progressTrackBg, borderRadius: T.radius.full, overflow: "hidden", transition: "background 0.5s ease" }}>
              <div style={{
                height: "100%", width: `${progressValue * 100}%`,
                background: `linear-gradient(90deg, ${T.color.sage}, ${T.color.moss})`,
                borderRadius: T.radius.full, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: stepLabelCol, minWidth: 40, textAlign: "right", transition: "color 0.5s ease" }}>{stepLabel}</span>
        </div>

        <div style={{ flex: 1, padding: "24px 24px 0", overflow: "auto", position: "relative", zIndex: 1 }}>
          <div key={animKey} style={{ "--dir": animDir, animation: "slideIn 0.3s ease" }}>
            {currentContent}
          </div>
        </div>

        <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 1 }}>
          <button
            onClick={showPlanReady ? handleStart : next}
            disabled={!ready}
            style={{
              width: "100%", padding: "16px",
              background: ready
                ? `linear-gradient(135deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`
                : T.color.ivoryDark,
              color: ready ? T.color.white : T.color.charcoalLight,
              border: "none", borderRadius: T.radius.lg,
              fontSize: 15, fontWeight: 800, fontFamily: T.font.display,
              cursor: ready ? "pointer" : "default",
              transition: "all 0.2s ease",
              boxShadow: ready ? `0 6px 20px ${T.color.moss}44` : "none",
            }}
          >
            {buttonLabel}
          </button>
          {showSkip && (
            <button onClick={() => { setAnimDir(1); setAnimKey((k) => k + 1); setShowPlanReady(true); }} style={{
              background: "none", border: "none", fontSize: 13, fontWeight: 600, color: T.color.charcoalMuted,
              cursor: "pointer", padding: "8px 0",
            }}>
              Skip — I'll set a reward later
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
