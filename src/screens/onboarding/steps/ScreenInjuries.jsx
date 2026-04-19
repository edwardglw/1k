import { T } from "../../../tokens";
import OptionCard from "../../../components/ui/OptionCard";
import HighlightMessage from "../../../components/ui/HighlightMessage";

export default function ScreenInjuries({ data, setData }) {
  const select = (val) => setData({ ...data, injuries: [val] });
  const selected = data.injuries[0];

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        Anything we should know?
      </div>
      <div style={{ fontSize: 14, color: T.color.charcoal, marginBottom: 24, lineHeight: 1.5, opacity: 0.75 }}>
        We'll adjust your early sessions if you need a gentler start.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <OptionCard
          selected={selected === "easier"}
          onClick={() => select("easier")}
          icon="heart"
          iconColor={T.color.sky}
          title="Yes, I need to take it more easy"
          subtitle="I have a knee, back, or joint issue — or I'd just rather start gently."
        />
        <OptionCard
          selected={selected === "ok"}
          onClick={() => select("ok")}
          icon="check"
          iconColor={T.color.sage}
          title="No, I feel ok"
          subtitle="No injuries or concerns right now."
        />
      </div>
      <HighlightMessage tone="sky"
        title="A note on medical advice"
        body="FirstRun is not a substitute for medical advice. If in doubt, speak to your GP before starting." />
    </div>
  );
}
