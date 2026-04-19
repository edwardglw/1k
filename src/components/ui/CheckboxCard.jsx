import { T } from "../../tokens";
import Icon from "./Icon";

export default function CheckboxCard({ selected, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      width: "100%",
      background: selected ? T.color.sageLight : T.color.white,
      border: `2px solid ${selected ? T.color.moss : T.color.ivoryDark}`,
      borderRadius: T.radius.md,
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "left",
      boxShadow: "0 1px 3px rgba(59,63,58,0.05)",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 4, flexShrink: 0,
        background: selected ? T.color.moss : "transparent",
        border: `2px solid ${selected ? T.color.moss : T.color.charcoalLight}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <Icon type="check" size={13} color={T.color.white} />}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: T.color.charcoal, fontFamily: T.font.body }}>{label}</span>
    </button>
  );
}
