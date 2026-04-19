import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function BadgeCelebration({ badge, onContinue }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: `linear-gradient(180deg, ${T.color.apricotLight} 0%, ${T.color.white} 65%)`,
      zIndex: 200,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 32px",
      animation: "fadeIn 0.35s ease",
      fontFamily: T.font.body,
    }}>
      <div style={{
        width: 120, height: 120, borderRadius: T.radius.full,
        background: `linear-gradient(135deg, ${T.color.apricot}, #D4875A)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 40px ${T.color.apricot}55`,
        marginBottom: 36,
        animation: "badgePop 0.45s cubic-bezier(.4,0,.2,1) 0.15s both",
      }}>
        <Icon type="badge" size={54} color={T.color.white} />
      </div>

      <div style={{
        fontSize: 12, fontWeight: 700, color: T.color.apricot,
        textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
      }}>
        Badge earned
      </div>
      <div style={{
        fontSize: 30, fontWeight: 900, color: T.color.charcoal,
        fontFamily: T.font.display, textAlign: "center",
        lineHeight: 1.15, marginBottom: 16,
      }}>
        {badge.label}
      </div>
      <div style={{
        fontSize: 16, color: T.color.charcoalMuted, textAlign: "center",
        lineHeight: 1.65, maxWidth: 280, fontStyle: "italic", marginBottom: 52,
      }}>
        "{badge.message}"
      </div>

      <button
        onClick={onContinue}
        style={{
          width: "100%", maxWidth: 320, padding: "16px",
          borderRadius: T.radius.lg, border: "none",
          background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
          color: T.color.white, fontSize: 16, fontWeight: 800,
          fontFamily: T.font.display, cursor: "pointer",
          boxShadow: `0 6px 20px ${T.color.moss}44`,
        }}>
        Continue
      </button>
    </div>
  );
}
