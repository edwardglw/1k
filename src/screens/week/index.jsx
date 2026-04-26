import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { go } from "../../lib/navigate";
import { T } from "../../tokens";
import { WEEKS, formatIntervals } from "../../data/programme";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";
import WeekButton from "../../components/WeekButton";
import GoalPanel from "../../components/GoalPanel";
import SessionDoneSheet from "../../components/SessionDoneSheet";
import BadgeCelebration from "../../components/BadgeCelebration";
import WeekFeelingSheet from "../../components/WeekFeelingSheet";
import ShareSheet from "../../components/ShareSheet";

const APP_URL = "https://1k-beta.vercel.app";

const SESSION_MOTIVATIONS = [
  "Start strong — first one is always the hardest.",
  "Coming back is the whole game.",
  "Finish the week. You're almost there.",
];

const SESSION_TROPHY_MSGS = [
  "You started. That's everything.",
  "You came back. That's what matters.",
  "Full week done. Every step counts.",
];

const SESSION_SHARE_MSGS = [
  "I just completed my first session of Week",
  "I went back for session two of Week",
  "I finished all three sessions of Week",
];

const MOTIV_BY_WEEK = [
  "The first step is always the hardest. You're doing it.",
  "Two weeks in. A routine is forming.",
  "Halfway through the programme. You're running now.",
  "Four weeks of showing up. That's strength.",
  "One week to go. You can almost feel the finish line.",
  "This is it. Your first 1K is right here.",
];

export default function WeekView() {
  const { weekNum: weekNumStr } = useParams();
  const navigate = useNavigate();
  const weekNum = parseInt(weekNumStr, 10);
  const week = WEEKS[weekNum - 1];

  const {
    profile, progress, isSessionDone, getSessionDate,
    markSessionDone, unmarkSessionDone, applyWeekFeedback, getWeekStatus, totalSessions, sessionsCompleted,
  } = useUser();

  const walkMult = progress.walkMult ?? 1.0;
  const runMult = progress.runMult ?? 1.0;

  const [showGoal, setShowGoal] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);
  const [pendingUnmark, setPendingUnmark] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [showFeelingSheet, setShowFeelingSheet] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);
  const [showWeekLocked, setShowWeekLocked] = useState(false);

  const prevWeekComplete = weekNum === 1 || getWeekStatus(weekNum - 1) === "complete";

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      if (pendingSession) setPendingSession(null);
      else if (pendingUnmark) setPendingUnmark(null);
      else if (showWeekLocked) setShowWeekLocked(false);
      else if (shareMsg) setShareMsg(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [pendingSession, pendingUnmark, showWeekLocked, shareMsg]);

  if (!week) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleConfirm = () => {
    const badge = markSessionDone(weekNum, pendingSession.sessionIdx);
    setPendingSession(null);
    if (badge) setEarnedBadge(badge);
  };

  const handleBadgeContinue = () => {
    const isWeekBadge = earnedBadge?.type?.startsWith("week_") && earnedBadge.type.endsWith("_complete");
    setEarnedBadge(null);
    if (isWeekBadge) setShowFeelingSheet(true);
  };

  const handleFeelingSubmit = (feedback) => {
    applyWeekFeedback(weekNum, feedback);
    setShowFeelingSheet(false);
  };

  const doneSessions = week.sessions.map((_, i) => isSessionDone(weekNum, i));
  const doneCount = doneSessions.filter(Boolean).length;
  const weekBadge = progress.badges.find(b => b.type === `week_${weekNum}_complete`);

  return (
    <div style={{ minHeight: "100vh", background: T.color.ivory, fontFamily: T.font.body, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (min-width: 768px) {
          .wv-sticky { max-width: 800px !important; }
          .wv-wrap { max-width: 800px !important; }
          .wv-columns { display: flex; gap: 20px; align-items: flex-start; }
          .wv-trophy-col { width: 300px; flex-shrink: 0; order: 2; }
          .wv-sessions-col { flex: 1; min-width: 0; order: 1; }
        }
      `}</style>

      <AtmosphericBG />

      {/* ── Sticky header — white card peeling over scroll content ── */}
      <div className="wv-sticky" style={{
        position: "sticky", top: 0, zIndex: 10,
        background: T.color.white,
        borderRadius: "0 0 24px 24px",
        boxShadow: "0 6px 24px rgba(59,63,58,0.13)",
        padding: "20px 20px 18px",
        maxWidth: 430, margin: "0 auto",
      }}>
        {/* Back + phase row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button
            onClick={() => go(navigate, "/dashboard")}
            aria-label="Back"
            style={{
              background: T.color.ivory, border: "none", borderRadius: T.radius.full,
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}>
            <Icon type="chevronL" size={18} color={T.color.charcoal} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.color.sage, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {week.phase}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.1 }}>
              Week {week.num} — {week.label}
            </div>
          </div>
        </div>

        {/* Week circles + goal CTA */}
        <div style={{
          background: T.color.ivory, borderRadius: T.radius.xl,
          padding: "10px 12px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {WEEKS.map((w) => (
              <WeekButton
                key={w.num}
                num={w.num}
                status={getWeekStatus(w.num)}
                isGoal={false}
                isSelected={w.num === weekNum}
                onClick={() => go(navigate, `/week/${w.num}`)}
              />
            ))}
            <WeekButton
              num={7}
              status="goal"
              isGoal
              isSelected={showGoal}
              onClick={() => setShowGoal(g => !g)}
            />
          </div>
        </div>

        {/* Motivation */}
        <div style={{
          background: T.color.sageLight, borderRadius: T.radius.lg,
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.color.moss, lineHeight: 1.5 }}>
            {MOTIV_BY_WEEK[weekNum - 1] ?? "You're doing it. One session at a time."}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="wv-wrap" style={{ maxWidth: 430, margin: "0 auto", position: "relative", zIndex: 1, padding: "20px 20px 48px" }}>

        {/* Goal panel */}
        {showGoal && (
          <div style={{ marginBottom: 14 }}>
            <GoalPanel
              reward={profile.reward}
              sessionsRemaining={totalSessions - sessionsCompleted}
              badges={progress.badges}
              onClose={() => setShowGoal(false)}
            />
          </div>
        )}

        <div className="wv-columns"><div className="wv-trophy-col">
        {/* ── Trophy shelf — top of scroll ── */}
        <div style={{
          background: T.color.white, borderRadius: T.radius.xl,
          padding: "16px 18px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(59,63,58,0.06)",
          animation: "fadeSlide 0.3s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: T.color.charcoalMuted }}>
                Trophies this week
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, marginTop: 2 }}>
                {doneCount} of {week.sessions.length} earned
              </div>
            </div>
            <Icon type="trophy" size={22} color={T.color.apricot} />
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 8, marginBottom: doneCount > 0 ? 16 : 0 }}>
            {week.sessions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: T.radius.full,
                overflow: "hidden", background: T.color.ivoryDark,
              }}>
                <div style={{
                  width: doneSessions[i] ? "100%" : "0%",
                  height: "100%",
                  background: `linear-gradient(90deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`,
                  borderRadius: T.radius.full,
                  transition: "width 0.5s ease",
                }} />
              </div>
            ))}
          </div>

          {doneCount === 0 && (
            <div style={{ fontSize: 13, color: T.color.charcoalMuted, fontWeight: 500, lineHeight: 1.5 }}>
              Complete a session to earn your first trophy this week.
            </div>
          )}

          {doneCount > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {week.sessions.map((s, i) => {
                if (!doneSessions[i]) return null;
                const dateStr = getSessionDate(weekNum, i);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px",
                    background: T.color.apricotLight, borderRadius: T.radius.lg,
                    border: `1.5px solid ${T.color.apricot}22`,
                    animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1) both",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: T.radius.full, flexShrink: 0,
                      background: T.color.apricot,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 2px 8px ${T.color.apricot}44`,
                    }}>
                      <Icon type="trophy" size={15} color={T.color.white} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>
                        Session {i + 1}
                      </div>
                      <div style={{ fontSize: 11, color: T.color.apricot, fontStyle: "italic", marginTop: 1 }}>
                        "{SESSION_TROPHY_MSGS[i] ?? "Well done."}"
                        {dateStr && (
                          <span style={{ fontStyle: "normal", color: T.color.charcoalMuted, marginLeft: 6 }}>· {dateStr}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShareMsg(`${SESSION_SHARE_MSGS[i] ?? `I just completed session ${i + 1} of Week`} ${weekNum} on 1RUN.UK — my free 6-week beginner running programme. Every step is getting me closer to my first 1K. ${APP_URL}`)}
                      aria-label="Share"
                      style={{ background: "none", border: "none", padding: 6, cursor: "pointer", flexShrink: 0, display: "flex" }}>
                      <Icon type="shareNode" size={16} color={T.color.moss} />
                    </button>
                  </div>
                );
              })}

              {/* Week badge */}
              {weekBadge && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: `linear-gradient(135deg, ${T.color.apricotLight} 0%, ${T.color.sageLight} 100%)`,
                  borderRadius: T.radius.lg,
                  border: `1.5px solid ${T.color.apricot}33`,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: T.radius.full, flexShrink: 0,
                    background: `linear-gradient(135deg, ${T.color.apricot} 0%, ${T.color.moss} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 2px 8px ${T.color.apricot}44`,
                  }}>
                    <Icon type="badge" size={16} color={T.color.white} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>
                      {weekBadge.label}
                    </div>
                    <div style={{ fontSize: 11, color: T.color.moss, fontStyle: "italic", marginTop: 1 }}>
                      "{weekBadge.message}"
                    </div>
                  </div>
                  <button
                    onClick={() => setShareMsg(`I just completed Week ${weekNum} of my 6-week running plan on 1RUN.UK. I'm building up to my first 1K — one week at a time. ${APP_URL}`)}
                    aria-label="Share"
                    style={{ background: "none", border: "none", padding: 6, cursor: "pointer", flexShrink: 0, display: "flex" }}>
                    <Icon type="shareNode" size={16} color={T.color.moss} />
                  </button>
                </div>
              )}

              {/* Personal reward */}
              {weekBadge && profile.reward && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px",
                  background: T.color.ivory, borderRadius: T.radius.lg,
                  border: `1.5px solid ${T.color.ivoryDark}`,
                }}>
                  <Icon type="gift" size={18} color={T.color.apricot} />
                  <div>
                    <div style={{ fontSize: 11, color: T.color.charcoalMuted, fontWeight: 600 }}>Your reward</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>
                      {profile.reward}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        </div><div className="wv-sessions-col">
        {/* ── Sessions ── */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted,
          textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
        }}>
          This week's sessions
        </div>

        {weekNum === 1 && doneCount === 0 && (
          <div style={{
            background: T.color.sageLight, borderRadius: T.radius.lg,
            padding: "12px 16px", marginBottom: 12,
            border: `1.5px solid ${T.color.sage}44`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.color.moss, lineHeight: 1.5 }}>
              Take it slow. Walking is fine.
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {week.sessions.map((s, i) => {
            const done = doneSessions[i];
            const dateStr = getSessionDate(weekNum, i);
            const isNext = !done && doneSessions.slice(0, i).every(Boolean);
            return (
              <div
                key={i}
                style={{
                  background: done ? T.color.sageLight : T.color.white,
                  borderRadius: T.radius.xl,
                  padding: "16px 18px",
                  border: done ? `2px solid ${T.color.moss}33` : `1.5px solid ${T.color.ivoryDark}`,
                  boxShadow: done ? `0 2px 12px ${T.color.moss}14` : "0 1px 4px rgba(59,63,58,0.06)",
                  animation: `fadeSlide 0.3s ease ${i * 0.06}s both`,
                }}>
                {/* Session header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: T.radius.md, flexShrink: 0,
                    background: done
                      ? `linear-gradient(135deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`
                      : T.color.ivoryDark,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 2,
                    boxShadow: done ? `0 4px 12px ${T.color.moss}33` : "none",
                  }}>
                    <span style={{
                      fontSize: 18, fontWeight: 900, lineHeight: 1,
                      fontFamily: T.font.display,
                      color: done ? T.color.white : T.color.charcoalMid,
                    }}>{i + 1}</span>
                    <Icon type="run" size={12} color={done ? "rgba(255,255,255,0.65)" : T.color.charcoalMid} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.2 }}>
                      Session {i + 1}
                    </div>
                    <div style={{ fontSize: 12, color: done ? T.color.moss : T.color.charcoalMuted, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
                      {SESSION_MOTIVATIONS[i] ?? "Keep going."}
                    </div>
                  </div>
                  {done && (
                    <button
                      onClick={() => setPendingUnmark({ sessionIdx: i })}
                      aria-label="Unmark session"
                      style={{
                        width: 28, height: 28, borderRadius: T.radius.full,
                        background: T.color.moss, border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 2px 8px ${T.color.moss}44`,
                        animation: "popIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
                        flexShrink: 0,
                      }}>
                      <Icon type="check" size={14} color={T.color.white} />
                    </button>
                  )}
                </div>

                {/* Instruction block */}
                <div style={{
                  background: done ? `${T.color.moss}10` : T.color.ivoryTone,
                  borderRadius: T.radius.lg, padding: "10px 14px",
                  marginBottom: done ? 10 : 12,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45, color: done ? T.color.moss : T.color.charcoal }}>
                    {s.intervals ? formatIntervals(s.intervals, walkMult, runMult) : s.desc}
                  </div>
                </div>

                {/* Completed date */}
                {done && dateStr && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 12px",
                    background: `${T.color.moss}10`, borderRadius: T.radius.md,
                  }}>
                    <Icon type="check" size={13} color={T.color.moss} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.color.moss, fontStyle: "italic" }}>
                      Completed {dateStr}
                    </span>
                  </div>
                )}

                {/* Mark as done */}
                {!done && (
                  <button
                    onClick={() => {
                      if (!isNext) return;
                      prevWeekComplete ? setPendingSession({ sessionIdx: i }) : setShowWeekLocked(true);
                    }}
                    style={{
                      width: "100%", padding: "13px", border: "none", borderRadius: T.radius.lg,
                      fontSize: 14, fontWeight: 800, fontFamily: T.font.display,
                      background: isNext && prevWeekComplete
                        ? `linear-gradient(135deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`
                        : T.color.ivoryDark,
                      color: isNext && prevWeekComplete ? T.color.white : T.color.charcoalMuted,
                      boxShadow: isNext && prevWeekComplete ? `0 4px 16px ${T.color.moss}44` : "none",
                      cursor: isNext ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                    <Icon type="check" size={15} color={isNext && prevWeekComplete ? T.color.white : T.color.charcoalMuted} />
                    Mark as done
                  </button>
                )}
              </div>
            );
          })}
        </div>
        </div></div>{/* end wv-sessions-col + wv-columns */}
      </div>

      {pendingSession && (
        <SessionDoneSheet
          session={week.sessions[pendingSession.sessionIdx]}
          weekNum={weekNum}
          onConfirm={handleConfirm}
          onDismiss={() => setPendingSession(null)}
        />
      )}

      {pendingUnmark && (
        <>
          <div onClick={() => setPendingUnmark(null)} style={{
            position: "fixed", inset: 0,
            background: "rgba(59,63,58,0.45)", backdropFilter: "blur(4px)",
            zIndex: 100, animation: "fadeIn 0.2s ease",
          }} />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            maxWidth: 430, margin: "0 auto",
            background: T.color.white,
            borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`,
            padding: "20px 24px 44px",
            zIndex: 101, animation: "slideUp 0.3s ease",
            fontFamily: T.font.body,
          }}>
            <div style={{ width: 36, height: 4, background: T.color.ivoryTone, borderRadius: 2, margin: "0 auto 22px" }} />
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: T.radius.full, margin: "0 auto 14px",
                background: T.color.ivoryDark,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon type="x" size={22} color={T.color.charcoalMuted} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, marginBottom: 8 }}>
                Mark as not done?
              </div>
              <div style={{ fontSize: 14, color: T.color.charcoalMuted, lineHeight: 1.5 }}>
                Session {pendingUnmark.sessionIdx + 1} will be unmarked. You can always log it again.
              </div>
            </div>
            <button
              onClick={() => { unmarkSessionDone(weekNum, pendingUnmark.sessionIdx); setPendingUnmark(null); }}
              style={{
                width: "100%", padding: "15px", border: "none", borderRadius: T.radius.lg,
                fontSize: 15, fontWeight: 800, fontFamily: T.font.display,
                background: T.color.ivoryDark, color: T.color.charcoal,
                cursor: "pointer", marginBottom: 10,
              }}>
              Yes, mark as not done
            </button>
            <button
              onClick={() => setPendingUnmark(null)}
              style={{
                width: "100%", padding: "12px", background: "none", border: "none",
                color: T.color.charcoalMuted, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: T.font.body,
              }}>
              Keep it done
            </button>
          </div>
        </>
      )}

      {earnedBadge && (
        <BadgeCelebration
          badge={earnedBadge}
          onContinue={handleBadgeContinue}
        />
      )}

      {showFeelingSheet && (
        <WeekFeelingSheet
          weekNum={weekNum}
          onSubmit={handleFeelingSubmit}
        />
      )}

      {showWeekLocked && (
        <>
          <div onClick={() => setShowWeekLocked(false)} style={{
            position: "fixed", inset: 0,
            background: "rgba(59,63,58,0.45)", backdropFilter: "blur(4px)",
            zIndex: 100, animation: "fadeIn 0.2s ease",
          }} />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            maxWidth: 430, margin: "0 auto",
            background: T.color.white,
            borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`,
            padding: "20px 24px 44px",
            zIndex: 101, animation: "slideUp 0.3s ease",
            fontFamily: T.font.body, textAlign: "center",
          }}>
            <div style={{ width: 36, height: 4, background: T.color.ivoryTone, borderRadius: 2, margin: "0 auto 22px" }} />
            <div style={{
              width: 52, height: 52, borderRadius: T.radius.full, margin: "0 auto 14px",
              background: T.color.ivoryDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon type="chevronL" size={22} color={T.color.charcoalMuted} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, marginBottom: 8 }}>
              Complete Week {weekNum - 1} first
            </div>
            <div style={{ fontSize: 14, color: T.color.charcoalMuted, lineHeight: 1.6, marginBottom: 24 }}>
              Finish all three sessions in Week {weekNum - 1} before moving on.
            </div>
            <button
              onClick={() => { setShowWeekLocked(false); go(navigate, `/week/${weekNum - 1}`); }}
              style={{
                width: "100%", padding: "15px", border: "none", borderRadius: T.radius.lg,
                fontSize: 15, fontWeight: 800, fontFamily: T.font.display,
                background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
                color: T.color.white, cursor: "pointer",
                boxShadow: `0 4px 16px ${T.color.moss}44`, marginBottom: 10,
              }}>
              Go to Week {weekNum - 1}
            </button>
            <button onClick={() => setShowWeekLocked(false)} style={{
              width: "100%", padding: "12px", background: "none", border: "none",
              color: T.color.charcoalMuted, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: T.font.body,
            }}>
              Got it
            </button>
          </div>
        </>
      )}

      {shareMsg && <ShareSheet message={shareMsg} onClose={() => setShareMsg(null)} />}
    </div>
  );
}
