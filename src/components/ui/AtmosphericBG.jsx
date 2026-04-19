import { T } from "../../tokens";

export default function AtmosphericBG() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: -80, right: -60,
        width: 420, height: 420, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.color.sageTone}EE 0%, transparent 65%)`,
        filter: "blur(16px)",
      }} />
      <div style={{
        position: "absolute", top: "35%", left: -100,
        width: 380, height: 380, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.color.apricotTone}CC 0%, transparent 65%)`,
        filter: "blur(20px)",
      }} />
      <div style={{
        position: "absolute", bottom: -80, right: -40,
        width: 340, height: 340, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.color.sageTone}99 0%, transparent 65%)`,
        filter: "blur(18px)",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.38, mixBlendMode: "multiply" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.23  0 0 0 0 0.25  0 0 0 0 0.23  0 0 0 0.14 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
