import { T } from "../../../tokens";
import OptionCard from "../../../components/ui/OptionCard";

export default function ScreenAmbition({ data, setData }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--title-col)", fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        What would you love to achieve?
      </div>
      <div style={{ fontSize: 14, color: "var(--sub-col)", marginBottom: 24, lineHeight: 1.5 }}>
        No wrong answer. You can always change your mind.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <OptionCard selected={data.ambition === "1K"} onClick={() => setData({ ...data, ambition: "1K" })}
          icon="trophy" title="Run my first 1K"
          subtitle="I'll think about 5K later — let's start with something real." />
        <OptionCard selected={data.ambition === "5K"} onClick={() => setData({ ...data, ambition: "5K" })}
          icon="parkrun" iconColor={T.color.apricot} title="Work up to a parkrun"
          subtitle="5K on a Saturday morning with others — that's my dream." />
      </div>
    </div>
  );
}
