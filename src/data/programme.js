export const WEEKS = [
  {
    num: 1, label: "Foundation", phase: "Phase 1",
    movement: "3 × 15–20 min brisk walks + stretching exercises",
    eating: "Understand your calories",
    eatingDetail: "Know roughly how many you're eating. No obsessive tracking — just awareness.",
    sessions: [
      { name: "Session 1", desc: "15 min brisk walk + gentle stretches, calf raises" },
      { name: "Session 2", desc: "18 min brisk walk + leg swings, step-ups" },
      { name: "Session 3", desc: "20 min brisk walk + stretching circuit" },
    ],
  },
  {
    num: 2, label: "Foundation", phase: "Phase 1",
    movement: "3 × 20 min walks + stretching. 30-sec jog in session 3",
    eating: "Eat your calories — all of them",
    eatingDetail: "Don't go under as a shortcut. When you exercise, eat back what you burn.",
    sessions: [
      { name: "Session 1", desc: "20 min brisk walk + stretching exercises" },
      { name: "Session 2", desc: "20 min brisk walk + stretching circuit" },
      { name: "Session 3", desc: "20 min walk + stretching + 30-sec easy jog" },
    ],
  },
  {
    num: 3, label: "Building Jogging", phase: "Phase 2",
    movement: "Walk 2 min / jog 1 min × 4 repeats",
    eating: "Drink well",
    eatingDetail: "Keep well hydrated throughout the day. Alcohol calories add up quickly.",
    sessions: [
      { name: "Session 1", desc: "Walk 2 min / jog 1 min × 4 repeats" },
      { name: "Session 2", desc: "Walk 2 min / jog 1 min × 4 repeats" },
      { name: "Session 3", desc: "Walk 2 min / jog 1 min × 4 repeats" },
    ],
  },
  {
    num: 4, label: "Building Jogging", phase: "Phase 2",
    movement: "Walk 2 min / jog 90 sec × 4 repeats",
    eating: "Reduce ultra-processed food",
    eatingDetail: "Small swaps, not elimination. Practical and achievable changes.",
    sessions: [
      { name: "Session 1", desc: "Walk 2 min / jog 90 sec × 4 repeats" },
      { name: "Session 2", desc: "Walk 2 min / jog 90 sec × 4 repeats" },
      { name: "Session 3", desc: "Walk 2 min / jog 90 sec × 4 repeats" },
    ],
  },
  {
    num: 5, label: "Building to 1K", phase: "Phase 3",
    movement: "Walk/run intervals building to 4 min runs",
    eating: "Portion awareness",
    eatingDetail: "Simple visual guides — no weighing required.",
    sessions: [
      { name: "Session 1", desc: "Walk 2 min / run 2 min × 4 repeats" },
      { name: "Session 2", desc: "Walk 2 min / run 3 min × 3 repeats" },
      { name: "Session 3", desc: "Walk 3 min / run 4 min × 2 repeats" },
    ],
  },
  {
    num: 6, label: "Your 1K", phase: "Phase 3",
    movement: "Building to continuous 8–10 min run",
    eating: "Eating before & after exercise",
    eatingDetail: "What to eat and when, to support your sessions and recovery.",
    sessions: [
      { name: "Session 1", desc: "Walk 3 min / run 5 min × 2 repeats" },
      { name: "Session 2", desc: "Run 7 min, walk 3 min, run 3 min" },
      { name: "Session 3 — THE 1K", desc: "Continuous run 8–10 minutes" },
    ],
  },
];

export const EATING_HABITS = [
  { week: 1, title: "Understand your calories", detail: "Know roughly how many you're eating. No obsessive tracking — just awareness. Use an app or packet information to get a feel for it." },
  { week: 2, title: "Eat your calories — all of them", detail: "Don't go under as a shortcut. This isn't a crash diet, and under-eating is counterproductive and unhealthy. When you exercise, eat back what you burn." },
  { week: 3, title: "Drink well", detail: "Keep well hydrated with water throughout the day. Count the calories in alcohol and drink in moderation — alcohol calories add up quickly and affect recovery." },
  { week: 4, title: "Reduce ultra-processed food", detail: "Small swaps, not elimination. Practical and achievable changes." },
  { week: 5, title: "Portion awareness", detail: "Simple visual guides — no weighing required. Learning to recognise appropriate amounts." },
  { week: 6, title: "Eating before and after exercise", detail: "What to eat and when, to support your sessions and recovery." },
];
