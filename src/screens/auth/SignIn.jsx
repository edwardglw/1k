import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { T } from "../../tokens";
import { useUser } from "../../context/UserContext";
import Icon from "../../components/ui/Icon";
import AtmosphericBG from "../../components/ui/AtmosphericBG";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(friendlyError(err.code));
      }
    } finally {
      setGoogleLoading(false);
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
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon type="chevronL" size={16} color={T.color.charcoalMuted} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.color.charcoalMuted }}>Back</span>
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32, marginTop: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: T.color.moss, fontFamily: T.font.display, letterSpacing: -0.5 }}>1RUN.UK</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.color.charcoal, fontFamily: T.font.display, marginTop: 8 }}>Welcome back</div>
          <div style={{ fontSize: 14, color: T.color.charcoalMuted, marginTop: 4 }}>Sign in to continue your programme</div>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          style={{
            width: "100%", padding: "14px", borderRadius: T.radius.lg,
            border: `1.5px solid ${T.color.ivoryDark}`,
            background: T.color.white, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontSize: 15, fontWeight: 700, color: T.color.charcoal,
            fontFamily: T.font.body, marginBottom: 16,
            opacity: googleLoading ? 0.7 : 1,
          }}>
          <GoogleIcon />
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: T.color.ivoryDark }} />
          <span style={{ fontSize: 12, color: T.color.charcoalMuted, fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: T.color.ivoryDark }} />
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
              placeholder="Your password"
              required
              autoComplete="current-password"
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
            disabled={loading || googleLoading}
            style={{
              width: "100%", padding: "15px", borderRadius: T.radius.lg, border: "none",
              background: `linear-gradient(135deg, ${T.color.moss}, ${T.color.sage})`,
              color: T.color.white, fontSize: 16, fontWeight: 800,
              fontFamily: T.font.display, cursor: "pointer",
              boxShadow: `0 4px 16px ${T.color.moss}44`,
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Sign up link */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: T.color.charcoalMuted }}>
          Don't have an account?{" "}
          <Link to="/onboarding" style={{ color: T.color.moss, fontWeight: 700, textDecoration: "none" }}>
            Start here
          </Link>
        </div>

      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 14px", borderRadius: T.radius.lg,
  border: `1.5px solid ${T.color.ivoryDark}`,
  background: T.color.white, fontSize: 15, fontFamily: "inherit",
  color: T.color.charcoal, outline: "none", boxSizing: "border-box",
};

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "No internet connection. Please check and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
