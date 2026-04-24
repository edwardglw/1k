import { T } from "../../../tokens";
import OptionCard from "../../../components/ui/OptionCard";
import HighlightMessage from "../../../components/ui/HighlightMessage";

function getActivityImpact(activity) {
  if (activity === "sedentary") return { title: "We'll start you gently", body: "Phase 1 begins with walks and stretching exercises — no jogging until week 2. We'll build a solid foundation first." };
  if (activity === "light") return { title: "A great starting point", body: "We'll build on the movement you already do. Your Phase 1 sessions will be slightly shorter in week 1 — you're a step ahead." };
  if (activity === "moderate") return { title: "We'll let you pick up the pace", body: "You'll move through Phase 2 a little faster — your body's already prepared for more. We'll still ease you in safely." };
  return null;
}

export default function ScreenActivity({ data, setData }) {
  const impact = getActivityImpact(data.activity);
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--title-col)", fontFamily: T.font.display, lineHeight: 1.2, marginBottom: 6 }}>
        How active are you right now?
      </div>
      <div style={{ fontSize: 14, color: "var(--sub-col)", marginBottom: 24, lineHeight: 1.5 }}>
        Be honest — this isn't a test. It helps us get your starting point right.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: impact ? 20 : 0 }}>
        <OptionCard selected={data.activity === "sedentary"} onClick={() => setData({ ...data, activity: "sedentary" })}
          icon="sofa" title="Mostly sitting" subtitle="I'm on the sofa most of the day" compact />
        <OptionCard selected={data.activity === "light"} onClick={() => setData({ ...data, activity: "light" })}
          icon="walk" iconColor={T.color.sky} title="A little movement" subtitle="I walk occasionally, maybe 10–20 mins a few times a week" compact />
        <OptionCard selected={data.activity === "moderate"} onClick={() => setData({ ...data, activity: "moderate" })}
          icon="run" iconColor={T.color.apricot} title="Fairly active" subtitle="I move regularly but don't exercise intentionally" compact />
      </div>
      {impact && <HighlightMessage tone="sage" title={impact.title} body={impact.body} animate />}
    </div>
  );
}
