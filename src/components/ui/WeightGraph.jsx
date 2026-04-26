import { T } from "../../tokens";

export default function WeightGraph({ startWeight, targetWeight, weighIns, totalWeeks = 6 }) {
  const pad = { top: 14, right: 10, bottom: 22, left: 32 };
  const w = 320, h = 130;
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const allVals = [startWeight, targetWeight, ...weighIns.map((wi) => wi.value)].filter(Boolean);
  const minW = Math.min(...allVals) - 0.8;
  const maxW = Math.max(...allVals) + 0.3;

  const yS = (v) => pad.top + ((maxW - v) / (maxW - minW)) * innerH;
  const xS = (i) => pad.left + (i / (totalWeeks - 1)) * innerW;

  const targetLine = `M${xS(0)},${yS(startWeight)} L${xS(totalWeeks - 1)},${yS(targetWeight)}`;
  const actualPts = [
    `M${xS(0)},${yS(startWeight)}`,
    ...weighIns.map((wi) => `L${xS(wi.week - 1)},${yS(wi.value)}`),
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {[0, 1, 2, 3].map((i) => {
        const val = maxW - (i / 3) * (maxW - minW);
        return (
          <g key={i}>
            <line x1={pad.left} y1={yS(val)} x2={w - pad.right} y2={yS(val)} stroke={T.color.ivoryDark} strokeWidth="1" />
            <text x={pad.left - 6} y={yS(val) + 4} textAnchor="end" fill={T.color.charcoalMuted} fontSize="9" fontFamily={T.font.body}>{val.toFixed(1)}</text>
          </g>
        );
      })}
      {[...Array(totalWeeks)].map((_, i) => (
        <text key={i} x={xS(i)} y={h - 3} textAnchor="middle" fill={T.color.charcoalMuted} fontSize="9" fontFamily={T.font.body}>W{i + 1}</text>
      ))}
      <path d={targetLine} stroke={T.color.sage} strokeWidth="1.5" strokeDasharray="5 3" fill="none" opacity="0.4" />
      <path d={actualPts} stroke={T.color.moss} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xS(0)} cy={yS(startWeight)} r="4" fill={T.color.white} stroke={T.color.moss} strokeWidth="2.5" />
      <rect x={xS(0) + 8} y={yS(startWeight) - 9} width="52" height="14" rx="4" fill={T.color.moss} opacity="0.12" />
      <text x={xS(0) + 34} y={yS(startWeight) + 1} textAnchor="middle" fill={T.color.moss} fontSize="8" fontFamily={T.font.body} fontWeight="700">Start</text>
      {weighIns.map((wi) => (
        <circle key={wi.week} cx={xS(wi.week - 1)} cy={yS(wi.value)} r="4" fill={T.color.white} stroke={T.color.moss} strokeWidth="2.5" />
      ))}
    </svg>
  );
}
