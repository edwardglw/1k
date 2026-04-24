import { useState } from "react";
import { T } from "../tokens";
import Icon from "./ui/Icon";

const APP_URL = "https://1k-beta.vercel.app";

const SOCIAL = [
  {
    key: "twitter",
    label: "X / Twitter",
    color: "#000",
    bg: "#f0f0f0",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.738-8.835L1.254 2.25H8.08l4.262 5.634L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>,
    href: (msg) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#fff",
    bg: "#25D366",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
    href: (msg) => `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#fff",
    bg: "#1877F2",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    href: (msg) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}&quote=${encodeURIComponent(msg)}`,
  },
];

export default function ShareSheet({ message, onClose }) {
  const [copied, setCopied] = useState(false);

  const copyMsg = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* no-op */ }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(59,63,58,0.45)", zIndex: 200 }} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: T.color.white, borderRadius: "20px 20px 0 0",
        padding: "24px 20px 36px",
        zIndex: 201,
        boxShadow: "0 -4px 24px rgba(59,63,58,0.14)",
        animation: "slideUp 0.2s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: T.color.charcoal, fontFamily: T.font.display }}>
            Share your progress
          </div>
          <button onClick={onClose} style={{
            background: T.color.ivory, border: "none", borderRadius: T.radius.full,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <Icon type="x" size={14} color={T.color.charcoalMuted} />
          </button>
        </div>

        <div style={{
          background: T.color.ivory, borderRadius: T.radius.lg,
          padding: "12px 14px", marginBottom: 16,
          fontSize: 13, color: T.color.charcoal, lineHeight: 1.5, fontWeight: 500,
          border: `1.5px solid ${T.color.ivoryDark}`,
        }}>
          {message}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SOCIAL.map((s) => (
            <a key={s.key} href={s.href(message)} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px",
              background: s.bg, borderRadius: T.radius.lg,
              textDecoration: "none", color: s.color,
              fontFamily: T.font.display, fontWeight: 700, fontSize: 14,
            }}>
              <span style={{ display: "flex", alignItems: "center", color: s.color }}>{s.icon}</span>
              {s.label}
            </a>
          ))}
          <button onClick={copyMsg} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "13px 16px", width: "100%",
            background: copied ? T.color.sageLight : T.color.ivory,
            border: `1.5px solid ${copied ? T.color.moss : T.color.ivoryDark}`,
            borderRadius: T.radius.lg, cursor: "pointer",
            fontFamily: T.font.display, fontWeight: 700, fontSize: 14,
            color: copied ? T.color.moss : T.color.charcoal,
            transition: "all 0.2s",
          }}>
            <Icon type={copied ? "check" : "share"} size={18} color={copied ? T.color.moss : T.color.charcoalMuted} />
            {copied ? "Copied!" : "Copy message"}
          </button>
        </div>
      </div>
    </>
  );
}
