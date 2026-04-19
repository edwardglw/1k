import { T } from "../../../tokens";
import Icon from "../../../components/ui/Icon";

function calcAllowance(data) {
  const w = parseFloat(data.weight) || 75;
  const h = parseFloat(data.height) || 170;
  const a = parseInt(data.age) || 30;
  const mult = data.activity === "sedentary" ? 1.2 : data.activity === "light" ? 1.375 : 1.55;
  let bmr;
  if (data.gender === "male") bmr = 10 * w + 6.25 * h - 5 * a + 5;
  else if (data.gender === "female") bmr = 10 * w + 6.25 * h - 5 * a - 161;
  else bmr = 10 * w + 6.25 * h - 5 * a - 78;
  const tdee = bmr * mult;
  const targetDelta = parseFloat(data.targetWeight) || 0;
  const dailyDeficit = ((targetDelta / 6) * 7700) / 7;
  return Math.max(1200, Math.round(tdee + dailyDeficit));
}

function SummaryRow({ icon, iconColor, label, value, subValue, onEdit, impact, isLast }) {
  const Tag = onEdit ? "button" : "div";
  return (
    <Tag
      onClick={onEdit}
      style={{
        width: "100%", textAlign: "left",
        padding: "14px 16px",
        borderBottom: isLast ? "none" : `1px solid ${T.color.ivoryDark}`,
        display: "flex", alignItems: "flex-start", gap: 12,
        background: "none", border: "none",
        cursor: onEdit ? "pointer" : "default",
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: T.radius.md, flexShrink: 0,
        background: (iconColor || T.color.sage) + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon type={icon} size={16} color={iconColor || T.color.sage} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ fontSize: 12, color: T.color.charcoalMuted, fontWeight: 600 }}>{label}</div>
          {onEdit && (
            <span style={{
              fontSize: 12, fontWeight: 700, color: T.color.sage,
              display: "flex", alignItems: "center", gap: 3, fontFamily: T.font.body,
              pointerEvents: "none",
            }}>
              <Icon type="edit" size={11} color={T.color.sage} />
              Edit
            </span>
          )}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginTop: 1, lineHeight: 1.3 }}>{value}</div>
        {subValue && (
          <div style={{ fontSize: 14, fontWeight: 700, color: T.color.charcoal, fontFamily: T.font.display, marginTop: 2, lineHeight: 1.3 }}>{subValue}</div>
        )}
        {impact && (
          <div style={{ fontSize: 12, color: T.color.sage, fontWeight: 600, marginTop: 3, lineHeight: 1.4, fontStyle: "italic" }}>{impact}</div>
        )}
      </div>
    </Tag>
  );
}

export default function ScreenPlanReady({ data, onEdit }) {
  const ageNum = parseInt(data.age) || 0;
  const isUnder18 = ageNum >= 14 && ageNum < 18;
  const allowance = calcAllowance(data);
  const targetAbs = data.weight && data.targetWeight !== ""
    ? (parseFloat(data.weight) + parseFloat(data.targetWeight)).toFixed(1)
    : "—";

  const injuries = Array.isArray(data.injuries) ? data.injuries : [];
  const needsEasier = injuries[0] === "easier";
  const injurySummary = injuries.length === 0 ? "Not answered yet"
    : needsEasier ? "Yes, taking it more easy"
    : "No, I feel ok";

  const activityLabel = data.activity === "sedentary" ? "Mostly sitting"
    : data.activity === "light" ? "A little movement"
    : data.activity === "moderate" ? "Fairly active"
    : "Not answered yet";
  const activityImpact = data.activity === "sedentary" ? "We'll start you gently — walks and stretching before any jogging."
    : data.activity === "light" ? "A great starting point — we'll build on what you already do."
    : data.activity === "moderate" ? "We'll let you pick up the pace a little sooner."
    : null;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{
          width: 60, height: 60, borderRadius: T.radius.full,
          background: `linear-gradient(135deg, ${T.color.sage} 0%, ${T.color.moss} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", boxShadow: `0 8px 24px ${T.color.sage}55`,
        }}>
          <Icon type="check" size={28} color={T.color.white} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.2 }}>
          Your plan is ready
        </div>
        <div style={{ fontSize: 13, color: T.color.charcoalMuted, marginTop: 4 }}>Here's what we've built just for you.</div>
      </div>

      <div style={{
        background: T.color.white, borderRadius: T.radius.xl, overflow: "hidden",
        border: `1.5px solid ${T.color.ivoryDark}`, boxShadow: "0 2px 10px rgba(59,63,58,0.05)",
      }}>
        <SummaryRow icon="trophy" iconColor={T.color.apricot} label="Ambition"
          value={data.ambition === "5K" ? "Work up to a parkrun (5K)" : "Your first 1K"}
          onEdit={() => onEdit(1)} />
        <SummaryRow icon="user" iconColor={T.color.sage} label="About you"
          value={[data.displayName, data.age ? `${data.age} yrs` : null, data.gender, data.height ? `${data.height} cm` : null].filter(Boolean).join(" · ") || "Not answered yet"}
          onEdit={() => onEdit(3)} />
        <SummaryRow icon="run" iconColor={T.color.sky} label="Current activity"
          value={activityLabel}
          impact={activityImpact}
          onEdit={() => onEdit(2)} />
        {!isUnder18 && (
          <SummaryRow icon="scale" iconColor={T.color.sage} label="Weight & goal"
            value={data.targetWeight === "0"
              ? `${data.weight || "—"} kg · maintain`
              : `${data.weight || "—"} kg → ${targetAbs} kg`}
            subValue={`${allowance} kcal / day`}
            impact={data.targetWeight === "0"
              ? "Move more, feel better — this is your number to fuel that."
              : "A realistic, steady target. You can absolutely do this in 6 weeks."}
            onEdit={() => onEdit(4)} />
        )}
        <SummaryRow icon="heart" iconColor={needsEasier ? T.color.sky : T.color.sage}
          label="Anything we should know?"
          value={injurySummary}
          impact={needsEasier ? "Phase 1–2 sessions adjusted for lower impact" : null}
          onEdit={() => onEdit(5)} />
        <SummaryRow icon="gift" iconColor={T.color.apricot} label="Your reward"
          value={data.reward || "Not set"} onEdit={() => onEdit(6)} isLast />
      </div>
    </div>
  );
}
