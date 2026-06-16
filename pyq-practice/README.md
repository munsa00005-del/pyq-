# PrepVerse — JEE & NEET PYQ Practice Studio

A stylish, fully-interactive **frontend-only** practice app for previous-year
questions (PYQs) of **JEE Main, JEE Advanced and NEET** — organised
**section → subject → chapter → topic**, every question paired with a full
**worked solution**. Purple/violet theme. No backend.

Built with **React 18 + Vite + Tailwind v4 + Motion** (interactivity) and
**Remotion** (the animated intro, rendered live in the browser via
`@remotion/player`). Math is rendered with **KaTeX**.

---

## Run it

```bash
npm install      # already done
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

---

## What's included

- **Live Remotion intro** on the landing page (an orbiting JEE/Adv/NEET
  composition, looping in-browser — same code you'd render to `.mp4`).
- **Studio**: a chapter/topic tree sidebar with live question counts, full-text
  search, **year** and **difficulty** filters, **bookmarks**, and per-question
  progress.
- **Question view**: MCQ + numerical types, answer-commit, correct/wrong verdict,
  and a reveal-on-answer **worked solution**.
- **Progress** (accuracy, solved count, bookmarks) persisted to `localStorage` —
  no account, no server.

---

## ⚠️ About the question bank (read this)

The brief asked for *"all questions from 2000 till 2026"*. That is tens of
thousands of items across three exams, and **no clean, complete, openly-licensed
dataset exists to embed truthfully**. Rather than fabricate questions or
solutions (wrong answers in a study tool are worse than no answers), this ship
includes a **curated, hand-verified, representative set** spanning the exams,
subjects, years (2010–2024 in the seed) and difficulty levels.

**The architecture is the deliverable for scale.** Navigation, counts, filters
and the year range all derive from the data at runtime — so the app grows
automatically as you add questions. To expand toward the full archive, just add
more objects to the bank (or import a JSON file in the same shape). Empty
chapters show a `0` count and are non-clickable until populated.

### Question schema

Each entry in [`src/data/questions.js`](src/data/questions.js):

```js
{
  id: "phy-001",              // unique string
  exam: "jee-main",           // "jee-main" | "jee-advanced" | "neet"
  subject: "physics",         // "physics" | "chemistry" | "maths" | "biology"
  chapter: "Kinematics",      // MUST match a chapter in taxonomy.js for that subject
  topic: "Projectile Motion", // free text; topics are auto-collected per chapter
  year: 2021,                 // 2000–2026
  difficulty: "easy",         // "easy" | "medium" | "hard"
  source: "JEE Main 2021",    // shown above the question
  type: "single",             // "single" (MCQ) | "numerical"

  question: "... $LaTeX$ ...", // $inline$ and $$block$$ math via KaTeX

  // for type "single":
  options: ["$1:4$", "$1:2$", "$1:1$", "$2:1$"],
  answer: 0,                  // 0-based index of the correct option

  // for type "numerical":
  // answer: 25,              // the numeric value
  // tol: 0.01,               // optional tolerance (default 0)

  solution: "...$LaTeX$...",  // worked solution; \n for line breaks
}
```

**Rules**
- `chapter` must exactly match a string in `CHAPTERS[subject]` in
  [`src/data/taxonomy.js`](src/data/taxonomy.js), or it won't appear in the tree.
  Add new chapters there first.
- `topic` is free text — it's grouped automatically under its chapter.
- Math: wrap inline math in `$...$`, block math in `$$...$$`. Escape backslashes
  for JS strings (`\\frac`, `\\sqrt`, …).
- Always verify the `answer` and `solution` before adding. Accuracy is the point.

### Adding a batch from JSON

Drop a JSON array of objects (same shape) into `src/data/`, then at the top of
`questions.js`:

```js
import extra from "./jee-main-2023.json";
export const QUESTIONS = [ ...coreBank, ...extra ];
```

---

## Project structure

```
src/
  data/
    taxonomy.js     exams, subjects, full syllabus chapters, year range
    questions.js    the verified question bank (extend this)
    store.js        filtering / counting / derivation helpers
  hooks/
    useProgress.js  localStorage-backed attempts & bookmarks
  components/
    TopBar, Hero, Footer        landing + chrome
    Studio                      practice shell (filters, nav, paging)
    Sidebar                     chapter/topic tree
    QuestionView                single-question practice + solution
    MathText                    KaTeX renderer for mixed text+math
    RemotionIntro               embeds the Remotion composition
  remotion/
    IntroComposition.jsx        the animated intro (Remotion)
  index.css                     purple design system (Tailwind v4 @theme)
```

---

## Design notes

- One locked accent (violet) on a cool-ink neutral ramp; one radius scale; aurora
  gradient background (layered radials, not a flat blob). Purple was an explicit
  brief requirement, executed with restraint.
- Motion: hero/section reveals, animated nav/tab indicators (`layoutId`),
  spring-based progress bar, solution accordion. Respects
  `prefers-reduced-motion`.
- Accessibility: keyboard-operable controls, focus rings, WCAG-minded contrast,
  reduced-transparency fallback for glass surfaces.
