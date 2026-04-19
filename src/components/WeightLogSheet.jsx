import { useState } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function WeightLogSheet({ startWeight, targetWeight, latestWeighIn, onSave, onDismiss }) {
  const placeholder = latestWeighIn ?? startWeight ?? "";
  const [value, setValue] = useState(placeholder ? String(placeholder) : "");

  const numVal = parseFloat(value);
  const valid = !isNaN(numVal) && numVal > 20 && numVal < 300;

  const delta = valid && startWeight ? numVal - startWeight : null;

  return (
    <>
      <div
        onClick={onDismiss}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(59,63,58,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease",
        }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 430, margin: "0 auto",
        background: T.color.white,
        borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`,
        padding: "20px 24px 44px",
        zIndex: 101,
        animation: "slideUp 0.3s ease",
        fontFamily: T.font.body,
      }}>
        <div style={{
          width: 36, height: 4, background: T.color.ivoryTone,
          borderRadius: 2, margin: "0 auto 22px",
        }} />

        <div style={{
          width: 56, height: 56, borderRadius: T.radius.full, margin: "0 auto 18px",
          background: `linear-gradient(135deg, ${T.color.sky}, #6AA0BC)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 16px ${T.color.sky}44`,
        }}>
          <Icon type="scale" size={24} color={T.color.white} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: T.color.charcoal,
            fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6,
          }}>
            Log your weight
          </div>
          {targetWeight && (
            <div style={{ fontSize: 13, color: T.color.charcoalMuted }}>
              Started at {startWeight} kg · target {targetWeight.toFixed(1)} kg
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <input
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 74.5"
            autoFocus
            style={{
              width: "100%", padding: "16px 48px 16px 16px",
              border: `2px solid ${valid ? T.color.sage : T.color.ivoryDark}`,
              borderRadius: T.radius.lg, fontSize: 24, fontWeight: 900,
              fontFamily: T.font.display, color: T.color.charcoal,
              background: T.color.white, outline: "none",
              transition: "border-color 0.2s ease",
              textAlign: "center",
            }}
          />
          <span style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: 14, fontWeight: 600, color: T.color.charcoalMuted,
          }}>
            kg
          </span>
        </div>

        {/* Delta preview */}
        <div style={{ textAlign: "center", height: 20, marginBottom: 20 }}>
          {delta !== null && (
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: delta <= 0 ? T.color.moss : T.color.charcoalMuted,
            }}>
              {delta === 0 ? "No change from start" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg from start`}
            </span>
          )}
        </div>

        <button
          onClick={() => valid && onSave(numVal)}
          disabled={!valid}
          style={{
            width: "100%", padding: "16px", borderRadius: T.radius.lg, border: "none",
            background: valid
              ? `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`
              : T.color.ivoryDark,
            color: valid ? T.color.white : T.color.charcoalMuted,
            fontSize: 16, fontWeight: 800, fontFamily: T.font.display,
            cursor: valid ? "pointer" : "default",
            boxShadow: valid ? `0 6px 20px ${T.color.moss}44` : "none",
            transition: "all 0.2s ease",
            marginBottom: 12,
          }}>
          Save
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: "100%", padding: "12px", background: "none", border: "none",
            color: T.color.charcoalMuted, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: T.font.body,
          }}>
          Not now
        </button>
      </div>
    </>
  );
}
