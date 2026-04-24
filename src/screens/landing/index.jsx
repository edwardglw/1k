import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import BenefitsModal from "../../components/BenefitsModal";
import "./Landing.css";

const WEEKS = [
  { num: "Week 1", title: "First steps",     desc: "Mostly walking. Short easy jogs. Get comfortable moving." },
  { num: "Week 2", title: "Finding rhythm",  desc: "Longer run intervals. Rest when you need to." },
  { num: "Week 3", title: "Building base",   desc: "Continuous running starts here. Still short." },
  { num: "Week 4", title: "Halfway",         desc: "Your body adapts. Runs feel easier already." },
  { num: "Week 5", title: "Going further",   desc: "Pushing past 800m. Nearly there." },
  { num: "Week 6", title: "Your 1K",         desc: "Run a full kilometre, start to finish." },
];

const STEPS = [
  { num: "1", title: "Tell us about yourself", body: "A quick two-minute setup. We personalise your plan around your fitness level, schedule, and goals." },
  { num: "2", title: "Follow the programme",   body: "Three sessions a week, each one carefully paced. Walk when you need to — that's the point." },
  { num: "3", title: "Run your 1K",            body: "By week six, you'll run a full kilometre without stopping. Your first. Not your last." },
];

const FEATURES = [
  { icon: "🏃", title: "Adaptive training plan",  body: "Personalised to your age, fitness level, and schedule. Not a one-size-fits-all PDF." },
  { icon: "🍽️", title: "Weekly eating habits",    body: "One small food habit introduced each week. No calorie counting. No diet culture." },
  { icon: "📈", title: "Progress you can see",    body: "Sessions, streaks, and weight — tracked simply. Celebrate the small wins." },
  { icon: "🎯", title: "Your reward, your rules", body: "Set a reward for finishing. We'll remind you what you're working towards." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showBenefits, setShowBenefits] = useState(false);

  const startOnboarding = () => navigate("/signup");

  return (
    <div className="lp">
      {/* NAV */}
      <nav className="lp-nav">
        <a href="/" className="lp-logo">1RUN<span>.UK</span></a>
        <button className="lp-nav-btn" onClick={() => navigate("/signin")}>Sign in</button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="lp-hero-overlay" />

        <div className="lp-hero-content">
          <span className="lp-eyebrow">6-week programme · personalised to you</span>
          <h1 className="lp-headline">Run your first <em>1K.</em></h1>
          <p className="lp-tagline">Move more. Eat well.<br />Every healthy habit begins somewhere.</p>
          <p className="lp-sub">A gentler start to running and eating well — your programme is built around you, then adapts as you improve.</p>

          {/* Benefits card */}
          <button className="lp-benefits-card" onClick={() => setShowBenefits(true)}>
            <div className="lp-benefits-icons">
              {[
                { bg: "rgba(232,168,124,0.22)", color: "#E8A87C", icon: "trophy" },
                { bg: "rgba(122,155,118,0.22)", color: "#7A9B76", icon: "run"    },
                { bg: "rgba(139,184,208,0.22)", color: "#8BB8D0", icon: "utensils" },
              ].map((b) => (
                <div key={b.icon} className="lp-benefits-icon" style={{ background: b.bg }}>
                  <Icon type={b.icon} size={14} color={b.color} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div className="lp-benefits-label">See why 1RUN.UK is different</div>
              <div className="lp-benefits-sub">Personalised to you. Built for beginners.</div>
            </div>
            <Icon type="chevronR" size={16} color="rgba(250,247,242,0.45)" />
          </button>

          {/* Sign-up CTAs */}
          <div className="lp-ctas">
            <button className="lp-cta lp-cta--email" onClick={startOnboarding}>
              <svg className="lp-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <span className="lp-cta-text">
                <span className="lp-cta-main">Register with email</span>
                <span className="lp-cta-free">Free · 2 min setup</span>
              </span>
            </button>
            <button className="lp-cta lp-cta--google" onClick={startOnboarding}>
              <svg className="lp-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="lp-cta-text">
                <span className="lp-cta-main">Continue with Google</span>
                <span className="lp-cta-free">Free · 2 min setup</span>
              </span>
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="lp-scroll-hint">
            <span className="lp-scroll-hint-text">See how it works</span>
            <div className="lp-scroll-arrow" />
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="lp-proof">
        {[
          { num: "6",  label: "Weeks" },
          { num: "18", label: "Sessions" },
          { num: "1K", label: "Goal" },
          { num: "0",  label: "Experience needed" },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: "contents" }}>
            <div className="lp-proof-item">
              <div className="lp-proof-num">{item.num}</div>
              <div className="lp-proof-label">{item.label}</div>
            </div>
            {i < arr.length - 1 && <div className="lp-proof-divider" />}
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section>
        <div className="lp-section">
          <p className="lp-section-label">How it works</p>
          <h2 className="lp-section-title">Three sessions a week.<br />That's it.</h2>
          <div className="lp-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-body">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEEK PREVIEW */}
      <section className="lp-weeks-wrap">
        <div className="lp-section">
          <p className="lp-section-label">Your plan at a glance</p>
          <h2 className="lp-section-title">Six weeks. Built to stick.</h2>
          <div className="lp-weeks-grid">
            {WEEKS.map((w) => (
              <div key={w.num} className="lp-week-card">
                <div className="lp-wk-num">{w.num}</div>
                <div className="lp-wk-title">{w.title}</div>
                <div className="lp-wk-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <div className="lp-section">
          <p className="lp-section-label">What's included</p>
          <h2 className="lp-section-title">Everything you need.<br />Nothing you don't.</h2>
          <div className="lp-features">
            {FEATURES.map((f) => (
              <div key={f.title} className="lp-feature">
                <div className="lp-feature-icon">{f.icon}</div>
                <div>
                  <div className="lp-feature-title">{f.title}</div>
                  <div className="lp-feature-body">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="lp-final">
        <p className="lp-section-label">Ready?</p>
        <h2 className="lp-section-title">Your first kilometre<br />is waiting.</h2>
        <p className="lp-section-sub">Takes two minutes to set up. Then just lace up and go.</p>
        <button className="lp-final-btn" onClick={startOnboarding}>
          Start for free
          <span className="lp-final-arrow">→</span>
        </button>
      </section>

      {/* HEALTH DISCLAIMER */}
      <section className="lp-disclaimer">
        <div className="lp-disclaimer-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="lp-disclaimer-body">
          <p className="lp-disclaimer-heading">A note before you start</p>
          <p className="lp-disclaimer-text">
            1RUN.UK is a general fitness programme designed for healthy adults who want to begin running.
            It is not medical advice and is not a substitute for guidance from a qualified health professional.
          </p>
          <p className="lp-disclaimer-text">
            If your GP or doctor has advised you not to exercise, or if you have a heart condition, recent
            injury, chronic illness, or any concern about your health, please seek medical clearance before
            starting this or any other exercise programme.
          </p>
          <p className="lp-disclaimer-text">
            Listen to your body. If something hurts beyond normal exertion — stop, rest, and seek advice.
            Progress at a pace that feels right for you.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">1RUN<span>.UK</span></div>
        <div className="lp-footer-note">Built for people who've never run before.</div>
      </footer>

      {showBenefits && <BenefitsModal onClose={() => setShowBenefits(false)} />}
    </div>
  );
}
