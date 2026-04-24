import { T } from "../../../tokens";
import Icon from "../../../components/ui/Icon";

export default function ScreenWelcome({ onNext, onOpenModal }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0 0" }}>
      <div style={{
        width: 76, height: 76, borderRadius: T.radius.full,
        background: `linear-gradient(135deg, ${T.color.sage} 0%, ${T.color.moss} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 22px",
        boxShadow: `0 12px 36px ${T.color.sage}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}>
        <Icon type="leaf" size={34} color={T.color.white} strokeWidth={2.2} />
      </div>

      <div style={{ fontSize: 44, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 0.95, letterSpacing: -1.2 }}>
        1RUN.UK
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: T.color.moss, fontFamily: T.font.display, lineHeight: 1.25, marginTop: 10, padding: "0 8px" }}>
        Move more. Eat well.<br />Every healthy habit begins somewhere.
      </div>
      <div style={{ fontSize: 13, color: T.color.charcoalMuted, marginTop: 14, marginBottom: 22, padding: "0 20px", lineHeight: 1.5 }}>
        A gentler start to running and eating well.
      </div>

      {/* Benefits card */}
      <button onClick={onOpenModal} style={{
        width: "100%", background: T.color.white, border: `1.5px solid ${T.color.ivoryDark}`,
        borderRadius: T.radius.xl, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
        boxShadow: "0 1px 3px rgba(59,63,58,0.05)", textAlign: "left", transition: "all 0.2s ease",
      }}>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {[
            { bg: T.color.apricotLight, icon: "trophy", color: T.color.apricot, z: 3 },
            { bg: T.color.sageLight, icon: "run", color: T.color.sage, z: 2, ml: -12 },
            { bg: T.color.skyLight, icon: "utensils", color: T.color.sky, z: 1, ml: -12 },
          ].map((b) => (
            <div key={b.icon} style={{
              width: 36, height: 36, borderRadius: T.radius.full, background: b.bg,
              border: `2px solid ${T.color.ivory}`, display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: b.z, marginLeft: b.ml,
            }}>
              <Icon type={b.icon} size={16} color={b.color} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>See why 1RUN.UK is different</div>
          <div style={{ fontSize: 12, color: T.color.charcoalMuted, marginTop: 2 }}>Built for beginners. Moves at your pace.</div>
        </div>
        <Icon type="chevronR" size={18} color={T.color.charcoalMuted} />
      </button>

      {/* Keyline divider */}
      <div style={{ height: 1, background: T.color.ivoryDark, margin: "22px 0" }} />

      {/* Sign-up buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onNext} style={{
          width: "100%", padding: "15px", background: T.color.moss, color: T.color.white,
          border: "none", borderRadius: T.radius.lg, fontSize: 15, fontWeight: 800, fontFamily: T.font.display,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: `0 4px 14px ${T.color.moss}33`,
        }}>
          <Icon type="mail" size={17} color={T.color.white} />
          Sign up with email
        </button>
        <button onClick={onNext} style={{
          width: "100%", padding: "15px", background: T.color.white, color: T.color.charcoal,
          border: `2px solid ${T.color.ivoryDark}`, borderRadius: T.radius.lg,
          fontSize: 15, fontWeight: 700, fontFamily: T.font.display, cursor: "pointer",
        }}>
          Continue with Google
        </button>
      </div>

      {/* Keyline above sign in */}
      <div style={{ height: 1, background: T.color.ivoryDark, margin: "16px 0 14px" }} />

      {/* Sign in CTA */}
      <button onClick={onNext} style={{
        width: "100%", padding: "14px",
        background: T.color.white,
        border: `2px solid ${T.color.moss}`,
        borderRadius: T.radius.lg,
        fontSize: 14, fontWeight: 800, color: T.color.moss,
        fontFamily: T.font.display, cursor: "pointer",
        letterSpacing: 0.1,
      }}>
        Already have an account? Sign in
      </button>
    </div>
  );
}
