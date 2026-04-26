import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
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

export const DEFAULT_PROFILE = {
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

export const DEFAULT_PROGRESS = {
  currentWeek: 1,
  sessionsDone: {},
  weighIns: [],
  badges: [],
  startWeight: null,
  programmeStarted: false,
  programmeComplete: false,
  weekFeedback: {},
  walkMult: 1.0,
  runMult: 1.0,
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

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

export function UserProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = loading
  const [profile, setProfileRaw] = useState(() => readLocal("fr_profile", DEFAULT_PROFILE));
  const [progress, setProgressRaw] = useState(() => readLocal("fr_progress", DEFAULT_PROGRESS));

  // ── Firebase auth listener ──────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user ?? null);
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        // Returning user — load Firestore data
        const data = snap.data();
        if (data.profile) {
          setProfileRaw(data.profile);
          localStorage.setItem("fr_profile", JSON.stringify(data.profile));
        }
        if (data.progress) {
          const merged = { ...DEFAULT_PROGRESS, ...data.progress };
          setProgressRaw(merged);
          localStorage.setItem("fr_progress", JSON.stringify(merged));
        }
      } else {
        // New user — save whatever's in local state to Firestore
        const localProfile = readLocal("fr_profile", DEFAULT_PROFILE);
        const localProgress = readLocal("fr_progress", DEFAULT_PROGRESS);
        await setDoc(ref, { profile: localProfile, progress: localProgress });
      }
    });
    return unsub;
  }, []);

  // ── Sync profile/progress → localStorage + Firestore ───────────────────
  useEffect(() => {
    localStorage.setItem("fr_profile", JSON.stringify(profile));
    if (firebaseUser && profile.displayName) {
      setDoc(doc(db, "users", firebaseUser.uid), { profile }, { merge: true }).catch(() => {});
    }
  }, [profile, firebaseUser]);

  useEffect(() => {
    localStorage.setItem("fr_progress", JSON.stringify(progress));
    if (firebaseUser && progress.programmeStarted) {
      setDoc(doc(db, "users", firebaseUser.uid), { progress }, { merge: true }).catch(() => {});
    }
  }, [progress, firebaseUser]);

  // ── Auth actions ────────────────────────────────────────────────────────
  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signUp = async (email, password) => {
    // Clear any stale local state so a new account always starts fresh
    localStorage.removeItem("fr_profile");
    localStorage.removeItem("fr_progress");
    setProfileRaw(DEFAULT_PROFILE);
    setProgressRaw(DEFAULT_PROGRESS);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const signOutUser = async () => {
    await firebaseSignOut(auth);
    setProfileRaw(DEFAULT_PROFILE);
    setProgressRaw(DEFAULT_PROGRESS);
    setFirebaseUser(null);
    localStorage.removeItem("fr_profile");
    localStorage.removeItem("fr_progress");
  };

  // ── Profile / progress setters ──────────────────────────────────────────
  const setProfile = (updates) => setProfileRaw((p) => ({ ...p, ...updates }));
  const setProgress = (updates) => setProgressRaw((p) => ({ ...p, ...updates }));

  const completeOnboarding = (data) => {
    const allowance = calcAllowance(data);
    setProfileRaw({ ...data, calorieAllowance: allowance });
    setProgressRaw({
      ...DEFAULT_PROGRESS,
      startWeight: parseFloat(data.weight) || null,
      programmeStarted: true,
      walkMult: data.injuries?.includes("easier") ? 1.1 : 1.0,
    });
  };

  // ── Session logic ───────────────────────────────────────────────────────
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
    const weekComplete = WEEKS[weekNum - 1]?.sessions.every((_, i) => newSessionsDone[`w${weekNum}-s${i}`]);
    const nextWeek = weekComplete && weekNum < WEEKS.length ? weekNum + 1 : null;

    setProgressRaw((p) => ({
      ...p,
      sessionsDone: { ...p.sessionsDone, [key]: doneDate },
      badges: earnedBadge ? [...p.badges, earnedBadge] : p.badges,
      currentWeek: nextWeek ? Math.max(p.currentWeek, nextWeek) : p.currentWeek,
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

  const applyWeekFeedback = (weekNum, feedback) => {
    setProgressRaw((p) => {
      const weekFeedback = { ...p.weekFeedback, [`w${weekNum}`]: feedback };
      let walkMult = p.walkMult ?? 1.0;
      let runMult = p.runMult ?? 1.0;
      if (feedback === "too_hard") {
        walkMult = Math.min(Math.round(walkMult * 1.1 * 100) / 100, 1.3);
      } else if (feedback === "too_easy") {
        runMult = Math.min(Math.round(runMult * 1.1 * 100) / 100, 1.3);
        walkMult = Math.max(Math.round(walkMult * 0.9 * 100) / 100, 0.8);
      }
      return { ...p, weekFeedback, walkMult, runMult };
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
    const allDone = week.sessions.every((_, i) => isSessionDone(weekNum, i));
    if (allDone) return "complete";
    // Current = first incomplete week where all prior weeks are fully done
    const priorComplete = WEEKS.slice(0, weekNum - 1).every((w, i) =>
      w.sessions.every((_, j) => isSessionDone(i + 1, j))
    );
    return priorComplete ? "current" : "locked";
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
      firebaseUser,
      authLoading: firebaseUser === undefined,
      profile,
      setProfile,
      progress,
      setProgress,
      completeOnboarding,
      signIn,
      signUp,
      signInWithGoogle,
      signOutUser,
      markSessionDone,
      unmarkSessionDone,
      applyWeekFeedback,
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
