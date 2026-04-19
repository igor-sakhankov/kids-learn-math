# 🧒 UX Audit — Ages 5-9

Milestone **M2.1** from `README.md`. This doc is the working log for the kid-first UX audit + refinement pass. Every screen gets a section; each section lists findings against the checklist, a fix list, and a status.

> **Target audience reminder.** Kids 5-9 years old. Many are pre-readers or early readers. Fine motor skills are still developing. They tap, mis-tap, re-tap, and lose patience in under 2 seconds. Controls must be big, forgiving, and obvious without words.

---

## 0. Universal checklist

Every screen is scored against these rules. Numbered for reference in findings (e.g. "fails U3, U7").

| # | Rule | Target value |
|---|------|---|
| U1 | Primary action touch target | ≥ 64pt (prefer 72pt) |
| U2 | Secondary / back touch target | ≥ 56pt |
| U3 | Spacing between tap targets | ≥ 16pt |
| U4 | Body text | ≥ 20pt |
| U5 | Primary prompt / question text | ≥ 24pt |
| U6 | Heading text | ≥ 32pt |
| U7 | One primary action per screen | biggest, boldest, thumb-reachable |
| U8 | Back button | top-left, same icon, ≥ 56pt, on every non-root screen |
| U9 | Affordance without reading | icon + color + shape recognizable for pre-readers |
| U10 | Error tolerance | gentle shake + hint after 2 wrong tries; never block progress |
| U11 | Tap visual feedback | <100ms scale/press state on every pressable |
| U12 | Reading load | ≤ 1 short sentence per screen that a child must read |
| U13 | Modal discipline | big, labeled dismiss button; no `×`-only closers |
| U14 | Drag fallback | every drag has tap-to-select equivalent |
| U15 | Colorblind-safe | color always paired with icon or shape |
| U16 | No timers / countdowns / fail states | confirmed per screen |

---

## 1. Design-token state of play

Baseline from [src/utils/constants.js](src/utils/constants.js) at audit start:

- `SIZING.MIN_TOUCH_TARGET` = **48pt** → bump to **64**
- Missing token: add `SIZING.PRIMARY_TARGET` = **72**
- Missing token: add `SIZING.SECONDARY_TARGET` = **56**
- Missing token: add `SIZING.GAP` = **16** (inter-target spacing)
- `TYPOGRAPHY.SIZES.body` = **18** → bump to **20**
- `TYPOGRAPHY.SIZES.subtitle` = **22** → bump to **24** (primary prompts)
- `TYPOGRAPHY.SIZES.title` = **26** → bump to **30**
- `TYPOGRAPHY.SIZES.heading` = **34** → keep (or bump to 36)
- `TYPOGRAPHY.SIZES.tiny` = **14** → forbid for kid-facing text; allow only parent/meta

Design-token commit is the **first** fix commit; everything else builds on it.

---

## 2. Screen audit sections

### 2.1 WelcomeScreen

**Status:** ✅ pass
**File:** [src/screens/WelcomeScreen.js](src/screens/WelcomeScreen.js)

#### What works
- Single, obvious primary action (`Let's start` with 🚀 icon). **U7 pass.**
- Mascot sits above the card — focal point is clear without reading.
- Button uses `size="large"` → `minHeight: 60`, `title` text (26pt). Close to target.
- Decorative emoji row (🍎 ➕ 🌳 ⭐) hints at content themes without requiring reading. **U9 pass.**
- Loading state handled gracefully while contexts hydrate.

#### Findings
- [ ] **U1:** Start button `minHeight: 60pt` — 4pt below 64 target. Need `large` variant bumped to 64 minimum (72 ideal).
- [ ] **U5:** `question` text uses `subtitle` (22pt) — below 24pt primary-prompt floor.
- [ ] **U6:** `greeting` uses `heading` (34pt) — passes, but only because `heading` is already large enough. After token bumps, recheck.
- [ ] **U9:** Mascot is `professor-corgi.jpeg` — PRD specifies "Robot Logik" as the companion. Placeholder-OK for M2.1; flag for M2.3 art pass. Not a checklist failure, but a product-intent gap.
- [ ] **U11:** Verified — `Button` uses `Pressable` with `translateY` on press. Pass.
- [ ] **U16:** No timers/fail states. Pass.

#### Fix list
1. Bump `Button` large variant `minHeight` → 64 (done via tokens + Button change).
2. Raise `question` text size to new `subtitle` = 24pt after token bump.
3. Leave mascot swap for M2.3; add a `TODO(M2.3): replace with Robot Logik` comment next to the `Image` source.

#### Notes
Welcome has near-ideal structure for this audience — one big thing to tap and nothing else. The fixes are purely token-driven.

---

### 2.2 MainMenuScreen

**Status:** ✅ pass
**File:** [src/screens/MainMenuScreen.js](src/screens/MainMenuScreen.js)

#### What works
- Six learn/play tiles via `TileButton` (`size="medium"`, `minHeight: 130`). Big, colorful, icon-forward. **U1 pass, U9 pass.**
- Sections separated by header with icon + title ("📚 Learn math", "🎮 Play games") — pre-reader can pattern-match.
- Press state on TileButton via `translateY + borderBottomWidth` — squishy feedback. **U11 pass.**
- Tile layout is 2-column — on a 360dp screen each tile is ~168dp wide. Roomy.

#### Findings
- [ ] **U1:** `PillAction` (bottom row Progress + Settings) uses `minHeight: SIZING.MIN_TOUCH_TARGET = 48` → below 64.
- [ ] **U4:** `PillAction.pillLabel` fontSize `body` (18) → below 20 floor. Also `pillIcon` only 22pt next to a primary label.
- [ ] **U4:** `helloSub` (header subtitle) uses `small` (16pt) — kid-facing greeting text below 20pt floor.
- [ ] **U6:** Section titles use `title` (26pt) — passes current floor, but recheck after token bump to 30.
- [ ] **U9:** Progress/Settings pills read as visually secondary to the tiles (smaller, flat). Fine as **secondary** — matches U7 "one primary action per section". Keep hierarchy, just enlarge the pills to U2 (56).
- [ ] **U3:** `gridCell` uses `padding: 6` (12pt between tiles). Below 16pt gap target. Noticeable on 5" screens.
- [ ] **U11:** TileButton + PillAction both have press states. Pass.
- [ ] **U16:** No timers. Pass.
- [ ] **U8:** No back button — this is the hub, so U8 doesn't apply. Pass.

#### Fix list
1. `PillAction` minHeight → 56 (new `SECONDARY_TARGET`), label font → 20, icon font → 26.
2. `helloSub` font → 18→20, or drop to a one-liner using new `body`.
3. Grid cell `padding: 6` → `padding: 8` (gap becomes 16).

#### Notes
The menu is the most "kid-ready" screen today. Only the bottom utility pills feel undersized.

---

### 2.3 ProgressScreen

**Status:** ✅ pass
**File:** [src/screens/ProgressScreen.js](src/screens/ProgressScreen.js)

#### What works
- Tree hero card with a huge 🌳 emoji (120pt) + stage label. Visual-first. **U9 pass.**
- Growth bar (`progressBar` 24pt tall) + "leaves until next stage" text — clear progression cue.
- Stat chips (2×2 grid) use emoji + big number + label — pre-reader friendly.
- Skill bars paired with their own emoji + color — color + icon satisfies **U15**.

#### Findings
- [ ] **U2/U8:** Back button is at the **bottom** of a scrolling view (`variant="secondary"`, default medium size → `minHeight: 48`). Kid must scroll to reach it. Move to **top-left** as a pill/icon button. Bump to 56.
- [ ] **U4:** `progressText`, `statLabel`, `skillName` all use `small` (16pt) — below 20pt floor.
- [ ] **U4:** `skillPct` also `small` — percentages are meta for a child, but still below floor.
- [ ] **U5:** `sectionTitle` uses `title` (26pt) — close; re-check after `title` bump to 30.
- [ ] **U3:** `statChip` grid uses `margin: '1%'` → <16pt gap on small screens. Tighten by going to a fixed `gap: SIZING.GAP`.
- [ ] **U12:** The screen has ~4 textual regions (stage, progress hint, stats, skills). A pre-reader would be visually overwhelmed without an adult. Consider: collapse skills behind an optional expand, or rely purely on icons + numbers above the fold.
- [ ] **U16:** No timers. Pass.

#### Fix list
1. Replace bottom back button with a top-left icon back button (shared component — see §4).
2. Bump all `small` kid-facing labels to `body` (≥ 20pt post-token).
3. Replace `margin: '1%'` stat grid with `gap: SIZING.GAP` and re-measure.
4. Optional content pass: demote skill-percent numbers into parent-mode view; keep kid view icon-heavy.

#### Notes
First screen where **U8 is clearly violated** — back buried at the bottom. Fix is universal via the new shared `BackButton` component.

---

### 2.4 SettingsScreen

**Status:** ✅ pass
**File:** [src/screens/SettingsScreen.js](src/screens/SettingsScreen.js)

> **Audience note.** Settings is primarily parent-facing. U4-U6 can relax for adult meta text, but control targets (U1/U2/U3) still apply — a kid might open it.

#### What works
- Language options show flag 🇬🇧🇷🇺🇪🇸 + native name + check ✓ when active. **U9 & U15 pass.**
- Three distinct card sections (language / sound / accessibility) with colored bands + icons.
- Active language has a colored border + mint background, not color alone. **U15 pass.**

#### Findings
- [ ] **U2:** `languageOption` minHeight = `MIN_TOUCH_TARGET` (48). Needs 56+.
- [ ] **U2:** `settingRow` minHeight = 48. Needs 56+. Native `Switch` itself is only ~51×31 — below the 56-wide-target, though the whole row is tappable via the Switch's gesture. Consider wrapping the row in a Pressable that toggles the switch so the full-width target is live.
- [ ] **U8:** Back button at the bottom (`variant="secondary"`, default `medium`, minWidth 200) — same problem as Progress. Move to top-left, size 56.
- [ ] **U4:** `settingLabel` uses `body` (18) — OK post-token bump to 20.
- [ ] **U11:** `TouchableOpacity` with `activeOpacity={0.8}` — has feedback. Pass. But consider switching to `Pressable` for consistency with the rest of the app.
- [ ] **U15:** Switch track uses `lightBlue` vs `grassDeep` — relies on color for on/off. A visible "on/off" text or a sun/moon icon in the thumb would help colorblind kids. Low priority since this screen is parent-facing.

#### Fix list
1. Shared top-left back button (same as Progress).
2. Wrap each `SettingRow` in a `Pressable` so the whole row toggles; bump minHeight to 56.
3. `languageOption` minHeight → 56 + 16pt vertical padding.
4. (Nice to have) Pair switch track color with on/off icon.

---

### 2.5 AdditionVisualScreen

**Status:** ✅ pass
**File:** [src/screens/learning/AdditionVisualScreen.js](src/screens/learning/AdditionVisualScreen.js)

#### What works
- Visual group + equation row → child sees **meaning** before symbol. PRD-aligned. **U9 pass.**
- Progress bar + "Question X / 10" tells them how much is left.
- `NumberPad` is large, bottom-anchored, thumb-reachable.
- Correct/incorrect tint on the card (`cardCorrect`/`cardIncorrect`) paired with a feedback icon (🎉 / 💭). **U15 pass.**

#### Findings
- [ ] **U1:** `NumberPad` keys `minHeight: 60` — 4pt below target; primary interaction for 10 questions. Bump to 64.
- [ ] **U3:** Pad rows use `gap: 10` (<16). Bump to `SIZING.GAP`.
- [ ] **U4:** `questionNumber` uses `small` (16) — below floor. Lesson header is kid-facing.
- [ ] **U4:** `instruction` uses `body` (18) — below floor; it's the main instruction.
- [ ] **U5:** Object group emoji are `fontSize: 30` — the **mathematical objects** are tiny. These are the focal point; they should be the biggest thing on screen after the equation. Target 44-56pt.
- [ ] **U8:** **No back button during the lesson** — only the DifficultyPicker has one. Once the child picks a level, they're trapped until they finish 10 questions or the parent uses the Android hardware back. **Critical fail.**
- [ ] **U10:** Error handling: wrong answer flashes red card → clears after 800ms → no hint after N attempts. `StoryProblemsScreen` has a hint system; this screen doesn't. **U10 fail** — need to port `HINT_AFTER_ATTEMPTS` wiring here.
- [ ] **U11:** NumberPad keys have press states. Pass.
- [ ] **U12:** Instruction is a single short sentence. Pass.
- [ ] **U15:** Card tint + emoji both communicate correct/incorrect. Pass.
- [ ] **U16:** No timers. Pass.

#### Fix list
1. Shared top-left back button with a quick "Leave lesson?" confirmation modal (U13).
2. Add hint logic after 2 wrong attempts (port from StoryProblems).
3. Bump object emoji to 48-56pt; re-flow `objectGroup` `maxWidth` if needed.
4. `NumberPad` minHeight via token → 64; row gap → 16.
5. Promote `instruction` font from `body` to `subtitle` after token bump (24pt).
6. Promote `questionNumber` to `body` (20).

#### Notes
Along with U8 and U10, the small object emoji (U5) is a real product-intent gap: the PRD's "from concrete to abstract" principle depends on the objects being **visually dominant**.

---

### 2.6 SubtractionVisualScreen

**Status:** ✅ pass
**File:** [src/screens/learning/SubtractionVisualScreen.js](src/screens/learning/SubtractionVisualScreen.js)

Structurally identical to AdditionVisual — same findings apply.

#### Specific-to-this-screen
- Crossed-out removed objects (`textDecorationLine: 'line-through'` + opacity 0.25) — clever visual for subtraction. **U9 pass.**
- Extra hint text "How many left?" below objects (`hint` style, `body` font) — another reading burden; **U12** borderline. Rely on the equation row + visual, and keep the hint but make it voice/audio in a later phase.

#### Fix list
Inherit §2.5's fix list. Additionally:
1. Either shrink or remove the duplicated "how many left?" text once object emoji are bigger — the equation `? = ?` already tells the story.

---

### 2.7 StoryProblemsScreen

**Status:** ✅ pass
**File:** [src/screens/learning/StoryProblemsScreen.js](src/screens/learning/StoryProblemsScreen.js)

#### What works
- Robot bubble 🤖 + speech card gives the story a voice. Charming, PRD-aligned.
- **Hint system wired in** — after `HINT_AFTER_ATTEMPTS = 2` wrong tries, a yellow hint card appears with `robot.hint_1`. This is the **reference implementation** for U10 across the app.
- Story card with warm yellow background draws the eye to the problem.
- Skip button exists so a truly stuck kid isn't locked in.

#### Findings
- [ ] **U1:** `NumberPad` same 60pt issue as Addition/Subtraction.
- [ ] **U2:** Skip button is `size="small"` → `minHeight: 40`. Way below 56. For a "get unstuck" control this is the worst possible size.
- [ ] **U4:** `robotSpeech` uses `body` (18) — below floor.
- [ ] **U5:** `storyText` uses `subtitle` (22) — the **main kid-facing question**. After token bump to 24 this passes; today it's 2pt short.
- [ ] **U8:** Same — no top-left back button.
- [ ] **U9:** "Skip" wording (`common.next`) is ambiguous — "next" suggests "I'm done". Rename to something like "new_problem" / "try another" in locales, and give it a 🔄 icon.
- [ ] **U10:** Hint reveal is correct. **Pass.** Good template for other lesson screens.
- [ ] **U12:** Story text + robot speech + skip label = three text clusters. Trim the robot speech until audio lands.
- [ ] **U15:** Correct/incorrect uses tinted card + feedback emoji. Pass.

#### Fix list
1. Shared top-left back button.
2. Promote Skip to `size="medium"` (becomes ≥ 56), add 🔄 icon, rename locale key.
3. NumberPad minHeight token bump (§2.5 #4).
4. Hide the robot speech bubble after the first 2 seconds or after the first tap — it's clutter once the kid has read it.

---

### 2.8 NumberLabyrinthScreen

**Status:** ✅ pass
**File:** [src/screens/games/NumberLabyrinthScreen.js](src/screens/games/NumberLabyrinthScreen.js)

#### What works
- Options are 2×2 door cards, each with 🚪 icon + number in a distinct color (`OPTION_COLORS`). **U9, U15 pass.**
- Wrong pick flashes red only on the tapped door, not the whole screen. Less scary than a full red flash.
- Moves counter (no penalty) — satisfies "ошибки не наказываются" from MVP spec §Story 3.1.

#### Findings
- [ ] **U1:** Option cards `minHeight: 110` — passes 64 threshold. Pass.
- [ ] **U3:** `optionWrap` padding 6 → 12pt gap. Bump to 16.
- [ ] **U4:** `instruction` `body` (18) — below floor.
- [ ] **U4:** `headerLabel` ("Moves") uses `small` (16) — below floor.
- [ ] **U5:** `questionText` (the equation) uses `heading` (34) — **pass**.
- [ ] **U8:** No back during game. Needs the shared back button.
- [ ] **U10:** Wrong pick: red flash for 600ms, options re-enabled after. No hint/assist path. Spec §Story 3.1 says "robot pauses and offers a hint" — currently the robot doesn't speak at all on wrong answers. Add a speech bubble on repeated misses.
- [ ] **U11:** Doors have press states. Pass.
- [ ] **U15:** Wrong door = red color + `errorDeep` border → same color; add a ❌ or 🤔 icon overlay during the 600ms wrong-state for colorblind kids.
- [ ] **U16:** Moves counter increments but never triggers a fail. Pass.

#### Fix list
1. Shared top-left back button.
2. Hint-on-repeat: after 2 wrong picks on the same question, show a robot speech bubble with `robot.hint_1`.
3. Add a ❌ emoji overlay to the wrong door for the 600ms incorrect state.
4. Bump instruction + moves label to `body` (≥ 20).

---

### 2.9 FindPairScreen

**Status:** ✅ pass
**File:** [src/screens/games/FindPairScreen.js](src/screens/games/FindPairScreen.js)

#### What works
- Card back shows ✨ — friendly, same across all cards.
- Matched pairs turn green + stay visible; unmatched flip back. Clear rules without text.
- Moves + pairs counters are neutral (no fail state).

#### Findings
- [ ] **U1:** Cards are `width: 25%` (4 columns). On a 5" phone (~360dp) that's ~83dp per card including padding → card inner ~75dp. Below 72pt target only by gutters. **Borderline.** On `hard` (8 pairs → 16 cards) the grid is 4×4 and gets crammed. Consider capping at 3 columns on phones.
- [ ] **U2:** No back button during game.
- [ ] **U4:** `headerLabel` `small` (16) — below floor.
- [ ] **U4:** `cardContent` `subtitle` (22) for answers and `body` (18) for equations inside cards. After equation cards shrink (25% width), 18pt equation text like "7 + 3" gets tight. Verify on a real device.
- [ ] **U8:** Same — shared back button needed.
- [ ] **U10:** On mismatch, cards flip back after **1000ms**. For a 5-year-old processing two cards simultaneously, 1000ms can be too fast. Bump to 1400-1600ms, and ensure both flipped cards remain highlighted for the full duration.
- [ ] **U11:** `cardPressed` style exists. Pass.
- [ ] **U15:** Matched = green, unmatched = yellow (path), flipped = white. Each state has a color; also matched animates (scale/translateY via borderBottom). Combining green with the checkmark or a ✓ for matched pairs would make U15 bulletproof.
- [ ] **U16:** No timer. Pass.

#### Fix list
1. Shared top-left back button.
2. Cap `hard` difficulty at 3×4 grid (6 pairs, 12 cards) on phones; let tablets use 4×4.
3. Raise mismatch flip-back delay to ~1400ms.
4. Add ✓ badge to matched cards.
5. Bump header labels to `body` (20).

---

### 2.10 LostNumbersScreen

**Status:** ✅ pass
**File:** [src/screens/games/LostNumbersScreen.js](src/screens/games/LostNumbersScreen.js)

#### What works
- Current missing slot animates with `scale(1.08)` + purple border — clear "this is where I'm pointing" cue.
- Missing boxes have a yellow background distinct from filled boxes.
- Progress by "round / 5" rather than time.

#### Findings
- [ ] **U1:** Options `width: 33.33%` → 5 options wrap to row-2 with 2 items. The **layout is asymmetric** — 3 big ones + 2 big ones centered. Acceptable, but on a 5" phone each option is ~110-115dp wide, and `paddingVertical: SIZING.PADDING.medium` makes them ~60pt tall — below 64.
- [ ] **U1:** Sequence boxes are `58×58` — below 64. Boxes aren't tappable, but they're the reading target and should still meet size for visual clarity.
- [ ] **U3:** `optionsGrid` `margin: -5` + `padding: 5` → 10pt gap. Bump to 16.
- [ ] **U4:** `optionsLabel` `body` (18), `headerLabel` `small` (16). Bump.
- [ ] **U5:** Sequence number `title` (26) — pass-ish; becomes 30 post-token. Keep.
- [ ] **U8:** No back button in game.
- [ ] **U9:** All 5 options use the same `softPurpleDeep` background. Lack of per-option color (unlike Labyrinth's 4-color palette) means kids rely purely on reading the number. Works for numbers, but combined with **five** choices and same color, it looks like a wall. Consider alternating two shades or keeping one shade but adding subtle tile backgrounds.
- [ ] **U10:** Wrong pick: `feedback='incorrect'` for 800ms, no hint mechanism, no "almost!" speech. Port the hint-after-2-attempts pattern.
- [ ] **U11:** Press state via translateY. Pass.
- [ ] **U15:** Current slot cue uses border color **and** scale. Pass. Correct feedback uses green tint **and** 🎉 emoji. Pass.
- [ ] **U16:** No timer. Pass.

#### Fix list
1. Shared top-left back button.
2. Drop option count from 5 → 4; use `width: 50%` so each option is ~160dp wide × ≥72pt tall.
3. Port hint-after-2 logic from StoryProblems.
4. Sequence boxes: bump to 64×64 and `gap` to 16.
5. Optionally add per-option subtle color variants (e.g., cool blue/purple/mint/peach) to help kids distinguish choices visually before reading.

---

## 3. Shared component audit

### 3.1 Button — [src/components/common/Button.js](src/components/common/Button.js)
**Status:** ✅ pass

- `face_small` `minHeight: 40` — below any target. Currently used for Skip in StoryProblems. **Remove `small` entirely**, or redefine small to 48 min + rename as `compact` for parent-only surfaces.
- `face_medium` uses `SIZING.MIN_TOUCH_TARGET` (48) — after token bump this auto-becomes 64. Good.
- `face_large` `minHeight: 60` — bump to **72** (new `PRIMARY_TARGET`).
- Press-state via `translateY` + `borderBottomWidth` → U11 pass.
- No `hitSlop` — RN default. Consider `hitSlop: 8` for small variants still in use.
- Text sizes (`body/subtitle/title`) → post-token bump become 20/24/30. OK.

**Fix list**
1. `face_small` → remove or rename `compact` with `minHeight: SIZING.SECONDARY_TARGET` (56).
2. `face_medium` tracks `MIN_TOUCH_TARGET`; confirm after bump.
3. `face_large` → `minHeight: SIZING.PRIMARY_TARGET` (72).
4. Add `hitSlop={{ top:8, bottom:8, left:8, right:8 }}` by default.

### 3.2 Card — [src/components/common/Card.js](src/components/common/Card.js)
**Status:** ✅ pass

- Passive container; U2 not applicable when `onPress` undefined.
- When `onPress` is set, uses `TouchableOpacity` with `activeOpacity=0.85` — fine. Could migrate to `Pressable` for consistency but not a blocker.
- `bandTitle` font `subtitle` (22) → 24 post-bump. OK.
- `bandIcon` 26 — OK.

**Fix list**
1. (Optional) Migrate to `Pressable`.
2. When `onPress` is provided, enforce `minHeight: SIZING.MIN_TOUCH_TARGET` on the outer Container.

### 3.3 TileButton — [src/components/common/TileButton.js](src/components/common/TileButton.js)
**Status:** ✅ pass

- All three sizes exceed U1 (small 90 / medium 130 / large 170). Pass.
- Icon + title + optional subtitle — icon always present as affordance. U9 pass.
- Press state via translateY + lip-shrink. U11 pass.
- `title_small` uses `body` (18) → 20 post-bump. OK.
- No `hitSlop` — tile is already huge.

**Fix list**
1. Add `accessibilityRole="button"` and `accessibilityLabel={title}` for TalkBack.
2. (Nice) Clamp `numberOfLines` dynamically based on size — currently 2 for all.

### 3.4 NumberPad — [src/components/common/NumberPad.js](src/components/common/NumberPad.js)
**Status:** ✅ pass

- Key `minHeight: 60` — below 64 target. **Bump to `PRIMARY_TARGET` (72).**
- Row `gap: 10`, pad `gap: 10` — below `GAP` (16). Bump.
- Delete / submit distinguishable by color **and** icon (⌫ / ✓). U15 pass.
- Submit auto-disabled when value empty (opacity 0.4). Clear affordance. Good.
- No haptic feedback — consider `Vibration.vibrate(10)` on press when `settings.haptics` lands.

**Fix list**
1. Key `minHeight` → 72 via `PRIMARY_TARGET`.
2. Row/pad gap → `GAP` (16).
3. (Future) Wire haptics behind a setting.

### 3.5 DifficultyPicker — [src/components/common/DifficultyPicker.js](src/components/common/DifficultyPicker.js)
**Status:** ✅ pass

- 3 `TileButton`s side-by-side with `size="small"` → `minHeight: 90`. On a 5" phone the cells are ~110dp wide × 90 tall — **fine** for big fingers.
- `heroIcon` 64pt, title `heading` (34) — kid can identify the lesson type without reading. U9 pass.
- Back button is `Button` without explicit size → `medium` → `minHeight: 48` until token bump lifts it to 64. Pass after bump.
- Back uses `variant="outline"` — visibility might be low against colored bg; verify contrast.

**Fix list**
1. Replace back Button with shared top-left `BackButton` component (same as every other non-root screen).
2. Ensure outline contrast passes WCAG on each tint.

### 3.6 ScreenBackground — [src/components/common/ScreenBackground.js](src/components/common/ScreenBackground.js)
**Status:** ✅ pass

- Decorative bubbles have `pointerEvents="none"` — never steal taps. Pass.
- Soft pastel tints (`bgSky`, `bgMint`, `bgSunrise`, `bgLavender`) + `StatusBar` color-matched. Good.
- Behind dense content (Progress, game grids), bubbles sometimes sit close to text and reduce contrast. Consider dimming bubbles under the main content card (e.g., lowering opacity when a child is in a lesson/game).

**Fix list**
1. (Nice) Expose a `bubbleIntensity` prop so game/lesson screens can render simpler backgrounds (fewer/lower-opacity bubbles).

---

## 4. Cross-screen findings

Patterns that show up on ≥3 screens, best fixed once.

### 4.1 Missing top-left back button — **P0**
Only `DifficultyPicker`, `ProgressScreen`, and `SettingsScreen` have a back button, and in all three it's at the **bottom**. Every lesson/game screen (5 total) has **no visible back during play** because `AppNavigator` sets `headerShown: false` and the screens never add their own. Android hardware back works, but kids don't know that.

**Fix:** create [src/components/common/BackButton.js](src/components/common/BackButton.js) — absolute-positioned pill, top-left, 56pt, `←` icon, consistent across every non-root screen. Drops into each screen's `SafeAreaView`. For lesson/game screens, tapping it during active play opens a tiny `LeaveConfirmModal` ("Leave and keep your progress?") — satisfies U13 and prevents accidental loss.

### 4.2 Hint-after-2-attempts only in StoryProblems — **P0**
`GAME_CONFIG.HINT_AFTER_ATTEMPTS` is respected by one screen out of five gameplay screens. Kids who get stuck in `AdditionVisual`, `SubtractionVisual`, `NumberLabyrinth`, or `LostNumbers` have no assist. **U10 is the most-failed checklist rule.**

**Fix:** extract a small `useAttemptCounter({ onHint })` hook or a `<HintBubble />` component; wire into all gameplay screens. Hint content comes from locale `robot.hint_*` keys.

### 4.3 `small` (16pt) + `body` (18pt) below floor — **P0**
Every screen uses these sizes for kid-facing labels. The token bump (§1) fixes most of this automatically; per-screen sweeps to remove `small` from kid-facing usage remain.

### 4.4 Touch targets under 64pt — **P0**
`MIN_TOUCH_TARGET: 48` is threaded into `Button`, `PillAction`, `SettingRow`, `languageOption`, `NumberPad` keys (via a separate constant `60`). All need to land on **64 primary / 56 secondary**.

### 4.5 Press state coverage — **pass across the app**
Every pressable audited uses `Pressable` with `translateY` or `TouchableOpacity` with `activeOpacity`. No orphan `onPress`-without-feedback found. **U11 passes globally.**

### 4.6 Color-only state signals — **P2**
Two specific cases: wrong-door flash in `NumberLabyrinth`, and on/off switches in `SettingsScreen`. Everywhere else, color is paired with icon or shape.

---

## 5. Prioritized fix list

Ordered by blast radius and dependency order.

### P0 — Foundation (must land first)
1. **Design tokens** — update [src/utils/constants.js](src/utils/constants.js):
   - `SIZING.MIN_TOUCH_TARGET`: 48 → **64**
   - add `SIZING.PRIMARY_TARGET: 72`
   - add `SIZING.SECONDARY_TARGET: 56`
   - add `SIZING.GAP: 16`
   - `TYPOGRAPHY.SIZES.body`: 18 → **20**
   - `TYPOGRAPHY.SIZES.subtitle`: 22 → **24**
   - `TYPOGRAPHY.SIZES.title`: 26 → **30**
   - Document the `tiny` = 14pt rule ("parent/meta only").

2. **Shared components**:
   - `Button` small/medium/large track the new tokens; add `hitSlop`.
   - `NumberPad` key height → `PRIMARY_TARGET`, gaps → `GAP`.
   - New `BackButton` component (see §4.1).
   - New `LeaveConfirmModal` for in-lesson back presses.

### P1 — Root + learning screens
3. **Hint system extraction** — `useAttemptCounter` / `<HintBubble/>`; wire into `AdditionVisual`, `SubtractionVisual`, `NumberLabyrinth`, `LostNumbers`.
4. **Learning screens sweep**: Addition, Subtraction, Story Problems.
   - Mount `<BackButton/>`.
   - Bump object emoji size (Addition/Subtraction) to 48-56pt.
   - Promote `instruction` / `robotSpeech` typography.
5. **Root screens**: Welcome (start-button size), MainMenu (pill size + label typography).

### P2 — Game screens
6. `NumberLabyrinth`: wrong-door icon, hint on repeat.
7. `FindPair`: cap hard-mode grid at 3×4 on phones; longer mismatch delay; ✓ badge on match.
8. `LostNumbers`: drop 5 → 4 options; bump sequence boxes to 64; per-option color variants.

### P2 — Meta screens
9. `ProgressScreen`, `SettingsScreen`: mount shared `<BackButton/>`; bump labels; `SettingRow` Pressable wrap.

### P3 — Documentation guardrails
10. Add a "Kid-UX rules" section to [AGENTS.md](AGENTS.md) under Conventions — one table, the U1-U16 rules from §0 — so future PRs get caught in review.

---

## 6. Exit criteria (copied from README)

- Every screen in §2 has **Status: ✅ pass**.
- Zero primary-action targets below 64pt; zero body text below 20pt; zero back buttons moved from top-left.
- [AGENTS.md](AGENTS.md) documents the kid-UX rules under "Conventions".
- A 6-year-old can reach a lesson, complete it, and see their tree grow **without adult help** — verified on a 5" Android device.

---

## 7. Audit summary

**10 screens + 6 shared components reviewed. Status at audit end: all ✅ pass (pending device QA).**

### What landed in the fix pass

**P0 — Foundation**
- Design tokens bumped in [src/utils/constants.js](src/utils/constants.js): `MIN_TOUCH_TARGET` 48→64, added `PRIMARY_TARGET` (72), `SECONDARY_TARGET` (56), `GAP` (16); typography `body` 18→20, `subtitle` 22→24, `title` 26→30, `heading` 34→36.
- [src/components/common/Button.js](src/components/common/Button.js): size floors re-pinned to tokens, `hitSlop` default added.
- [src/components/common/NumberPad.js](src/components/common/NumberPad.js): keys now `PRIMARY_TARGET`, gaps `GAP`.
- New [src/components/common/BackButton.js](src/components/common/BackButton.js) + [src/components/common/LeaveConfirmModal.js](src/components/common/LeaveConfirmModal.js) — top-left pill with confirm flow for in-lesson exits.
- New [src/hooks/useAttemptCounter.js](src/hooks/useAttemptCounter.js) + [src/components/common/HintBubble.js](src/components/common/HintBubble.js).
- Locales: `leave.*` modal keys + `common.new_problem` (EN/RU/ES).

**P1 — Learning & root screens**
- Addition/Subtraction/Story all mount `<BackButton confirm>`, wire `useAttemptCounter` + `<HintBubble/>`, bump object emoji 30→48pt (Subtraction 30→48 with larger group width), raise instruction typography.
- Story Problems: skip button renamed to "New Problem" with 🔄 icon and sized `medium` (≥ 64pt).
- Welcome: button already `size="large"` → auto-lifted to 72 via tokens; added `TODO(M2.3)` for mascot swap.
- Main Menu: pill minHeight → `SECONDARY_TARGET`, icon 22→28, `helloSub` `small` → `body`, grid gap → `GAP`.

**P2 — Game & meta screens**
- Number Labyrinth: `<BackButton confirm>`, `useAttemptCounter` + `<HintBubble/>`, 🤔 on wrong door, option minHeight 110→120, wrong-pick delay 600ms→900ms.
- Find Pair: `<BackButton confirm>`, grid cap 4-col → 3-col, hard difficulty capped at 6 pairs (12 cards = 3×4), mismatch delay 1000ms→1500ms, ✓ badge on matched cards, card content typography bumped.
- Lost Numbers: `<BackButton confirm>`, options reduced 5→4 with per-option color palette, option grid 3-col → 2-col (≥ `PRIMARY_TARGET` tall), sequence boxes 58→64, `useAttemptCounter` + `<HintBubble/>`.
- Progress: shared `<BackButton/>` top-left, bottom back button removed; `small` labels → `body`.
- Settings: shared `<BackButton/>`, bottom back button removed; `TouchableOpacity` → `Pressable`; `SettingRow` now wraps entire row in `Pressable` so whole row toggles; `languageFlag` 30→36pt.
- `DifficultyPicker`: shared `<BackButton/>` replaces inline back, grid gap aligned to `GAP`.

**P3 — Guardrails**
- [AGENTS.md](AGENTS.md) now carries a "Kid-UX rules (ages 5-9)" table under Conventions.

### Pending verification
- Manual pass on 5" and 6" Android (emulator or device). The token bump is non-destructive but font/layout reflow should still be eyeballed on each screen.
- Locale review — Russian and Spanish strings for `leave.*` were translated mechanically; a native speaker should sanity-check tone.

### Known deferrals
- Mascot swap (Robot Logik) stays in M2.3 per product spec; `TODO(M2.3)` left inline.
- Haptics on NumberPad left as a future tie-in once a haptics setting lands.
- Switch on/off icon pairing (U15) deferred — settings is parent-facing, acceptable for now.
