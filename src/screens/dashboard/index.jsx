import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../tokens";
import { WEEKS } from "../../data/programme";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";
import WeekButton from "../../components/WeekButton";
import WeekPanel from "../../components/WeekPanel";
import GoalPanel from "../../components/GoalPanel";
import WeightGraph from "../../components/ui/WeightGraph";
import SessionDoneSheet from "../../components/SessionDoneSheet";
import BadgeCelebration from "../../components/BadgeCelebration";
import WeightLogSheet from "../../components/WeightLogSheet";

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
  { icon: "calendar", color: T.color.sage, title: "Your 6-week plan", body: "Tap a week to see its sessions. Log each one when you complete it." },
  { icon: "scale", color: T.color.sky, title: "Track your progress", body: "Log your weight each week. Your daily calorie target is set to your goal — eat them all." },
  { icon: "trophy", color: T.color.apricot, title: "Run your first 1K", body: "Complete all 18 sessions and cross the finish line. Tap Goals & badges to see what you're working towards." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, progress, getWeekStatus, isSessionDone, markSessionDone, logWeighIn, hasWeighedInThisWeek, totalSessions, sessionsCompleted } = useUser();

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showBadge, setShowBadge] = useState(true);
  const [pendingSession, setPendingSession] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [showWeightSheet, setShowWeightSheet] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [tutorialFading, setTutorialFading] = useState(false);
  const [motivLine] = useState(() => {
    const weeksCompleted = WEEKS.filter((_, i) => getWeekStatus(i + 1) === "complete").length;
    const sessionsRemaining = WEEKS[progress.currentWeek - 1]?.sessions.filter((_, i) => !isSessionDone(progress.currentWeek, i)).length ?? 0;
    const s = { weeksCompleted, sessionsRemaining, sessionsToGo: totalSessions - sessionsCompleted };
    return MOTIV_LINES[Math.floor(Math.random() * MOTIV_LINES.length)](profile, s);
  });

  const handleWeekBtn = (num) => setSelectedWeek(selectedWeek === num ? null : num);

  const handleConfirmSession = () => {
    const { weekNum, sessionIdx } = pendingSession;
    const badge = markSessionDone(weekNum, sessionIdx);
    setPendingSession(null);
    if (badge) setEarnedBadge(badge);
  };
  const weeksCompleted = WEEKS.filter((_, i) => getWeekStatus(i + 1) === "complete").length;
  const progressPct = Math.round((progress.currentWeek / WEEKS.length) * 100);
  const latestWeighIn = progress.weighIns.length ? progress.weighIns[progress.weighIns.length - 1].value : null;

  const targetWeight = progress.startWeight && profile.targetWeight !== ""
    ? progress.startWeight + parseFloat(profile.targetWeight)
    : null;

  const currentWeekData = WEEKS[progress.currentWeek - 1];

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
      `}</style>

      <AtmosphericBG />

      <div style={{ maxWidth: 430, margin: "0 auto", position: "relative", zIndex: 1 }}>

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
            onClick={() => navigate("/profile")}
            aria-label="Edit profile"
            style={{
              background: T.color.white,
              border: `2px solid ${T.color.moss}`,
              borderRadius: T.radius.full,
              width: 40, height: 40, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", marginLeft: 12,
              boxShadow: `0 2px 6px ${T.color.moss}22, inset 0 1px 0 rgba(255,255,255,0.7)`,
            }}>
            <Icon type="user" size={18} color={T.color.moss} />
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
                    onClick={() => isLast ? dismissTutorial() : setTutorialStep(t => t + 1)}
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
              display: "flex", alignItems: "center", gap: 12,
              border: `1.5px solid ${T.color.apricot}22`, position: "relative",
              animation: "fadeSlide 0.3s ease",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: T.radius.full, flexShrink: 0,
                background: T.color.apricot, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 8px ${T.color.apricot}44`,
              }}>
                <Icon type="badge" size={18} color={T.color.white} />
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
                <div style={{ fontSize: 10, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Latest badge</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{badge.label}</div>
                <div style={{ fontSize: 11, color: T.color.sage, fontWeight: 600, fontStyle: "italic" }}>"{badge.message}"</div>
              </div>
              <button onClick={() => setShowBadge(false)} aria-label="Dismiss" style={{
                background: "none", border: "none", cursor: "pointer", position: "absolute", top: 10, right: 10, padding: 2,
              }}>
                <Icon type="x" size={14} color={T.color.charcoalMuted} />
              </button>
            </div>
          );
        })()}

        {/* Weeks & Goals */}
        <div style={{ background: T.color.white, borderRadius: T.radius.xl, padding: "14px 14px 16px", marginBottom: 12, boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>Your weekly sessions</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>Goals & badges</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {WEEKS.map((w) => (
              <WeekButton key={w.num} num={w.num} status={getWeekStatus(w.num)} isGoal={false}
                isSelected={selectedWeek === w.num} onClick={() => handleWeekBtn(w.num)} />
            ))}
            <WeekButton num={7} status="goal" isGoal isSelected={selectedWeek === 7} onClick={() => handleWeekBtn(7)} />
          </div>
        </div>

        {/* Expanded Panel */}
        {selectedWeek !== null && selectedWeek <= 6 && (
          <div style={{ marginBottom: 12 }}>
            <WeekPanel
              week={WEEKS[selectedWeek - 1]}
              sessionsDone={WEEKS[selectedWeek - 1].sessions.reduce((acc, _, i) => ({ ...acc, [i]: isSessionDone(selectedWeek, i) }), {})}
              onClose={() => setSelectedWeek(null)}
              onNav={(dir) => { const next = selectedWeek + dir; if (next >= 1 && next <= 6) setSelectedWeek(next); }}
              hasPrev={selectedWeek > 1}
              hasNext={selectedWeek < 6}
              onSessionTap={selectedWeek === progress.currentWeek ? (idx) => setPendingSession({ weekNum: selectedWeek, sessionIdx: idx }) : null}
            />
          </div>
        )}
        {selectedWeek === 7 && (
          <div style={{ marginBottom: 12 }}>
            <GoalPanel
              ambition={profile.ambition || "1K"}
              reward={profile.reward}
              sessionsRemaining={totalSessions - sessionsCompleted}
              badges={progress.badges}
              onClose={() => setSelectedWeek(null)}
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

        {/* Weight Journey + Calories */}
        {progress.startWeight && targetWeight && (
          <div style={{ background: T.color.white, borderRadius: T.radius.xl, padding: "16px 14px 0", marginBottom: 12, boxShadow: "0 1px 4px rgba(59,63,58,0.06)", overflow: "hidden" }}>
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
                {!hasWeighedInThisWeek() && (
                  <button
                    onClick={() => setShowWeightSheet(true)}
                    style={{
                      background: T.color.apricot, border: "none", borderRadius: T.radius.full,
                      padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                      boxShadow: `0 2px 6px ${T.color.apricot}44`,
                    }}>
                    <Icon type="plus" size={14} color={T.color.white} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.color.white }}>Log</span>
                  </button>
                )}
              </div>
            </div>
            <WeightGraph
              startWeight={progress.startWeight}
              targetWeight={targetWeight}
              weighIns={progress.weighIns}
            />
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

        {/* Eating Card */}
        {currentWeekData && (
          <button onClick={() => {}} style={{
            width: "100%", background: T.color.white, borderRadius: T.radius.xl,
            padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
            border: `1.5px solid ${T.color.ivoryDark}`, boxShadow: "0 1px 4px rgba(59,63,58,0.06)",
            cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ width: 44, height: 44, borderRadius: T.radius.lg, flexShrink: 0, background: T.color.sageLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon type="utensils" size={22} color={T.color.sage} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>
                This week: {currentWeekData.eating}
              </div>
              <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 2, lineHeight: 1.4 }}>
                {currentWeekData.eatingDetail}
              </div>
            </div>
            <Icon type="chevronR" size={18} color={T.color.charcoalMuted} />
          </button>
        )}
      </div>
      </div>

      {pendingSession && (
        <SessionDoneSheet
          session={WEEKS[pendingSession.weekNum - 1].sessions[pendingSession.sessionIdx]}
          weekNum={pendingSession.weekNum}
          onConfirm={handleConfirmSession}
          onDismiss={() => setPendingSession(null)}
        />
      )}
      {earnedBadge && (
        <BadgeCelebration
          badge={earnedBadge}
          onContinue={() => setEarnedBadge(null)}
        />
      )}
      {showWeightSheet && (
        <WeightLogSheet
          startWeight={progress.startWeight}
          targetWeight={targetWeight}
          latestWeighIn={latestWeighIn}
          onSave={(v) => { logWeighIn(v); setShowWeightSheet(false); }}
          onDismiss={() => setShowWeightSheet(false)}
        />
      )}
    </div>
  );
}
