import { T } from "../../../tokens";
import Select from "../../../components/ui/Select";
import HighlightMessage from "../../../components/ui/HighlightMessage";

const buildWeightOptions = () => {
  const o = [];
  for (let w = 40; w <= 180; w += 0.5) {
    const v = w.toFixed(1);
    o.push({ value: v, label: `${v} kg` });
  }
  return o;
};

const TARGET_OPTIONS = [
  { value: "0", label: "Same weight — I just want to get moving" },
  { value: "-0.5", label: "Lose 0.5 kg" },
  { value: "-1", label: "Lose 1 kg" },
  { value: "-1.5", label: "Lose 1.5 kg" },
  { value: "-2", label: "Lose 2 kg" },
  { value: "-2.5", label: "Lose 2.5 kg" },
  { value: "-3", label: "Lose 3 kg" },
  { value: "-3.5", label: "Lose 3.5 kg" },
  { value: "-4", label: "Lose 4 kg" },
  { value: "-5", label: "Lose 5 kg" },
  { value: "-6", label: "Lose 6 kg" },
];

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

export default function ScreenWeight({ data, setData }) {
  const delta = data.targetWeight !== "" ? parseFloat(data.targetWeight) : null;
  const hasTarget = data.weight && data.targetWeight !== "";
  const aggressive = delta !== null && delta <= -4;
  const isMaintenance = delta === 0;
  const allowance = hasTarget ? calcAllowance(data) : null;

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--title-col)", fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        Your weight & 6-week goal
      </div>
      <div style={{ fontSize: 14, color: "var(--sub-col)", marginBottom: 24, lineHeight: 1.5 }}>
        Small, steady progress is the goal. Be kind to yourself. Both fields are optional — skip if you'd rather not track weight.
      </div>

      <div style={{ marginBottom: 14 }}>
        <Select label="Current weight (optional)" value={data.weight} onChange={(v) => setData({ ...data, weight: v })}
          options={buildWeightOptions()} placeholder="Select your weight" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select label="In 6 weeks, I'd like to…" value={data.targetWeight} onChange={(v) => setData({ ...data, targetWeight: v })}
          options={TARGET_OPTIONS} placeholder="Choose a goal" />
      </div>

      {!hasTarget && (
        <HighlightMessage tone="sage"
          title="What's realistic?"
          body="Most people can healthily lose 0.5–1 kg per week. A 2–3 kg goal over 6 weeks is a great place to start. You can adjust this any time." />
      )}

      {hasTarget && aggressive && (
        <div style={{ marginBottom: 14 }}>
          <HighlightMessage tone="apricot" animate
            title="That's an ambitious goal"
            body="Losing more than 3 kg in 6 weeks is a stretch. You can still choose it, but we'll encourage a more sustainable pace as you go." />
        </div>
      )}

      {hasTarget && (
        <div style={{
          background: `linear-gradient(135deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`,
          borderRadius: T.radius.xl, padding: "20px 22px",
          boxShadow: `0 6px 20px ${T.color.moss}44`, position: "relative", overflow: "hidden",
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
            Your daily allowance
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: T.color.white, fontFamily: T.font.display, lineHeight: 1, letterSpacing: -0.5 }}>{allowance}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>kcal / day</div>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.95)", lineHeight: 1.5, fontWeight: 500 }}>
            {isMaintenance
              ? <>Eat your calories — <strong>all of them</strong>. When you exercise, you earn more. This isn't restriction — it's balance.</>
              : <>Eat your calories — <strong>all of them</strong>. When you exercise, eat back what you burn. This isn't a crash diet — it's a plan you can stick to.</>
            }
          </div>
        </div>
      )}
    </div>
  );
}
