import { T } from "../../tokens";
import Icon from "./Icon";

export default function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: `var(--sub-col, ${T.color.charcoalMuted})`, marginBottom: 6 }}>{label}</div>}
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 40px 14px 14px",
            background: T.color.white,
            border: `2px solid ${value ? T.color.sage : T.color.ivoryDark}`,
            borderRadius: T.radius.lg,
            fontSize: 15, fontWeight: 700,
            color: T.color.charcoal,
            fontFamily: T.font.display,
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <option value="" style={{ color: T.color.charcoalMuted }}>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <Icon type="chevronDown" size={18} color={T.color.charcoalMuted} />
        </div>
      </div>
    </div>
  );
}
