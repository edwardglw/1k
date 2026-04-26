import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { go } from "../../lib/navigate";
import { T } from "../../tokens";
import { WEEKS } from "../../data/programme";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";
import WeekButton from "../../components/WeekButton";
import GoalPanel from "../../components/GoalPanel";
import WeightGraph from "../../components/ui/WeightGraph";
import WeightLogSheet from "../../components/WeightLogSheet";
import ShareSheet from "../../components/ShareSheet";

const APP_URL = "https://1k-beta.vercel.app";

const LIFESTYLE_TIPS = [
  { icon: "flame", color: T.color.apricot, bg: T.color.apricotLight, title: "Eat back what you burn", body: "When you run, eat back those calories — all of them. This is a sustainable plan, not a crash diet." },
  { icon: "utensils", color: T.color.moss, bg: T.color.sageLight, title: "Fuel before you move", body: "A small snack 60–90 minutes before a session keeps energy steady. A banana or oat-based snack works well." },
  { icon: "heart", color: T.color.sky, bg: T.color.skyLight, title: "Protein after every run", body: "Aim for 15–20g of protein within an hour of finishing. It helps muscles recover and reduces next-day fatigue." },
  { icon: "clock", color: T.color.moss, bg: T.color.sageLight, title: "Sleep is part of the plan", body: "Your body repairs and adapts while you sleep. Seven to nine hours helps you get more from every session." },
  { icon: "target", color: T.color.sky, bg: T.color.skyLight, title: "Rest days are progress too", body: "The improvement happens between sessions, not during them. Easy days are when the body catches up." },
  { icon: "leaf", color: T.color.apricot, bg: T.color.apricotLight, title: "Stay hydrated throughout the day", body: "Most people underestimate how much hydration affects energy and mood. Aim for water before you feel thirsty." },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const MOTIV_LINES = [
  (u, s) => `${s.sessionsRemaining} sessions left this week — you've got this`,
  (u, s) => `${s.sessionsToGo} sessions to your first 1K`,
  (u, s) => `${s.weeksCompleted} weeks done already. Keep going.`,
  () => "You're stronger than you were last week",
  () => "Every step is one more than yesterday",
];

const TUTORIAL_CARDS = [
  { icon: "calendar", color: T.color.sage, title: "How to use this app", body: "Tap a week to see its sessions. Log each one when you complete it." },
  { icon: "scale", color: T.color.sky, title: "Track your progress", body: "Log your weight each week. Your daily calorie target is set to your goal — eat them all." },
  { icon: "trophy", color: T.color.apricot, title: "Run your first 1K", body: "Complete all 18 sessions and cross the finish line. Tap Goals & badges to see what you're working towards." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const onProfile = location.pathname === "/profile";
  const { profile, progress, getWeekStatus, isSessionDone, logWeighIn, hasWeighedInThisWeek, totalSessions, sessionsCompleted, isUnder18 } = useUser();

  const [showGoalPanel, setShowGoalPanel] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showWeightSheet, setShowWeightSheet] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [tutorialFading, setTutorialFading] = useState(false);
  const [motivLine] = useState(() => {
    const weeksCompleted = WEEKS.filter((_, i) => getWeekStatus(i + 1) === "complete").length;
    const sessionsRemaining = WEEKS[progress.currentWeek - 1]?.sessions.filter((_, i) => !isSessionDone(progress.currentWeek, i)).length ?? 0;
    const s = { weeksCompleted, sessionsRemaining, sessionsToGo: totalSessions - sessionsCompleted };
    return MOTIV_LINES[Math.floor(Math.random() * MOTIV_LINES.length)](profile, s);
  });

  const weeksCompleted = WEEKS.filter((_, i) => getWeekStatus(i + 1) === "complete").length;
  const progressPct = Math.round((progress.currentWeek / WEEKS.length) * 100);
  const latestWeighIn = progress.weighIns.length ? progress.weighIns[progress.weighIns.length - 1].value : null;

  const targetWeight = progress.startWeight && profile.targetWeight !== ""
    ? progress.startWeight + parseFloat(profile.targetWeight)
    : null;

  const currentWeekData = WEEKS[progress.currentWeek - 1];

  const rotatingTips = useMemo(() => {
    try {
      const stored = parseInt(localStorage.getItem("fr_tip_idx") || "0", 10);
      const next = (stored + 1) % LIFESTYLE_TIPS.length;
      localStorage.setItem("fr_tip_idx", String(next));
      return [
        LIFESTYLE_TIPS[next % LIFESTYLE_TIPS.length],
        LIFESTYLE_TIPS[(next + 1) % LIFESTYLE_TIPS.length],
        LIFESTYLE_TIPS[(next + 2) % LIFESTYLE_TIPS.length],
      ];
    } catch {
      return LIFESTYLE_TIPS.slice(0, 3);
    }
  }, []);

  const dismissTutorial = () => {
    setTutorialFading(true);
    setTimeout(() => setTutorialDismissed(true), 220);
  };

  const showTutorial = progress.badges.length === 0 && !tutorialDismissed;
  const showLatestBadge = progress.badges.length > 0 && showBadge;

  return (
    <div style={{ minHeight: "100vh", background: T.color.ivory, fontFamily: T.font.body, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tutorialOut { from { opacity: 1; transform: translateY(0); max-height: 200px; } to { opacity: 0; transform: translateY(-6px); max-height: 0; margin-bottom: 0; padding: 0; } }
        @media (min-width: 768px) {
          .db-wrap { max-width: 800px !important; }
          .db-flex-split { display: flex; gap: 12px; align-items: flex-start; }
          .db-split-left { flex: 1; min-width: 0; margin-bottom: 0 !important; }
          .db-split-right { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
          .db-split-right > * { margin-bottom: 0 !important; }
        }
      `}</style>

      <AtmosphericBG />

      <div className="db-wrap" style={{ maxWidth: 430, margin: "0 auto", position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ padding: "24px 20px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: T.color.charcoalMuted, fontWeight: 600, lineHeight: 1.4 }}>
              {getGreeting()}, <span style={{ fontWeight: 900, color: T.color.charcoal }}>{profile.displayName}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.color.moss, fontFamily: T.font.display, lineHeight: 1.3, marginTop: 2 }}>
              {motivLine}
            </div>
          </div>
          <button
            onClick={() => navigate(onProfile ? "/dashboard" : "/profile")}
            aria-label={onProfile ? "Close profile" : "Edit profile"}
            style={{
              background: T.color.white,
              border: `2px solid ${T.color.moss}`,
              borderRadius: T.radius.full,
              width: 40, height: 40, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", marginLeft: 12,
              boxShadow: `0 2px 6px ${T.color.moss}22, inset 0 1px 0 rgba(255,255,255,0.7)`,
              transition: "all 0.2s ease",
            }}>
            <Icon type={onProfile ? "x" : "user"} size={18} color={T.color.moss} />
          </button>
        </div>
      </div>

      <div style={{ padding: "0 20px", paddingBottom: 24 }}>

        {/* Tutorial card (first-time visitor) */}
        {showTutorial && (() => {
          const card = TUTORIAL_CARDS[tutorialStep];
          const isLast = tutorialStep === TUTORIAL_CARDS.length - 1;
          return (
            <div style={{
              background: T.color.white, borderRadius: T.radius.xl,
              padding: "16px 16px 14px", marginBottom: 12,
              boxShadow: "0 1px 4px rgba(59,63,58,0.06)",
              border: `1.5px solid ${T.color.ivoryDark}`,
              position: "relative",
              animation: tutorialFading ? "tutorialOut 0.22s ease forwards" : "fadeSlide 0.3s ease",
            }}>
              <button onClick={dismissTutorial} aria-label="Dismiss" style={{
                position: "absolute", top: 10, right: 10,
                background: "none", border: "none", cursor: "pointer", padding: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon type="x" size={14} color={T.color.charcoalMuted} />
              </button>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingRight: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: T.radius.md, flexShrink: 0, background: card.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon type={card.icon} size={18} color={card.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{card.title}</div>
                  <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 3, lineHeight: 1.5 }}>{card.body}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {TUTORIAL_CARDS.map((_, i) => (
                    <div key={i} style={{
                      width: i === tutorialStep ? 16 : 6, height: 6,
                      borderRadius: T.radius.full,
                      background: i === tutorialStep ? T.color.moss : T.color.ivoryDark,
                      transition: "all 0.2s",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {tutorialStep > 0 && (
                    <button onClick={() => setTutorialStep(t => t - 1)} style={{
                      background: T.color.ivory, border: "none", borderRadius: T.radius.full,
                      width: 30, height: 30, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon type="chevronL" size={14} color={T.color.charcoalMuted} />
                    </button>
                  )}
                  <button
                    onClick={() => isLast ? navigate("/week/1") : setTutorialStep(t => t + 1)}
                    style={{
                      background: T.color.moss, border: "none", borderRadius: T.radius.full,
                      padding: "6px 14px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.color.white }}>{isLast ? "Got it" : "Next"}</span>
                    {!isLast && <Icon type="chevronR" size={12} color={T.color.white} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Latest Badge */}
        {showLatestBadge && (() => {
          const badge = progress.badges[progress.badges.length - 1];
          return (
            <div style={{
              background: `linear-gradient(135deg, ${T.color.apricotLight} 0%, ${T.color.white} 100%)`,
              borderRadius: T.radius.xl, padding: "12px 14px", marginBottom: 12,
              border: `1.5px solid ${T.color.apricot}22`, position: "relative",
              animation: "fadeSlide 0.3s ease",
            }}>
              {/* Top row: icon + text + close */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 24 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: T.radius.full, flexShrink: 0,
                  background: T.color.apricot, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 8px ${T.color.apricot}44`,
                }}>
                  <Icon type="badge" size={18} color={T.color.white} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Latest badge</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{badge.label}</div>
                  <div style={{ fontSize: 11, color: T.color.sage, fontWeight: 600, fontStyle: "italic" }}>"{badge.message}"</div>
                </div>
              </div>
              <button onClick={() => setShowBadge(false)} aria-label="Dismiss" style={{
                background: "none", border: "none", cursor: "pointer", position: "absolute", top: 10, right: 10, padding: 2,
              }}>
                <Icon type="x" size={14} color={T.color.charcoalMuted} />
              </button>
              {/* Share button below message, aligned with text */}
              <button
                onClick={() => setShareMsg(`I just earned the "${badge.label}" badge on 1RUN.UK — I'm working towards running my first 1K. ${APP_URL}`)}
                style={{
                  marginTop: 10, marginLeft: 50,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "none",
                  border: `1.5px solid ${T.color.moss}`,
                  borderRadius: T.radius.full,
                  padding: "5px 12px",
                  cursor: "pointer",
                }}>
                <Icon type="shareNode" size={12} color={T.color.moss} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.color.moss, fontFamily: T.font.body }}>Share this badge</span>
              </button>
            </div>
          );
        })()}

        {/* Weeks & Goals */}
        <div style={{ background: T.color.white, borderRadius: T.radius.xl, padding: "14px 14px 16px", marginBottom: 12, boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>View your weekly sessions</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>Goals & badges</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {WEEKS.map((w) => (
              <WeekButton key={w.num} num={w.num} status={getWeekStatus(w.num)} isGoal={false}
                isSelected={false} onClick={() => go(navigate, `/week/${w.num}`)} />
            ))}
            <WeekButton num={7} status="goal" isGoal isSelected={showGoalPanel} onClick={() => setShowGoalPanel(g => !g)} />
          </div>
        </div>

        {/* Goal panel */}
        {showGoalPanel && (
          <div style={{ marginBottom: 12 }}>
            <GoalPanel
              ambition={profile.ambition || "1K"}
              reward={profile.reward}
              sessionsRemaining={totalSessions - sessionsCompleted}
              badges={progress.badges}
              onClose={() => setShowGoalPanel(false)}
            />
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[
            { icon: "calendar", value: weeksCompleted, label: `Weeks out\nof ${WEEKS.length}`, color: T.color.moss },
            { icon: "check", value: sessionsCompleted, label: `Sessions out\nof ${totalSessions}`, color: T.color.sage },
            { icon: "clock", value: sessionsCompleted * 20, label: "Active minutes", color: T.color.apricot },
            { icon: "percent", value: `${progressPct}%`, label: "Complete", color: T.color.sky },
          ].map((s) => (
            <div key={s.icon} style={{
              background: T.color.white, borderRadius: T.radius.xl, padding: "12px 10px",
              flex: 1, minWidth: 0, boxShadow: "0 1px 3px rgba(59,63,58,0.05)", textAlign: "center",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: T.radius.sm, background: s.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px",
              }}>
                <Icon type={s.icon} size={24} color={s.color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.color.charcoalMuted, fontFamily: T.font.body, marginTop: 3, lineHeight: 1.2, whiteSpace: "pre-line" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="db-flex-split">
        {/* Weight Journey + Calories */}
        {!isUnder18 && progress.startWeight && targetWeight && (
          <div className="db-split-left" style={{ background: T.color.white, borderRadius: T.radius.xl, padding: "16px 14px 0", marginBottom: 12, boxShadow: "0 1px 4px rgba(59,63,58,0.06)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>Weight Journey</div>
                <div style={{ fontSize: 12, color: T.color.charcoalMuted }}>
                  {latestWeighIn ? `${latestWeighIn} kg` : `${progress.startWeight} kg`} · target {targetWeight.toFixed(1)} kg
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {latestWeighIn && (
                  <div style={{ background: T.color.sageLight, borderRadius: T.radius.full, padding: "3px 8px", fontSize: 12, fontWeight: 700, color: T.color.moss }}>
                    {latestWeighIn < progress.startWeight ? "−" : "+"}{Math.abs(progress.startWeight - latestWeighIn).toFixed(1)} kg
                  </div>
                )}
              </div>
            </div>
            <WeightGraph
              startWeight={progress.startWeight}
              targetWeight={targetWeight}
              weighIns={progress.weighIns}
            />
            {!hasWeighedInThisWeek() && (
              <button
                onClick={() => setShowWeightSheet(true)}
                style={{
                  width: "100%", margin: "8px 0 12px",
                  padding: "12px 14px", border: "none",
                  background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
                  borderRadius: T.radius.lg,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  boxShadow: `0 4px 12px ${T.color.moss}44`,
                }}>
                <Icon type="plus" size={15} color={T.color.white} />
                <span style={{ fontSize: 13, fontWeight: 800, color: T.color.white, fontFamily: T.font.display }}>Log this week's weight</span>
              </button>
            )}
            <div style={{
              background: T.color.ivory, padding: "12px 14px", margin: "0 -14px",
              borderTop: `1px solid ${T.color.ivoryDark}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, color: T.color.charcoalMuted }}>Today's allowance</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: T.color.moss, fontFamily: T.font.display }}>{profile.calorieAllowance}</span>
                  <span style={{ fontSize: 12, color: T.color.charcoalMuted }}>kcal</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.color.sage, fontWeight: 600, maxWidth: 150, textAlign: "right", lineHeight: 1.3 }}>
                Eat them all. Exercise earns you more.
              </div>
            </div>
          </div>
        )}

        {/* Healthy lifestyle section */}
        {currentWeekData && (
          <div className="db-split-right">
            <div style={{ fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
              Healthy lifestyle
            </div>

            {/* This week's focus */}
            <div style={{
              background: T.color.white, borderRadius: T.radius.xl,
              padding: "16px 18px", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 14,
              border: `2px solid ${T.color.sage}55`,
              boxShadow: `0 2px 10px ${T.color.sage}18`,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: T.radius.lg, flexShrink: 0, background: T.color.sageLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon type="utensils" size={22} color={T.color.sage} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: T.color.sage, marginBottom: 2 }}>This week</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>
                  {currentWeekData.eating}
                </div>
                <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 2, lineHeight: 1.4 }}>
                  {currentWeekData.eatingDetail}
                </div>
              </div>
            </div>

            {/* Rotating tips — 3 shown per visit, cycling through the full pool */}
            {rotatingTips.map((tip) => (
              <div key={tip.title} style={{
                background: T.color.ivory, borderRadius: T.radius.xl,
                padding: "13px 15px", marginBottom: 6,
                display: "flex", gap: 12, alignItems: "flex-start",
                border: `1.5px solid ${T.color.ivoryDark}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: T.radius.md, flexShrink: 0,
                  background: tip.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon type={tip.icon} size={17} color={tip.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.3 }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 3, lineHeight: 1.5, fontWeight: 500 }}>{tip.body}</div>
                </div>
              </div>
            ))}

            {/* Quick recipes — commented out until real URLs are available */}
          </div>
        )}
        </div>
      </div>
      </div>

      {showWeightSheet && (
        <WeightLogSheet
          startWeight={progress.startWeight}
          targetWeight={targetWeight}
          latestWeighIn={latestWeighIn}
          onSave={(v) => { logWeighIn(v); setShowWeightSheet(false); }}
          onDismiss={() => setShowWeightSheet(false)}
        />
      )}

      {shareMsg && <ShareSheet message={shareMsg} onClose={() => setShareMsg(null)} />}
    </div>
  );
}
