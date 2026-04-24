import { T } from "../../../tokens";
import Select from "../../../components/ui/Select";
import HighlightMessage from "../../../components/ui/HighlightMessage";

const buildAgeOptions = () => { const o = []; for (let a = 14; a <= 99; a++) o.push({ value: String(a), label: String(a) }); return o; };
const buildHeightOptions = () => { const o = []; for (let h = 140; h <= 210; h++) o.push({ value: String(h), label: `${h} cm` }); return o; };

export default function ScreenAboutYou({ data, setData }) {
  const ageNum = parseInt(data.age) || 0;
  const showOver50 = ageNum > 50 && data.activity === "sedentary";
  const showUnder18 = ageNum >= 14 && ageNum < 18;

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--title-col)", fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        A bit about you
      </div>
      <div style={{ fontSize: 14, color: "var(--sub-col)", marginBottom: 24, lineHeight: 1.5 }}>
        We use this to calibrate your programme and your calorie allowance.
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sub-col)", marginBottom: 6 }}>What should we call you?</div>
        <input
          type="text"
          value={data.displayName || ""}
          onChange={(e) => setData({ ...data, displayName: e.target.value })}
          placeholder="Your first name"
          style={{
            width: "100%", padding: "14px 14px", background: T.color.white,
            border: `2px solid ${data.displayName ? T.color.sage : T.color.ivoryDark}`,
            borderRadius: T.radius.lg, fontSize: 15, fontWeight: 700, color: T.color.charcoal,
            fontFamily: T.font.display, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <Select label="Age" value={data.age} onChange={(v) => setData({ ...data, age: v })}
          options={buildAgeOptions()} placeholder="Select" />
        <Select label="Sex at birth" value={data.gender} onChange={(v) => setData({ ...data, gender: v })}
          options={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
            { value: "na", label: "Prefer not to say" },
          ]} placeholder="Select" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select label="Height" value={data.height} onChange={(v) => setData({ ...data, height: v })}
          options={buildHeightOptions()} placeholder="Select your height" />
      </div>

      {showOver50 && (
        <HighlightMessage tone="sky" animate
          title="We'll extend Phase 1 for you"
          body="Since you're just starting out, we'll give you an extra week in Phase 1 — a gentler, more gradual start with additional rest day guidance. No rush." />
      )}
      {showUnder18 && (
        <HighlightMessage tone="sage" animate
          title="Your programme focuses on movement"
          body="We'll skip weight tracking and calorie counting — this is all about building a love of moving and healthy habits." />
      )}
    </div>
  );
}
