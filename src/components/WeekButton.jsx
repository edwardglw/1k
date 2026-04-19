import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function WeekButton({ num, status, isGoal, isSelected, onClick }) {
  const isDone = status === "complete";
  const isCurrent = status === "current";

  let bg, border, textColor, shadow;
  if (isGoal) {
    bg = isSelected ? T.color.apricot : T.color.apricotLight;
    border = isSelected ? T.color.apricot : T.color.apricot + "66";
    textColor = isSelected ? T.color.white : T.color.apricot;
    shadow = isSelected ? `0 4px 12px ${T.color.apricot}55` : `0 2px 6px ${T.color.apricot}33, inset 0 1px 0 rgba(255,255,255,0.5)`;
  } else if (isDone) {
    bg = isSelected ? T.color.moss : T.color.sage;
    border = isSelected ? T.color.moss : T.color.sage;
    textColor = T.color.white;
    shadow = isSelected ? `0 4px 12px ${T.color.moss}55` : `0 2px 6px ${T.color.sage}44, inset 0 1px 0 rgba(255,255,255,0.25)`;
  } else if (isCurrent) {
    bg = isSelected ? T.color.moss : T.color.white;
    border = T.color.moss;
    textColor = isSelected ? T.color.white : T.color.moss;
    shadow = isSelected ? `0 4px 12px ${T.color.moss}55` : `0 2px 6px ${T.color.moss}22, inset 0 1px 0 rgba(255,255,255,0.7)`;
  } else {
    bg = T.color.ivoryDark;
    border = T.color.ivoryDark;
    textColor = T.color.charcoalLight;
    shadow = "0 1px 2px rgba(59,63,58,0.06)";
  }

  return (
    <button
      onClick={onClick}
      aria-label={isGoal ? "Your goal" : `Week ${num}`}
      style={{
        width: 42, height: 42,
        borderRadius: T.radius.full,
        background: bg,
        border: `2.5px solid ${border}`,
        color: textColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease",
        transform: isSelected ? "scale(1.15)" : "scale(1)",
        boxShadow: shadow,
        fontFamily: T.font.display,
        fontSize: 15,
        fontWeight: 900,
      }}
    >
      {isGoal ? <Icon type="trophy" size={17} color={textColor} /> : num}
      {isDone && !isGoal && (
        <div style={{
          position: "absolute", top: -4, right: -4,
          width: 14, height: 14, borderRadius: T.radius.full,
          background: T.color.apricot,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${T.color.white}`,
          boxShadow: `0 1px 3px ${T.color.apricot}55`,
        }}>
          <Icon type="star" size={7} color={T.color.white} />
        </div>
      )}
    </button>
  );
}
