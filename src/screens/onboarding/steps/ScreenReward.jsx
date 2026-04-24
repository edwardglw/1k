import { T } from "../../../tokens";

const SUGGESTIONS = [
  "Peace and quiet for an afternoon",
  "A meal out with someone special",
  "New running shoes",
  "A long walk somewhere new",
  "A quiet day with a good book",
  "A massage",
];

export default function ScreenReward({ data, setData }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--title-col)", fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        Pick your reward
      </div>
      <div style={{ fontSize: 14, color: "var(--sub-col)", marginBottom: 20, lineHeight: 1.5 }}>
        Rewards are part of how we'll keep you going. Choose something you'll genuinely look forward to — it doesn't need to cost anything.
      </div>
      <input
        type="text"
        value={data.reward}
        onChange={(e) => setData({ ...data, reward: e.target.value })}
        placeholder="What will you treat yourself to?"
        style={{
          width: "100%", padding: "14px 16px", background: T.color.white,
          border: `2px solid ${data.reward ? T.color.sage : T.color.ivoryDark}`,
          borderRadius: T.radius.lg, fontSize: 15, fontWeight: 600, color: T.color.charcoal,
          fontFamily: T.font.body, outline: "none", boxSizing: "border-box", marginBottom: 14,
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--sub-col)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Some ideas
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => setData({ ...data, reward: s })} style={{
            background: data.reward === s ? T.color.sageLight : T.color.white,
            border: `1.5px solid ${data.reward === s ? T.color.sage : T.color.ivoryDark}`,
            borderRadius: T.radius.full, padding: "8px 14px",
            fontSize: 12.5, fontWeight: 600, color: T.color.charcoal, cursor: "pointer", fontFamily: T.font.body,
          }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
