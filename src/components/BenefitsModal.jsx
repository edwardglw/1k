import { useEffect } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";

const BENEFITS = [
  {
    icon: "heart", iconColor: T.color.sky,
    title: "Personalised to you",
    body: "Answer a few questions and we build your programme around your pace, schedule, and goals. Too hard? We ease back. Too easy? We add a minute. Missed a week? We pick up where you left off — with a kind word, not a shame spiral.",
  },
  {
    icon: "trophy", iconColor: T.color.apricot,
    title: "Aim for 1K, not 5K",
    body: "Built for complete beginners. Where other apps start too fast, we start at the sofa — walks and stretching in week 1, a first jog in week 2. By week 6, you'll run your first kilometre. No pressure, no shame.",
  },
  {
    icon: "utensils", iconColor: T.color.sage,
    title: "Moving and eating — together",
    body: "What you eat and how you move are one plan, not two separate things. Each week builds both habits side by side — from understanding your calories in week 1 to eating well around exercise in week 6. Real, practical, sustainable.",
  },
];

export default function BenefitsModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(59,63,58,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.25s ease",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430,
          background: T.color.ivory,
          borderTopLeftRadius: T.radius.xl,
          borderTopRightRadius: T.radius.xl,
          animation: "slideUp 0.3s ease",
          maxHeight: "85vh",
          display: "flex", flexDirection: "column",
          boxShadow: "0 -8px 32px rgba(59,63,58,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Sticky header — stays above scroll */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.2 }}>
              Why 1RUN.UK?
            </div>
            <button onClick={onClose} aria-label="Close" style={{
              background: T.color.white, border: "none", borderRadius: T.radius.full,
              width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 1px 3px rgba(59,63,58,0.1)",
            }}>
              <Icon type="x" size={16} color={T.color.charcoalMuted} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{
                background: T.color.white, borderRadius: T.radius.xl,
                padding: "18px", boxShadow: "0 1px 3px rgba(59,63,58,0.05)",
                display: "flex", gap: 14,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: T.radius.md, flexShrink: 0,
                  background: b.iconColor + "18", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon type={b.icon} size={20} color={b.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 13.5, color: T.color.charcoal, lineHeight: 1.55, opacity: 0.8 }}>{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer — always visible */}
        <div style={{ padding: "12px 24px 28px", flexShrink: 0, background: T.color.ivory, borderTop: `1px solid ${T.color.ivoryDark}` }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "14px",
            background: T.color.moss, color: T.color.white,
            border: "none", borderRadius: T.radius.lg,
            fontSize: 15, fontWeight: 800, fontFamily: T.font.display, cursor: "pointer",
          }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
