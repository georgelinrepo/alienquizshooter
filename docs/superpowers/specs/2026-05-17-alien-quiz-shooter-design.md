---
title: Alien Quiz Shooter — Design Spec
date: 2026-05-17
status: draft
---

# Alien Quiz Shooter

## Summary

A browser-based space-shooter that opens with an educational quiz. Each correct answer grants the player's ship an upgrade — extra lives, shield, better weapon, smart bombs, score multiplier — which they carry into the shooter phase. The better the quiz performance, the longer the player survives and the higher the score. The finished game is hosted at a public URL so kids can share it with their friends.

## Motivation

- Introduce a 10-year-old to web programming and AI-assisted coding by building something he and his friends actually want to play.
- Reward knowledge with in-game power so learning is something to brag about, not something to be told to do.
- Produce a finished, shareable artifact (a URL) — not a tutorial-shaped sketch.

## Audience

- **Players:** kids roughly 8–12.
- **Builders:** one adult + one 10-year-old (background: Scratch from school, a little Python; no JavaScript yet).

## Game Loop

A complete round runs ~3–4 minutes:

1. **Title screen.** Player picks a topic pack (e.g., Multiplication, Animals, Capitals, Space).
2. **Quiz phase (~80 sec).** 10 multiple-choice questions, 8 seconds each.
3. **Loadout reveal.** Animated screen showing the upgrades earned. No spending decisions — upgrades are deterministic by question number.
4. **Shooter phase.** Scrolling space background, alien waves of increasing difficulty, until lives are exhausted.
5. **Game Over.** Final score, name entry, local high-score table, "share" button.

## Quiz Phase

### Question format

Each question has 4 multiple-choice options with exactly one correct answer.

### Auto-upgrade table (deterministic by question number)

Each correct answer grants a fixed upgrade. A wrong, skipped, or timed-out answer simply forfeits that upgrade.

| Question | Reward |
|----------|--------|
| 1 | +1 Life (base = 1) |
| 2 | +1 Life |
| 3 | +1 Life (max lives = 4) |
| 4 | Shield (absorbs 2 hits) |
| 5 | Shield +1 hit (3 hits total) |
| 6 | Weapon upgrade: Spread Shot (replaces Single Blaster) |
| 7 | Weapon upgrade: Laser (replaces Spread Shot) |
| 8 | Smart Bomb (clears screen, 1 use) |
| 9 | +1 Smart Bomb (2 total) |
| 10 | Score multiplier: 1.5× |

A perfect quiz score yields: 4 lives, 3-hit shield, Laser weapon, 2 smart bombs, 1.5× score. A 5/10 result might yield: 3 lives, 2-hit shield, base blaster, no specials. The difference is dramatic and *visible* — that's the point.

### Timer

8 seconds per question, with an on-screen countdown. A time-out counts as wrong.

### Streak combo (nice-to-have, can be cut)

Three correct answers in a row triggers a "COMBO!" effect on the next question. If that one is also correct, the player earns a small bonus (e.g., one extra bullet pierce or +50 starting score).

## Shooter Phase

### View & controls

- Top-down view: ship at the bottom, space scrolls downward.
- **Mouse (primary desktop):** ship tracks the mouse cursor's X/Y position directly; left-click to fire; right-click (or a on-screen button) to use a smart bomb.
- **Keyboard:** ←/→ or A/D to move horizontally; ↑/↓ or W/S for slow vertical movement; Space to fire; Shift or X to use a smart bomb. Both input methods work simultaneously so the player can mix freely.
- **Mobile/touch:** drag anywhere on screen to move the ship; tap a "FIRE" button to shoot; tap a "BOMB" button for smart bomb.

### Player ship

- Starts at the bottom-center of the play area.
- Starts with the lives, shield, weapon, and bombs determined by quiz performance.
- Fires automatically while Space is held (or FIRE button is pressed).

### Aliens

Three enemy types; mix and density grow over time:

| Type | HP | Behavior | Points |
|------|----|---------|--------|
| Grunt | 1 | Slow straight descent | 10 |
| Buzzer | 1 | Fast zigzag descent | 25 |
| Tank | 3 | Slow, large, fires back at player | 50 |

Waves spawn on a timer; difficulty (spawn rate and Tank ratio) increases every 30 seconds.

### Scoring

- `(aliens destroyed × point value) × score_multiplier`
- Survival bonus: +100 every 10 seconds alive
- Accuracy bonus at game over: `floor(hits / shots_fired × 1000)`

### End condition

Lives reach 0 → Game Over screen.

## High Scores

- Stored in `localStorage` only — no backend, no accounts.
- Top 10 scores with a player name (3-letter arcade-style entry, or a short text field).
- **Share button:** copies the game's URL with a message ("Beat my 47,000 in Alien Quiz Shooter!"). On mobile, uses the native share sheet if available.

## Topic Pack Format

A topic pack is a JSON file in `assets/packs/`. Schema:

```json
{
  "name": "Multiplication Tables",
  "description": "Multiply numbers from 1 to 12",
  "questions": [
    {
      "q": "What is 7 × 8?",
      "choices": ["54", "56", "58", "64"],
      "answer": 1
    }
  ]
}
```

- `answer` is the 0-based index of the correct entry in `choices`.
- The game discovers available packs from a manifest at `assets/packs/index.json` (a list of pack filenames).

### Adding a new pack

1. Drop a new `.json` file in `assets/packs/`.
2. Add its filename to `assets/packs/index.json`.
3. Commit + push → it's live on the game's URL.

### Friend-sharing custom packs (optional, Phase 2)

A pack can also be encoded into a URL query string (`?pack=<base64-json>`), so kids can share a one-off pack as a link without touching git.

### AI-generated packs

The intended AI workflow: the parent asks Claude something like *"Generate 10 medium-difficulty multiple-choice questions about volcanoes in this JSON format: …"*. Claude returns a valid pack in under a minute; drop it in, play it.

## Tech Stack

- **Language:** JavaScript (no TypeScript, no build step).
- **Game library:** [KAPLAY](https://kaplayjs.com/) (loaded via `<script>` tag from CDN).
- **Hosting:** GitHub Pages (URL: `<username>.github.io/alienquizshooter`).
- **Optional secondary distribution:** itch.io (upload a zip of the game folder).
- **No backend, no database, no authentication.**

## Project Structure

```
alienquizshooter/
├── index.html             # Entry point — loads KAPLAY + game.js
├── game.js                # Game code (start as one file)
├── style.css              # Page styling (minimal)
├── assets/
│   ├── sprites/           # Hero ship, aliens, projectiles, UI
│   ├── audio/             # SFX (.wav), music (.mp3)
│   └── packs/             # Topic-pack JSON files + index.json
├── docs/superpowers/specs/  # This spec, plus future specs
└── README.md
```

Code starts as a single `game.js`. KAPLAY's scene system (`scene("title", …)`, `scene("quiz", …)`, etc.) makes it natural to split into per-scene files (`scenes/quiz.js`, `scenes/shooter.js`, …) once the single file grows past ~300 lines.

## Assets

| Asset type | Source | License |
|------------|--------|---------|
| Ship + alien sprites | [Kenney space pack](https://kenney.nl/assets) | CC0 |
| UI elements | [Kenney UI pack](https://kenney.nl/assets) | CC0 |
| Custom hero ship variant | Son draws in [Piskel](https://www.piskelapp.com/) | original |
| Lore card / cinematic art (Phase 2) | Claude-generated | n/a |
| SFX (shoot, hit, bomb, correct, wrong, combo, game over) | [jsfxr.me](https://sfxr.me/) | CC0 |
| Music (menu, shooter) | [Pixabay Music](https://pixabay.com/music/) | royalty-free |

## Out of Scope (Phase 2+)

These are deliberately deferred to keep the first build shippable in a weekend:

- Cosmetic ship/weapon skins as long-term unlocks
- Cumulative XP / pilot rank across sessions
- Boss aliens, multiple worlds/themes
- Online leaderboards (would require a backend)
- Mobile-first layout polish
- Multiplayer / co-op
- Lore cards / cinematic cutscenes
- URL-encoded pack sharing

## Open Questions

- **Final game name.** Son's call. Working title: *Alien Quiz Shooter*.
- **Default topic packs.** Suggest three to ship: multiplication, animals, world capitals. Substitute based on son's interests.
- **GitHub account.** Affects deployment URL — pick the handle thoughtfully (hard to change later).
- **Streak combo.** Keep for MVP or defer to Phase 2?

## Next Step

A detailed implementation plan will be written separately (via the `superpowers:writing-plans` skill) once this design is approved.
