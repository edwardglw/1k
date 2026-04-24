import { T } from "../../tokens";

export default function Icon({ type, size = 20, color = T.color.charcoal, strokeWidth = 2 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    clock: <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    badge: <svg {...p}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" fill={color} stroke="none" opacity="0.15" /><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>,
    heart: <svg {...p}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 000-7.5z" /></svg>,
    gift: <svg {...p}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18" /><path d="M12 8c-2-3-6-3-6 0s4 0 6 0c2-3 6-3 6 0s-4 0-6 0" /></svg>,
    check: <svg {...p}><path d="M20 6L9 17l-5-5" /></svg>,
    shoe: <svg {...p}><path d="M3 18h18M5 18v-4l2-3 3 1 3-2 3 2 3-1v7" /></svg>,
    leaf: <svg {...p}><path d="M17 8C8 10 5.9 16.2 3.8 19.5M17 8c2-1 4 0 4 3.5S17 20 10 22M17 8c-3 5-6 8-8 10" /></svg>,
    chevronR: <svg {...p}><path d="M9 18l6-6-6-6" /></svg>,
    chevronL: <svg {...p}><path d="M15 18l-6-6 6-6" /></svg>,
    chevronDown: <svg {...p}><path d="M6 9l6 6 6-6" /></svg>,
    x: <svg {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>,
    trophy: <svg {...p}><path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3M18 9h3a1 1 0 001-1V5a1 1 0 00-1-1h-3" /><path d="M6 4h12v5a6 6 0 01-12 0V4z" /><path d="M9 17h6M12 13v4" /><rect x="8" y="17" width="8" height="2" rx="1" /></svg>,
    star: <svg {...p}><path d="M12 2l3 6.2 6.8 1-5 4.8L18 21l-6-3.2L6 21l1.2-7-5-4.8 6.8-1z" fill={color} stroke="none" /></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
    plus: <svg {...p}><path d="M12 5v14M5 12h14" /></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
    percent: <svg {...p}><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
    parkrun: <svg {...p}><circle cx="12" cy="5" r="2" /><path d="M10 22l1-7M14 22l-1-7" /><path d="M8 10l4 2 4-2" /><path d="M12 12v3" /></svg>,
    sofa: <svg {...p}><path d="M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4" /><path d="M2 14v2a2 2 0 002 2h16a2 2 0 002-2v-2a2 2 0 00-2-2H4a2 2 0 00-2 2z" /><path d="M6 18v2M18 18v2" /></svg>,
    walk: <svg {...p}><circle cx="12" cy="5" r="2" /><path d="M10 22l2-7 2 7" /><path d="M8 12l4 1 4-1" /><path d="M12 13v3" /></svg>,
    run: <svg {...p}><circle cx="13" cy="4" r="2" /><path d="M7 22l3-8M17 22l-3-8" /><path d="M6 11l5 1 5-3" /><path d="M11 12v2" /></svg>,
    scale: <svg {...p}><path d="M12 3v18M5 8l7-5 7 5" /><path d="M2 14a5 5 0 005 5M17 19a5 5 0 005-5" /><circle cx="4" cy="14" r="1" fill={color} /><circle cx="20" cy="14" r="1" fill={color} /></svg>,
    target: <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill={color} stroke="none" /></svg>,
    flame: <svg {...p}><path d="M12 2c1 3 4 4 4 8a4 4 0 01-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-4 0-8z" /></svg>,
    edit: <svg {...p}><path d="M17 3l4 4-12 12H5v-4z" /></svg>,
    info: <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
    mail: <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>,
    utensils: <svg {...p}><path d="M3 2v7a2 2 0 002 2h1v11h2V11h1a2 2 0 002-2V2H9V6H7V2H5V6H4V2H3z" /><path d="M19 2h-2v20h2V12h1a2 2 0 000-4h-1V2z" /></svg>,
    share: <svg {...p}><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>,
    shareNode: <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  };
  return icons[type] || null;
}
