import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../tokens";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";
import BenefitsModal from "../../components/BenefitsModal";
import { useUser } from "../../context/UserContext";

import ScreenWelcome from "./steps/ScreenWelcome";
import ScreenAmbition from "./steps/ScreenAmbition";
import ScreenActivity from "./steps/ScreenActivity";
import ScreenAboutYou from "./steps/ScreenAboutYou";
import ScreenWeight from "./steps/ScreenWeight";
import ScreenInjuries from "./steps/ScreenInjuries";
import ScreenReward from "./steps/ScreenReward";
import ScreenPlanReady from "./steps/ScreenPlanReady";

const TOTAL_STEPS = 7;

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();

  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [showPlanReady, setShowPlanReady] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [data, setData] = useState({
    ambition: "", activity: "", displayName: "", age: "", gender: "", height: "",
    weight: "", targetWeight: "", injuries: [], reward: "",
  });

  const isWelcome = step === 0;

  const canAdvance = () => {
    switch (step) {
      case 0: return true;
      case 1: return !!data.ambition;
      case 2: return !!data.activity;
      case 3: return !!data.displayName && !!data.age && !!data.gender && !!data.height;
      case 4: return !!data.weight && data.targetWeight !== "";
      case 5: return data.injuries.length > 0;
      case 6: return true;
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
    if (step < TOTAL_STEPS - 1 && canAdvance()) goTo(step + 1);
    else if (step === TOTAL_STEPS - 1 && canAdvance()) {
      setAnimDir(1); setAnimKey((k) => k + 1); setShowPlanReady(true);
    }
  };

  const prev = () => {
    if (showPlanReady) { setShowPlanReady(false); setAnimDir(-1); setAnimKey((k) => k + 1); }
    else if (step > 0) goTo(step - 1);
  };

  const handleStart = () => {
    completeOnboarding(data);
    navigate("/dashboard");
  };

  const screens = [
    <ScreenWelcome onNext={next} onOpenModal={() => setShowBenefitsModal(true)} />,
    <ScreenAmbition data={data} setData={setData} />,
    <ScreenActivity data={data} setData={setData} />,
    <ScreenAboutYou data={data} setData={setData} />,
    <ScreenWeight data={data} setData={setData} />,
    <ScreenInjuries data={data} setData={setData} />,
    <ScreenReward data={data} setData={setData} />,
  ];

  const currentContent = showPlanReady
    ? <ScreenPlanReady data={data} onEdit={(s) => { setShowPlanReady(false); setAnimDir(-1); setAnimKey((k) => k + 1); setStep(s); }} />
    : screens[step];

  const progressValue = showPlanReady ? 1 : step / (TOTAL_STEPS - 1);
  const stepLabel = showPlanReady ? `${TOTAL_STEPS - 1}/${TOTAL_STEPS - 1}` : `${step}/${TOTAL_STEPS - 1}`;
  const buttonLabel = showPlanReady ? "Start FirstRun"
    : step === 5 ? "Next"
    : step === 6 ? "Review my plan"
    : "Continue";
  const showSkip = step === 6 && !data.reward;
  const ready = showPlanReady || canAdvance();

  return (
    <div style={{ minHeight: "100vh", background: T.color.ivory, fontFamily: T.font.body, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateX(calc(var(--dir) * 24px)); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; }
        select { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <AtmosphericBG />

      {/* Content constrained to 430px, background bleeds full width */}
      <div style={{ maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1 }}>

      {!isWelcome && (
        <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
          <button onClick={prev} aria-label="Back" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <Icon type="chevronL" size={22} color={T.color.charcoal} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ height: 4, background: T.color.ivoryDark, borderRadius: T.radius.full, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progressValue * 100}%`,
                background: `linear-gradient(90deg, ${T.color.sage}, ${T.color.moss})`,
                borderRadius: T.radius.full, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted, minWidth: 40, textAlign: "right" }}>{stepLabel}</span>
        </div>
      )}

      <div style={{ flex: 1, padding: "24px 24px 0", overflow: "auto", position: "relative", zIndex: 1 }}>
        <div key={animKey} style={{ "--dir": animDir, animation: "slideIn 0.3s ease" }}>
          {currentContent}
        </div>
      </div>

      {!isWelcome && (
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
      )}

      </div>{/* end content wrapper */}

      {showBenefitsModal && <BenefitsModal onClose={() => setShowBenefitsModal(false)} />}
    </div>
  );
}
