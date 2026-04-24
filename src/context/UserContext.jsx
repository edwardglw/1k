import { createContext, useContext, useState, useEffect } from "react";
import { WEEKS } from "../data/programme";

const WEEK_BADGE_MESSAGES = {
  1: "First week done. You showed up — that's the hardest part.",
  2: "Two weeks in. A habit is forming.",
  3: "Halfway there. You're running now.",
  4: "Four weeks done. You're stronger than you were a month ago.",
  5: "Five weeks down. One to go.",
  6: "You ran your first kilometre. That's everything.",
};

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  displayName: "",
  ambition: "",
  activity: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  targetWeight: "",
  injuries: [],
  reward: "",
  calorieAllowance: null,
};

const DEFAULT_PROGRESS = {
  currentWeek: 1,
  sessionsDone: {},   // key: "w{week}-s{idx}" → true
  weighIns: [],       // [{ week, value }]
  badges: [],         // [{ type, label, message, earnedAt }]
  startWeight: null,
  programmeStarted: false,
  programmeComplete: false,
};

function calcAllowance(profile) {
  const w = parseFloat(profile.weight) || 75;
  const h = parseFloat(profile.height) || 170;
  const a = parseInt(profile.age) || 30;
  const mult = profile.activity === "sedentary" ? 1.2 : profile.activity === "light" ? 1.375 : 1.55;
  let bmr;
  if (profile.gender === "male") bmr = 10 * w + 6.25 * h - 5 * a + 5;
  else if (profile.gender === "female") bmr = 10 * w + 6.25 * h - 5 * a - 161;
  else bmr = 10 * w + 6.25 * h - 5 * a - 78;
  const tdee = bmr * mult;
  const targetDelta = parseFloat(profile.targetWeight) || 0;
  const dailyDeficit = ((targetDelta / 6) * 7700) / 7;
  return Math.max(1200, Math.round(tdee + dailyDeficit));
}

export function UserProvider({ children }) {
  const [profile, setProfileRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fr_profile")) || DEFAULT_PROFILE; }
    catch { return DEFAULT_PROFILE; }
  });

  const [progress, setProgressRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fr_progress")) || DEFAULT_PROGRESS; }
    catch { return DEFAULT_PROGRESS; }
  });

  useEffect(() => {
    localStorage.setItem("fr_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("fr_progress", JSON.stringify(progress));
  }, [progress]);

  const setProfile = (updates) => setProfileRaw((p) => ({ ...p, ...updates }));
  const setProgress = (updates) => setProgressRaw((p) => ({ ...p, ...updates }));

  const completeOnboarding = (data) => {
    const allowance = calcAllowance(data);
    setProfileRaw({ ...data, calorieAllowance: allowance });
    setProgressRaw({
      ...DEFAULT_PROGRESS,
      startWeight: parseFloat(data.weight) || null,
      programmeStarted: true,
    });
  };

  const markSessionDone = (weekNum, sessionIdx) => {
    const key = `w${weekNum}-s${sessionIdx}`;
    if (progress.sessionsDone[key]) return null;

    const newSessionsDone = { ...progress.sessionsDone, [key]: true };
    let earnedBadge = null;

    if (Object.keys(progress.sessionsDone).length === 0) {
      earnedBadge = {
        type: "first_session",
        label: "First step",
        message: "You started. That's everything.",
        earnedAt: Date.now(),
      };
    } else {
      const week = WEEKS[weekNum - 1];
      const weekComplete = week?.sessions.every((_, i) => newSessionsDone[`w${weekNum}-s${i}`]);
      if (weekComplete) {
        earnedBadge = {
          type: `week_${weekNum}_complete`,
          label: weekNum === WEEKS.length ? "1RUN.UK complete" : `Week ${weekNum} done`,
          message: WEEK_BADGE_MESSAGES[weekNum] ?? `Week ${weekNum} complete.`,
          earnedAt: Date.now(),
        };
      }
    }

    const doneDate = new Date().toISOString().split("T")[0];
    setProgressRaw((p) => ({
      ...p,
      sessionsDone: { ...p.sessionsDone, [key]: doneDate },
      badges: earnedBadge ? [...p.badges, earnedBadge] : p.badges,
    }));

    return earnedBadge;
  };

  const unmarkSessionDone = (weekNum, sessionIdx) => {
    const key = `w${weekNum}-s${sessionIdx}`;
    setProgressRaw((p) => {
      const newSessionsDone = { ...p.sessionsDone };
      delete newSessionsDone[key];

      let newBadges = p.badges.filter(b => b.type !== `week_${weekNum}_complete`);
      if (Object.keys(newSessionsDone).length === 0) {
        newBadges = newBadges.filter(b => b.type !== "first_session");
      }

      return { ...p, sessionsDone: newSessionsDone, badges: newBadges };
    });
  };

  const isSessionDone = (weekNum, sessionIdx) =>
    !!progress.sessionsDone[`w${weekNum}-s${sessionIdx}`];

  const getSessionDate = (weekNum, sessionIdx) => {
    const val = progress.sessionsDone[`w${weekNum}-s${sessionIdx}`];
    if (!val || val === true) return null;
    try {
      const d = new Date(val);
      return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    } catch { return null; }
  };

  const getWeekStatus = (weekNum) => {
    const week = WEEKS[weekNum - 1];
    if (!week) return "locked";
    const doneSessions = week.sessions.filter((_, i) => isSessionDone(weekNum, i)).length;
    if (doneSessions === week.sessions.length) return "complete";
    if (weekNum === progress.currentWeek) return "current";
    if (weekNum < progress.currentWeek) return "complete";
    return "locked";
  };

  const logWeighIn = (value) => {
    const week = progress.currentWeek;
    const updated = progress.weighIns.filter((w) => w.week !== week);
    setProgress({ weighIns: [...updated, { week, value }] });
  };

  const hasWeighedInThisWeek = () =>
    progress.weighIns.some((w) => w.week === progress.currentWeek);

  const isUnder18 = parseInt(profile.age) < 18 && parseInt(profile.age) >= 14;

  const totalSessions = WEEKS.reduce((acc, w) => acc + w.sessions.length, 0);
  const sessionsCompleted = Object.keys(progress.sessionsDone).length;

  return (
    <UserContext.Provider value={{
      profile,
      setProfile,
      progress,
      setProgress,
      completeOnboarding,
      markSessionDone,
      unmarkSessionDone,
      isSessionDone,
      getSessionDate,
      getWeekStatus,
      logWeighIn,
      hasWeighedInThisWeek,
      isUnder18,
      calcAllowance,
      totalSessions,
      sessionsCompleted,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
