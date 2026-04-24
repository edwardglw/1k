import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { T } from "../../tokens";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (WEAK_PASSWORDS.includes(password)) {
      setError("That password is too common. Please choose something harder to guess.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.color.ivory, fontFamily: T.font.body, position: "relative" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');`}</style>
      <AtmosphericBG />

      <div style={{ maxWidth: 430, margin: "0 auto", position: "relative", zIndex: 1, padding: "0 20px 48px" }}>

        {/* Back button */}
        <div style={{ paddingTop: 20, marginBottom: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon type="chevronL" size={16} color={T.color.charcoalMuted} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.color.charcoalMuted }}>Back</span>
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, marginTop: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: T.color.moss, fontFamily: T.font.display, letterSpacing: -0.5 }}>1RUN.UK</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginTop: 8 }}>Create your account</div>
          <div style={{ fontSize: 14, color: T.color.charcoalMuted, marginTop: 4, lineHeight: 1.5 }}>
            Free forever. We'll personalise your plan next.
          </div>
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: T.color.charcoal, display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: T.color.charcoal, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: "#FFF0F0", border: "1.5px solid #FFCCCC",
              borderRadius: T.radius.md, padding: "10px 14px",
              fontSize: 13, color: "#C0392B", fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "15px", borderRadius: T.radius.lg, border: "none",
              background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
              color: T.color.white, fontSize: 16, fontWeight: 800,
              fontFamily: T.font.display, cursor: "pointer",
              boxShadow: `0 4px 16px ${T.color.moss}44`,
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* Sign in link */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: T.color.charcoalMuted }}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: T.color.moss, fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: T.color.charcoalMuted, lineHeight: 1.5 }}>
          Free forever for your first 1K. No card required.
        </div>

      </div>
    </div>
  );
}


const inputStyle = {
  width: "100%", padding: "13px 14px", borderRadius: T.radius.lg,
  border: `1.5px solid ${T.color.ivoryDark}`,
  background: T.color.white, fontSize: 15, fontFamily: "inherit",
  color: T.color.charcoal, outline: "none", boxSizing: "border-box",
};

const WEAK_PASSWORDS = ["123456", "password", "12345678", "qwerty", "abc123", "111111", "password1", "iloveyou", "123123", "admin"];

function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "Please choose a stronger password — at least 8 characters.";
    case "auth/network-request-failed":
      return "No internet connection. Please check and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
