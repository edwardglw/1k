import { useState } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";

const RED    = "#C0392B";
const RED_BG = "#FDEAEA";
const AMBER    = "#D97706";
const AMBER_BG = "#FEF3E2";

const OPTIONS = [
  {
    value: "too_easy",
    label: "Too easy",
    sub: "I could have pushed harder",
    icon: "flame",
    color: RED,
    bg: RED_BG,
    confirmation: "We'll extend your running intervals and shorten walking recovery. Keep building on that.",
  },
  {
    value: "about_right",
    label: "About right",
    sub: "Challenging but manageable",
    icon: "check",
    color: T.color.moss,
    bg: T.color.sageLight,
    confirmation: "Perfect — your sessions will stay exactly as they are. You're right on track.",
  },
  {
    value: "too_hard",
    label: "Too hard",
    sub: "I struggled more than expected",
    icon: "heart",
    color: AMBER,
    bg: AMBER_BG,
    confirmation: "We'll increase your walking recovery time between runs so the effort feels more manageable.",
  },
];

export default function WeekFeelingSheet({ weekNum, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const opt = OPTIONS.find(o => o.value === selected);

  return (
    <>
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(59,63,58,0.45)", backdropFilter: "blur(4px)",
        zIndex: 200, animation: "fadeIn 0.2s ease",
      }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 430, margin: "0 auto",
        background: T.color.white,
        borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`,
        padding: "20px 24px 48px",
        zIndex: 201, animation: "slideUp 0.35s ease",
        fontFamily: T.font.body,
      }}>
        <div style={{ width: 36, height: 4, background: T.color.ivoryTone, borderRadius: 2, margin: "0 auto 24px" }} />

        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
            Week {weekNum} complete
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.2 }}>
            How did that feel?
          </div>
        </div>

        {/* Option buttons — never move */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {OPTIONS.map((o) => {
            const isChosen = selected === o.value;
            const isDimmed = selected && !isChosen;
            return (
              <button
                key={o.value}
                onClick={() => setSelected(o.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  background: o.bg,
                  border: `${isChosen ? "3px" : "2px"} solid ${isChosen ? o.color : o.color + "55"}`,
                  borderRadius: T.radius.xl,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s ease",
                  opacity: isDimmed ? 0.5 : 1,
                  boxShadow: isChosen ? `0 2px 12px ${o.color}33` : "none",
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: T.radius.md, flexShrink: 0,
                  background: o.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon type={o.icon} size={18} color={o.color} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 1, fontWeight: 500 }}>{o.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Message area — fixed height, greyed by default */}
        <div style={{
          minHeight: 56,
          background: opt ? opt.bg : T.color.ivoryDark,
          border: `1.5px solid ${opt ? opt.color + "33" : T.color.ivoryDark}`,
          borderRadius: T.radius.xl,
          padding: "12px 16px",
          marginBottom: 14,
          transition: "background 0.2s ease, border-color 0.2s ease",
          display: "flex", alignItems: "center",
        }}>
          <div style={{
            fontSize: 13, fontWeight: 600, lineHeight: 1.55,
            color: opt ? T.color.charcoal : T.color.charcoalMuted,
            fontStyle: opt ? "normal" : "italic",
            transition: "color 0.2s ease",
          }}>
            {opt ? opt.confirmation : "Select an option to see how we'll adapt your plan."}
          </div>
        </div>

        <button
          disabled={!selected}
          onClick={() => onSubmit(selected)}
          style={{
            width: "100%", padding: "15px", border: "none", borderRadius: T.radius.lg,
            fontSize: 15, fontWeight: 800, fontFamily: T.font.display,
            background: selected
              ? `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`
              : T.color.ivoryDark,
            color: selected ? T.color.white : T.color.charcoalMuted,
            cursor: selected ? "pointer" : "default",
            boxShadow: selected ? `0 4px 16px ${T.color.moss}44` : "none",
            transition: "all 0.2s ease",
          }}>
          {selected ? "Save and continue" : "Make a selection above"}
        </button>
      </div>
    </>
  );
}
