import { T } from "../tokens";
import Icon from "./ui/Icon";

export default function WeekButton({ num, status, isGoal, isSelected, onClick }) {
  const isDone = status === "complete";
  const isCurrent = status === "current";
  const isLocked = !isDone && !isCurrent && !isGoal;

  let bg, border, textColor, shadow, animation;

  if (isGoal) {
    bg = isSelected ? T.color.white : T.color.apricotLight;
    border = T.color.apricot;
    textColor = T.color.apricot;
    shadow = isSelected ? `0 4px 14px ${T.color.apricot}44` : `0 2px 6px ${T.color.apricot}33, inset 0 1px 0 rgba(255,255,255,0.5)`;
  } else if (isDone) {
    bg = isSelected ? T.color.white : T.color.sage;
    border = T.color.moss;
    textColor = isSelected ? T.color.moss : T.color.white;
    shadow = isSelected ? `0 4px 14px ${T.color.moss}44` : `0 2px 6px ${T.color.sage}44, inset 0 1px 0 rgba(255,255,255,0.25)`;
  } else if (isCurrent) {
    bg = isSelected ? T.color.white : T.color.moss;
    border = T.color.moss;
    textColor = isSelected ? T.color.moss : T.color.white;
    shadow = isSelected
      ? `0 4px 14px ${T.color.moss}44`
      : `0 2px 8px ${T.color.moss}55, inset 0 1px 0 rgba(255,255,255,0.15)`;
    animation = isSelected ? undefined : "weekPulse 2s ease-in-out infinite";
  } else {
    bg = isSelected ? "#5E635D" : T.color.ivoryDark;
    border = isSelected ? "#5E635D" : T.color.ivoryDark;
    textColor = isSelected ? T.color.white : T.color.charcoalLight;
    shadow = isSelected ? "0 4px 12px rgba(59,63,58,0.28)" : "0 1px 2px rgba(59,63,58,0.06)";
  }

  const borderWidth = isSelected ? "3px" : "2.5px";

  return (
    <>
      <style>{`
        @keyframes weekPulse {
          0%, 100% { box-shadow: 0 2px 8px ${T.color.moss}55, 0 0 0 0 ${T.color.moss}44; }
          50% { box-shadow: 0 2px 8px ${T.color.moss}55, 0 0 0 5px ${T.color.moss}00; }
        }
      `}</style>
      <button
        onClick={onClick}
        aria-label={isGoal ? "Your goal" : `Week ${num}`}
        style={{
          width: 42, height: 42,
          borderRadius: T.radius.full,
          background: bg,
          border: `${borderWidth} solid ${border}`,
          color: textColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease",
          transform: isSelected ? "scale(1.15)" : "scale(1)",
          boxShadow: shadow,
          animation,
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
        {isCurrent && !isSelected && (
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 5, height: 5, borderRadius: T.radius.full,
            background: T.color.apricot,
            border: `1.5px solid ${T.color.white}`,
          }} />
        )}
      </button>
    </>
  );
}
