# Detailed technical specification — Word Search (Fillword) web app

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, React, Framer Motion (optional), client-side algorithm.
**Goal:** build an app that takes a user-provided list of words, grid size, and allowed directions (subset of 8 compass directions) and computes an optimal placement of these words into a letter grid. The UI displays the grid, provides controls (generate, toggle solution highlighting, randomize, export), and allows interactive play.

---

## 1 — High-level features / user flows

1. Enter a list of words (manual paste / upload txt / choose sample).
2. Choose grid width and height (square or rectangular).
3. Choose allowed directions (8 options: N, NE, E, SE, S, SW, W, NW) — any subset.
4. Choose placement options: allow word overlap, allow word reuse, force all words placed or best-effort, letter bank constraints (optional).
5. Click **Generate** → algorithm finds a placement maximizing objective (see section Algorithm).
6. Display letter grid. Controls:
   - Toggle solution highlighting ON/OFF (shows placed words highlighted, orientation markers).
   - Show word list with status (placed / not placed).
   - Buttons: Regenerate (new layout), Shuffle remaining letters, Export (PNG / JSON), Print.
   - Optional: allow player to select letters to mark found words (game mode).

7. If generation fails to place all words, show best-effort placement and report which words are missing and why.
8. Persist last input in localStorage; optional server-side save for user accounts.

---

## 2 — Acceptance criteria (what “done” means)

- Given any list of words and allowed directions, the app returns a consistent grid or a clear error explaining impossibility.
- The algorithm attempts to place as many words as possible and prefers placements that maximize overlaps and compactness.
- UI displays letter grid and word list; toggling solution highlighting shows/hides the correct placements.
- Controls are responsive and accessible (keyboard + screen reader friendly).
- TypeScript types throughout; no `any` in core algorithm.
- Unit tests for core placement algorithm and at least smoke tests for key components.

---

## 3 — Data models / types (TypeScript)

```ts
type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

type Point = { x: number; y: number }; // 0-based, x across, y down

type WordItem = {
  id: string; // uuid
  text: string; // uppercase, no spaces by default
  length: number;
};

type PlacedWord = {
  wordId: string;
  start: Point;
  direction: Direction;
  positions: Point[]; // computed cells
};

type GridCell = {
  char: string; // letter
  placedWordIds: string[]; // one or more words using this cell
};

type Grid = {
  width: number;
  height: number;
  cells: GridCell[]; // length = width*height, row-major
};

type PlacementOptions = {
  allowOverlap: boolean; // overlaps allowed only if letters match
  requireAllWords: boolean; // fail if not all placed
  directions: Direction[];
  timeLimitMs?: number; // algorithm time limit
};
```

---

## 4 — Algorithm specification (detailed)

### Objective

Primary objective: maximize number of placed words.
Secondary objectives (tie-breakers, used in scoring): maximize total overlapped letters (shared cells), minimize occupied area (compactness), balance distribution (avoid extreme clustering), minimize the number of attempted placements (deterministic fallback).

### Approach (multi-stage, deterministic with randomness option)

1. **Preprocessing**
   - Normalize words: trim, uppercase, remove unsupported characters (optionally enforce alphabet).
   - Sort words by heuristic (default: descending length). Option: attempt different sort orders (longest-first, most-unique-first).

2. **Candidate generation**
   - For each word, compute all possible placements `(start, direction)` that fit inside the grid bounds.
   - If `allowOverlap` true: candidate placement is valid if for each cell either empty or same letter. If false: candidate must be in empty cells only.
   - Precompute candidates and their overlap score (how many cells would match existing letters if placed later).

3. **Search / placement strategy**
   - **Greedy backtracking with heuristics + time limit**:
     - Place words sequentially (starting order configurable). For each word, sort its candidates by best overlap (descending) and compactness (prefers placements closer to center).
     - Try candidate placements; on success, mark cells and continue to next word.
     - If stuck, backtrack up to N levels (configurable) or until time limit.

   - **Iterated improvement (optional):**
     - Run several passes with randomized tie-breaking to escape local maxima (e.g., change initial word order or shuffle candidate lists) and keep best solution found within `timeLimitMs`.

   - **Simulated annealing / genetic approach (advanced, optional):**
     - Represent solution as list of placements. Mutate by moving or rotating single word. Score each solution. Accept better solutions; occasionally accept worse per annealing schedule. Use for large grids/word lists.

4. **Scoring function** (for comparing solutions):

   ```
   score = placedWordsCount * LARGE + totalOverlapLetters * W1 - boundingBoxArea * W2 - penaltyForUnplacedLongWords * W3
   ```

   Choose constants: LARGE >> W1 >>> W2 to prefer placing words first.

5. **Output**
   - Best placement found (list of `PlacedWord` entries).
   - Grid filled with letters: for empty cells, fill with random letters from allowed alphabet or biased from letter frequency.
   - Report unplaced words (if any) and reason (no candidate, conflict with irremovable placements, grid too small).

### Complexity & performance

- Candidate generation: O(Words _ GridCells _ Directions) worst-case.
- Greedy/backtracking: heuristic to limit branching; add time limit (e.g., 500–2000 ms client-side).
- For large input (50+ words and large grid), recommend server-side heavy compute or limit iterations.

---

## 5 — App architecture & components

### Pages (App Router)

- `/` — Landing / generator page (main).
- `/play` — Fullscreen play mode (optional).
- `/api/generate` — (optional) server-side generation endpoint that runs algorithm (useful for heavy compute or sharing presets).

### Major React components

- `WordInputPanel`
  - Multi-line textarea for words; example presets; upload file; parse & normalize words.
  - Controls for grid size, allowed directions (8 toggle buttons), options checkboxes.
  - Generate button with spinner.

- `GridCanvas`
  - Renders grid of letters using CSS Grid or SVG.
  - Props: `grid`, `placedWords`, `highlightSolution` boolean, `interactiveMode`.
  - Each cell clickable; show tooltip with coordinates and placedWordIds.
  - ARIA roles for accessibility.

- `WordList`
  - Shows words with placement status, clickable to highlight word on grid.

- `ControlsBar`
  - Buttons: Regenerate, Randomize filler, Toggle highlight, Export, Print.

- `SettingsModal`
  - Algorithm parameters (time limit, strategy, randomness seed).

- `ExportModal`
  - JSON / PNG export (use html2canvas or canvas renderer).

- `Notifications` / `Toasts` for success/errors.

### Styling & visuals

- Tailwind for responsive layout.
- Use CSS Grid for the letter grid. Each cell square; responsive scaling.
- Smooth highlight transitions with Framer Motion (optional).

---

## 6 — UI/UX details

- Left side: controls + word list. Right side: large grid preview. On narrow screens, stacked.
- Word highlighting:
  - When solution highlight ON: draw colored rounded rectangles along placed word positions, color per word or per orientation.
  - When OFF: grid shows letters only; player can still select letters to find words themselves.

- Toggle to show directions overlay (arrows or orientation indicators).
- Show placement statistics: words placed, overlap count, score.
- On generation, animate placements appearing (fade-in).
- Keyboard navigation for grid: arrow keys to move focus; space to toggle selection.

---

## 7 — Accessibility (a11y)

- Provide semantic grid as a table or ARIA grid.
- Each cell has `aria-label="Row X, Column Y, Letter Z"`.
- All controls keyboard accessible, focus-visible.
- Contrast and readable fonts for letters (large, bold).
- Screen-reader friendly notifications (aria-live).

---

## 8 — Persistence & sharing

- Save last configuration in `localStorage` (words, grid size, options).
- Export:
  - JSON: full game state with placements and options.
  - PNG: snapshot of grid (use `html2canvas` or render to `<canvas>`).

- Optional server: save presets and allow sharing via short links.

---

## 9 — Testing

- Unit tests for:
  - Candidate generation (boundary cases).
  - Valid placement checks (overlap rules).
  - Scoring function.
  - Small end-to-end placement scenarios (deterministic seeds).

- Integration/UI tests (Playwright/Jest + React Testing Library):
  - Generate grid from sample words and assert at least X words placed.
  - Toggle highlight shows DOM elements with placement markers.

- Performance tests: ensure generation within acceptable time for target inputs (e.g., 10–30 words, 15×15 grid) on typical client.

---

## 10 — Deployment & build

- Build static Next.js app; all algorithm runs client-side by default.
- Host on Vercel or Netlify.
- If server compute used, deploy `/api/generate` as serverless function (Vercel Serverless, AWS Lambda). Ensure time limits and memory for heavy tasks.

---

## 11 — Iterative roadmap (milestones)

1. **MVP (1–2 days)**:
   - UI: Word input, grid size, directions toggles, generate button.
   - Algorithm: greedy longest-first placement, basic overlap rules, fill remaining letters randomly.
   - Display grid, show placed words, toggle highlighting.

2. **Polish (2–3 days)**:
   - Better heuristics, backtracking, time limit.
   - Animations, export to PNG/JSON, localStorage.
   - Accessibility improvements and unit tests.

3. **Advanced (2–4 days)**:
   - Iterated improvement / annealing for larger inputs.
   - Server-side generation option.
   - Multiplayer/game mode where users find words interactively.

4. **Extras**:
   - Presets themed (e.g., Ancient Egypt), printing layout, letter frequency-based filler, multilingual alphabets.

---

## 12 — Implementation notes & tips

- Always uppercase words and grid letters to simplify comparisons.
- Represent directions as vector deltas:

  ```ts
  const DIRS: Record<Direction, Point> = {
    N: { x: 0, y: -1 },
    NE: { x: 1, y: -1 },
    E: { x: 1, y: 0 },
    SE: { x: 1, y: 1 },
    S: { x: 0, y: 1 },
    SW: { x: -1, y: 1 },
    W: { x: -1, y: 0 },
    NW: { x: -1, y: -1 },
  };
  ```

- For deterministic behavior add an optional seedable RNG when doing randomized passes (use small seedable PRNG).
- For filling random letters, bias by letter frequency for better-looking grids.
- Keep algorithm configurable (time limit, backtracking depth) so client can adapt to device performance.

---

## 13 — Deliverables to implement first

1. TypeScript types + direction vectors + helper utils.
2. Candidate generator and simple greedy placer with overlap checks.
3. Next.js page with WordInputPanel, GridCanvas, WordList, ControlsBar.
4. Toggle highlight and export-to-JSON.
5. Unit tests for placement logic.
