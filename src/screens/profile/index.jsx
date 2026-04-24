import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../tokens";
import { WEEKS } from "../../data/programme";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";

const CALORIE_FIELDS = ["weight", "height", "age", "gender", "activity", "targetWeight"];

const AGE_OPTS    = Array.from({ length: 86 }, (_, i) => String(i + 14));
const HEIGHT_OPTS = Array.from({ length: 71 }, (_, i) => String(i + 140));
const WEIGHT_OPTS = (() => { const o = []; for (let w = 40; w <= 180; w += 0.5) o.push(w.toFixed(1)); return o; })();
const TARGET_OPTS = ["0", "-0.5", "-1", "-1.5", "-2", "-2.5", "-3", "-3.5", "-4", "-5", "-6"];
const TARGET_LABELS = {
  "0": "Same weight — just want to move",
  "-0.5": "Lose 0.5 kg", "-1": "Lose 1 kg", "-1.5": "Lose 1.5 kg",
  "-2": "Lose 2 kg", "-2.5": "Lose 2.5 kg", "-3": "Lose 3 kg",
  "-3.5": "Lose 3.5 kg", "-4": "Lose 4 kg", "-5": "Lose 5 kg", "-6": "Lose 6 kg",
};

const selectStyle = {
  width: "100%", padding: "11px 12px",
  background: T.color.ivory,
  border: `1.5px solid ${T.color.ivoryDark}`,
  borderRadius: T.radius.md,
  fontSize: 14, fontWeight: 700, color: T.color.charcoal,
  fontFamily: "'Nunito', sans-serif",
  outline: "none", appearance: "none", WebkitAppearance: "none",
  cursor: "pointer",
};

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginTop: 20 }}>
      {children}
    </div>
  );
}

function FieldRow({ label, isLast, children }) {
  return (
    <div style={{
      padding: "12px 16px",
      borderBottom: isLast ? "none" : `1px solid ${T.color.ivoryDark}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.color.charcoalMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            padding: "7px 14px", borderRadius: T.radius.full, border: "none",
            background: active ? T.color.moss : T.color.ivoryDark,
            color: active ? T.color.white : T.color.charcoal,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            transition: "all 0.15s ease",
          }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function InlineTextInput({ value, onSave, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  const start = () => { setDraft(value); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); };
  const commit = () => { onSave(draft); setEditing(false); };
  const handleKey = (e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px",
          background: T.color.white,
          border: `2px solid ${T.color.moss}`,
          borderRadius: T.radius.md,
          fontSize: 14, fontWeight: 700, color: T.color.charcoal,
          fontFamily: "'Nunito', sans-serif",
          outline: "none", boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <button onClick={start} style={{
      width: "100%", textAlign: "left", background: "none", border: "none",
      padding: "2px 0", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: value ? T.color.charcoal : T.color.charcoalLight, fontFamily: "'Nunito', sans-serif" }}>
        {value || placeholder}
      </span>
      <Icon type="edit" size={14} color={T.color.charcoalMuted} />
    </button>
  );
}

function NativeSelect({ value, options, labels, onChange, suffix = "" }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((o) => (
          <option key={o} value={o}>{labels ? labels[o] : `${o}${suffix}`}</option>
        ))}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon type="chevronDown" size={14} color={T.color.charcoalMuted} />
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile, calcAllowance, isUnder18, progress } = useUser();

  const save = (field, value) => {
    const updates = { [field]: value };
    if (CALORIE_FIELDS.includes(field)) {
      const merged = { ...profile, [field]: value };
      updates.calorieAllowance = calcAllowance(merged);
    }
    setProfile(updates);
  };

  const activityOptions = [
    { value: "sedentary", label: "Mostly sitting" },
    { value: "light", label: "A little movement" },
    { value: "moderate", label: "Fairly active" },
  ];
  const genderOptions = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "na", label: "Prefer not to say" },
  ];
  const injuryOptions = [
    { value: "ok", label: "I feel fine" },
    { value: "easier", label: "Taking it easy" },
  ];

  const injuryValue = profile.injuries?.[0] ?? "ok";

  return (
    <div style={{ minHeight: "100vh", background: T.color.ivory, fontFamily: "'Nunito', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Gradient title area ── */}
      <div style={{
        background: `linear-gradient(160deg, ${T.color.moss} 0%, ${T.color.sage} 100%)`,
        padding: "52px 20px 28px",
        position: "relative",
        boxShadow: `0 4px 24px ${T.color.moss}33`,
        maxWidth: "100%",
      }}>
        {/* X button */}
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Close profile"
          style={{
            position: "absolute", top: 20, right: 20,
            width: 38, height: 38, borderRadius: T.radius.full,
            background: "rgba(255,255,255,0.2)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <Icon type="x" size={18} color={T.color.white} />
        </button>

        {/* Branding + name */}
        <div style={{ animation: "fadeSlide 0.3s ease" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", letterSpacing: 2, marginBottom: 8,
          }}>
            1RUN.UK
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: T.color.white, lineHeight: 1.1, letterSpacing: -0.5 }}>
            {profile.displayName ? `${profile.displayName}'s profile` : "Your profile"}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ maxWidth: 430, margin: "0 auto", padding: "4px 20px 56px", animation: "fadeSlide 0.3s ease 0.05s both" }}>

        {/* Personal details */}
        <SectionLabel>Your details</SectionLabel>
        <div style={{ background: T.color.white, borderRadius: T.radius.xl, overflow: "hidden", boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
          <FieldRow label="Name">
            <InlineTextInput value={profile.displayName} onSave={(v) => save("displayName", v)} placeholder="Your first name" />
          </FieldRow>
          <FieldRow label="Age">
            <NativeSelect value={profile.age} options={AGE_OPTS} onChange={(v) => save("age", v)} suffix=" yrs" />
          </FieldRow>
          <FieldRow label="Sex at birth">
            <PillGroup options={genderOptions} value={profile.gender} onChange={(v) => save("gender", v)} />
          </FieldRow>
          <FieldRow label="Height" isLast>
            <NativeSelect value={profile.height} options={HEIGHT_OPTS} onChange={(v) => save("height", v)} suffix=" cm" />
          </FieldRow>
        </div>

        {/* Programme */}
        <SectionLabel>Your programme</SectionLabel>
        <div style={{ background: T.color.white, borderRadius: T.radius.xl, overflow: "hidden", boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
          <FieldRow label="Activity level">
            <PillGroup options={activityOptions} value={profile.activity} onChange={(v) => save("activity", v)} />
          </FieldRow>
          <FieldRow label="Any injuries or limitations?">
            <PillGroup options={injuryOptions} value={injuryValue} onChange={(v) => save("injuries", [v])} />
          </FieldRow>
          <FieldRow label="Your reward" isLast>
            <InlineTextInput value={profile.reward} onSave={(v) => save("reward", v)} placeholder="What are you working towards?" />
          </FieldRow>
        </div>

        {/* Weight & goal — hidden for under-18 */}
        {!isUnder18 && (
          <>
            <SectionLabel>Weight & goal</SectionLabel>
            <div style={{ background: T.color.white, borderRadius: T.radius.xl, overflow: "hidden", boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
              <FieldRow label="Starting weight">
                <NativeSelect value={profile.weight} options={WEIGHT_OPTS} onChange={(v) => save("weight", v)} suffix=" kg" />
              </FieldRow>
              <FieldRow label="6-week goal" isLast>
                <NativeSelect value={profile.targetWeight} options={TARGET_OPTS} labels={TARGET_LABELS} onChange={(v) => save("targetWeight", v)} />
              </FieldRow>
            </div>
            {profile.calorieAllowance && (
              <div style={{
                background: T.color.sageLight, borderRadius: T.radius.lg,
                padding: "10px 14px", marginTop: 8,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.color.moss }}>Daily calorie allowance</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: T.color.moss, fontFamily: "'Nunito', sans-serif" }}>
                  {profile.calorieAllowance} kcal
                </span>
              </div>
            )}
          </>
        )}

        {/* Account */}
        <SectionLabel>Account</SectionLabel>
        <div style={{ background: T.color.white, borderRadius: T.radius.xl, overflow: "hidden", boxShadow: "0 1px 4px rgba(59,63,58,0.06)" }}>
          <FieldRow label="Email">
            {profile.email ? (
              <span style={{ fontSize: 14, fontWeight: 700, color: T.color.charcoal, fontFamily: "'Nunito', sans-serif" }}>
                {profile.email}
              </span>
            ) : (
              <span style={{ fontSize: 14, fontWeight: 600, color: T.color.charcoalLight, fontFamily: "'Nunito', sans-serif" }}>
                No email saved yet
              </span>
            )}
          </FieldRow>

          {/* Sign up row */}
          <FieldRow label="New here?">
            <button onClick={() => {}} style={{
              background: "none", border: `1.5px solid ${T.color.ivoryDark}`,
              borderRadius: T.radius.md, padding: "9px 14px",
              fontSize: 13, fontWeight: 700, color: T.color.charcoalMuted,
              fontFamily: "'Nunito', sans-serif", cursor: "pointer",
            }}>
              Create account
            </button>
          </FieldRow>

          {/* Extra keyline between sign up and sign in */}
          <div style={{ height: 1, background: T.color.ivoryDark, margin: "0 16px" }} />

          {/* Sign in row */}
          <FieldRow label="Already have an account?" isLast>
            <button onClick={() => {}} style={{
              background: T.color.moss, border: "none",
              borderRadius: T.radius.md, padding: "10px 18px",
              fontSize: 13, fontWeight: 800, color: T.color.white,
              fontFamily: "'Nunito', sans-serif", cursor: "pointer",
              letterSpacing: 0.2,
            }}>
              Sign in
            </button>
          </FieldRow>
        </div>
        <div style={{ fontSize: 11, color: T.color.charcoalMuted, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
          Your data is stored on this device. Sign-in coming soon.
        </div>

      </div>
    </div>
  );
}
