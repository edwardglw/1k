import { useState } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";
import ShareSheet from "./ShareSheet";

const APP_URL = "https://1k-beta.vercel.app";

const ALL_BADGES = [
  { type: "first_session", label: "First step", message: "You started. That's everything.", shareMsg: `I took my first step today on 1RUN.UK — I've started my 6-week beginner running plan. Every habit begins somewhere. ${APP_URL}` },
  { type: "week_1_complete", label: "Week 1 done", message: "First week done. You showed up — that's the hardest part.", shareMsg: `I've just finished Week 1 of my 6-week running plan on 1RUN.UK. I showed up — and that was the hardest part. ${APP_URL}` },
  { type: "week_2_complete", label: "Week 2 done", message: "Two weeks in. A habit is forming.", shareMsg: `Two weeks into my 6-week running plan on 1RUN.UK. I'm showing up consistently — a habit is forming. ${APP_URL}` },
  { type: "week_3_complete", label: "Week 3 done", message: "Halfway there. You're running now.", shareMsg: `I'm halfway through my 6-week running plan on 1RUN.UK. Three weeks in and I'm actually running now. ${APP_URL}` },
  { type: "week_4_complete", label: "Week 4 done", message: "Four weeks done. You're stronger than you were a month ago.", shareMsg: `Four weeks into 1RUN.UK and I'm stronger than I was a month ago. Two weeks to my first 1K. ${APP_URL}` },
  { type: "week_5_complete", label: "Week 5 done", message: "Five weeks down. One to go.", shareMsg: `Five weeks down on 1RUN.UK — just one week to go until my first 1K. I can almost feel the finish line. ${APP_URL}` },
  { type: "week_6_complete", label: "1RUN.UK complete", message: "You ran your first kilometre. That's everything.", shareMsg: `I just ran my first kilometre and completed all 6 weeks of 1RUN.UK. I actually did it. ${APP_URL}` },
];

export default function GoalPanel({ badges = [], reward, sessionsRemaining, onClose }) {
  const earnedTypes = new Set(badges.map(b => b.type));
  const [shareMsg, setShareMsg] = useState(null);

  return (
    <>
      <div style={{
        background: T.color.white,
        borderRadius: T.radius.xl,
        padding: "20px 18px",
        boxShadow: "0 4px 20px rgba(59,63,58,0.1)",
        animation: "fadeSlide 0.25s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display }}>
            Goals & badges
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: T.color.ivory, border: "none", borderRadius: T.radius.full,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <Icon type="x" size={14} color={T.color.charcoalMuted} />
          </button>
        </div>

        <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginBottom: 14 }}>
          {sessionsRemaining > 0 ? `${sessionsRemaining} sessions to your first 1K` : "You did it — your first 1K!"}
        </div>

        {reward && (
          <div style={{
            background: T.color.apricotLight, borderRadius: T.radius.lg,
            padding: "12px 14px", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Icon type="gift" size={18} color={T.color.apricot} />
            <div>
              <div style={{ fontSize: 12, color: T.color.charcoalMuted }}>You're doing this for</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.color.charcoal, fontFamily: T.font.display }}>{reward}</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_BADGES.map((b) => {
            const earned = earnedTypes.has(b.type);
            return (
              <div key={b.type} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                background: earned ? T.color.apricotLight : T.color.ivory,
                borderRadius: T.radius.lg,
                opacity: earned ? 1 : 0.55,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: T.radius.full, flexShrink: 0,
                  background: earned ? T.color.apricot : T.color.ivoryDark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: earned ? `0 2px 8px ${T.color.apricot}44` : "none",
                }}>
                  <Icon type={earned ? "badge" : "star"} size={16} color={earned ? T.color.white : T.color.charcoalLight} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: earned ? T.color.sage : T.color.charcoalMuted, fontStyle: earned ? "italic" : "normal", fontWeight: earned ? 600 : 400, lineHeight: 1.3 }}>
                    {earned ? `"${b.message}"` : b.message}
                  </div>
                </div>
                {earned && (
                  <button
                    onClick={() => setShareMsg(b.shareMsg)}
                    aria-label="Share badge"
                    style={{
                      background: "none", border: "none", padding: 6, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                    <Icon type="shareNode" size={16} color={T.color.charcoalMuted} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {shareMsg && <ShareSheet message={shareMsg} onClose={() => setShareMsg(null)} />}
    </>
  );
}
