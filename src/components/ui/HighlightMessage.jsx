import { T } from "../../tokens";

export default function HighlightMessage({ title, body, tone = "sage", animate }) {
  const styles = {
    sage: { bg: T.color.sageLight, accent: T.color.moss },
    apricot: { bg: T.color.apricotLight, accent: T.color.apricot },
    sky: { bg: T.color.skyLight, accent: T.color.sky },
  }[tone];
  return (
    <div style={{
      background: styles.bg,
      borderRadius: T.radius.xl,
      padding: "18px 20px",
      boxShadow: `0 2px 12px ${styles.accent}22`,
      animation: animate ? "fadeIn 0.35s ease" : undefined,
    }}>
      {title && (
        <div style={{ fontSize: 16, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginBottom: 6, lineHeight: 1.3 }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 14, color: T.color.charcoal, lineHeight: 1.55, fontWeight: 500 }}>{body}</div>
    </div>
  );
}
