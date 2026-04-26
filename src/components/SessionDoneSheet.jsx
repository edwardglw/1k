import { useEffect } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function SessionDoneSheet({ session, weekNum, onConfirm, onDismiss }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onDismiss(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onDismiss]);

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
          fontFamily: T.font.body,
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
          width: 60, height: 60, borderRadius: T.radius.full, margin: "0 auto 18px",
          background: `linear-gradient(135deg, ${T.color.sage}, ${T.color.moss})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 16px ${T.color.sage}44`,
        }}>
          <Icon type="shoe" size={26} color={T.color.white} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: T.color.sage,
            textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6,
          }}>
            Week {weekNum}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900, color: T.color.charcoal,
            fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 8,
          }}>
            {session.name}
          </div>
          <div style={{ fontSize: 14, color: T.color.charcoalMuted, lineHeight: 1.5 }}>
            {session.desc}
          </div>
        </div>

        <button
          onClick={onConfirm}
          style={{
            width: "100%", padding: "16px", borderRadius: T.radius.lg, border: "none",
            background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
            color: T.color.white, fontSize: 16, fontWeight: 800,
            fontFamily: T.font.display, cursor: "pointer",
            boxShadow: `0 6px 20px ${T.color.moss}44`,
            marginBottom: 12,
          }}>
          Mark as done
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: "100%", padding: "12px", background: "none", border: "none",
            color: T.color.charcoalMuted, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: T.font.body,
          }}>
          Not yet
        </button>
      </div>
    </>
  );
}
