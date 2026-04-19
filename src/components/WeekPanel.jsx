import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function WeekPanel({ week, sessionsDone, onClose, onNav, hasPrev, hasNext, onSessionTap }) {
  return (
    <div style={{
      background: T.color.white,
      borderRadius: T.radius.xl,
      padding: "20px 18px",
      boxShadow: "0 4px 20px rgba(59,63,58,0.1)",
      animation: "fadeSlide 0.25s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.color.sage, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
            Week {week.num} · {week.phase}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.1 }}>
            {week.label}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          background: T.color.ivory, border: "none", borderRadius: T.radius.full,
          width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Icon type="x" size={16} color={T.color.charcoalMuted} />
        </button>
      </div>

      <div style={{ background: T.color.sageLight, borderRadius: T.radius.lg, padding: "14px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Icon type="shoe" size={14} color={T.color.moss} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.color.moss, textTransform: "uppercase", letterSpacing: 0.5 }}>Move</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: T.color.moss, fontFamily: T.font.display, lineHeight: 1.3, marginBottom: 14 }}>
          {week.movement}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {week.sessions.map((s, i) => {
            const done = sessionsDone[i];
            const tappable = !done && !!onSessionTap;
            return (
              <div
                key={i}
                onClick={tappable ? () => onSessionTap(i) : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: done ? T.color.white : "rgba(255,255,255,0.55)",
                  borderRadius: T.radius.md,
                  cursor: tappable ? "pointer" : "default",
                  transition: "opacity 0.15s ease",
                }}>
                <div style={{
                  width: 26, height: 26, borderRadius: T.radius.full, flexShrink: 0,
                  background: done ? T.color.sage : "transparent",
                  border: `2px solid ${done ? T.color.sage : T.color.sage + "44"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {done && <Icon type="check" size={12} color={T.color.white} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.color.charcoal, fontFamily: T.font.display }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: T.color.charcoalMuted, lineHeight: 1.3 }}>{s.desc}</div>
                </div>
                {tappable && (
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: T.color.apricot,
                    background: T.color.apricotLight, borderRadius: T.radius.full,
                    padding: "4px 10px", flexShrink: 0,
                  }}>
                    Log
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: T.color.apricotLight, borderRadius: T.radius.lg, padding: "14px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Icon type="leaf" size={14} color={T.color.apricot} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.color.apricot, textTransform: "uppercase", letterSpacing: 0.5 }}>Eat</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginBottom: 4 }}>{week.eating}</div>
        <div style={{ fontSize: 12, color: T.color.charcoal, lineHeight: 1.5, opacity: 0.75 }}>{week.eatingDetail}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => onNav(-1)} disabled={!hasPrev} style={{
          display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
          cursor: hasPrev ? "pointer" : "default", color: hasPrev ? T.color.moss : T.color.charcoalLight,
          fontSize: 13, fontWeight: 700, fontFamily: T.font.body, opacity: hasPrev ? 1 : 0.35,
        }}>
          <Icon type="chevronL" size={16} color={hasPrev ? T.color.moss : T.color.charcoalLight} />
          Week {week.num - 1}
        </button>
        <button onClick={() => onNav(1)} disabled={!hasNext} style={{
          display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
          cursor: hasNext ? "pointer" : "default", color: hasNext ? T.color.moss : T.color.charcoalLight,
          fontSize: 13, fontWeight: 700, fontFamily: T.font.body, opacity: hasNext ? 1 : 0.35,
        }}>
          Week {week.num + 1}
          <Icon type="chevronR" size={16} color={hasNext ? T.color.moss : T.color.charcoalLight} />
        </button>
      </div>
    </div>
  );
}
