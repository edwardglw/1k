import { T } from "../../tokens";
import Icon from "./Icon";

export default function OptionCard({ selected, onClick, icon, iconColor, title, subtitle, compact }) {
  return (
    <button onClick={onClick} style={{
      width: "100%",
      background: selected ? T.color.sageLight : T.color.white,
      border: `2px solid ${selected ? T.color.moss : T.color.ivoryDark}`,
      borderRadius: T.radius.xl,
      padding: compact ? "14px 16px" : "18px 20px",
      display: "flex", alignItems: "center", gap: 14,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "left",
      boxShadow: selected ? `0 3px 12px ${T.color.moss}22` : "0 1px 3px rgba(59,63,58,0.05)",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: T.radius.full, flexShrink: 0,
        background: selected ? T.color.moss : (iconColor || T.color.sage) + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon type={icon} size={19} color={selected ? T.color.white : (iconColor || T.color.sage)} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: T.color.charcoal, lineHeight: 1.45, marginTop: 2, opacity: 0.75 }}>{subtitle}</div>}
      </div>
      {selected && (
        <div style={{
          width: 22, height: 22, borderRadius: T.radius.full, flexShrink: 0,
          background: T.color.moss, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon type="check" size={13} color={T.color.white} />
        </div>
      )}
    </button>
  );
}
