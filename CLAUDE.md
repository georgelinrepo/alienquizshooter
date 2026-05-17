# Alien Quiz Shooter

A browser-based space shooter with an educational quiz phase. Built as a parent+child project — George Lin and his 10-year-old son.

## What we're building

Kids pick a topic pack (math, animals, capitals, etc.), answer 10 quiz questions to earn ship upgrades (lives, shield, weapon tier, smart bombs, score multiplier), then fly their upgraded ship through alien waves and compete for the high score.

## Current status

Design spec is **complete and approved**. The next step is to invoke the `superpowers:writing-plans` skill to produce a detailed implementation plan.

Spec: `docs/superpowers/specs/2026-05-17-alien-quiz-shooter-design.md`

## Key design decisions

- **Stack:** Vanilla JavaScript + [KAPLAY](https://kaplayjs.com/) game library loaded via CDN. No build step, no TypeScript, no backend.
- **Hosting:** GitHub Pages. Zero cost, shareable URL for friends.
- **Auto-upgrade system:** each correct quiz answer grants a fixed, deterministic upgrade by question number — no token shop, no drafting.
- **Controls (shooter):** mouse tracks ship position; spacebar fires; Shift/X for smart bomb; arrow/WASD as keyboard-only fallback.
- **Topic packs:** JSON files in `assets/packs/`. New packs are dropped in and committed. AI-generated packs via Claude in ~30 sec.
- **High scores:** `localStorage` only — no backend, no accounts.

## Auto-upgrade table

| Q# | Reward |
|----|--------|
| 1–3 | +1 Life each (base 1, max 4) |
| 4 | Shield — 2 hits |
| 5 | Shield +1 hit (3 total) |
| 6 | Weapon: Spread Shot |
| 7 | Weapon: Laser |
| 8 | Smart Bomb (1 use) |
| 9 | +1 Smart Bomb (2 total) |
| 10 | Score multiplier 1.5× |

## Alien types

| Type | HP | Points | Behaviour |
|------|----|--------|-----------|
| Grunt | 1 | 10 | Slow straight descent |
| Buzzer | 1 | 25 | Fast zigzag |
| Tank | 3 | 50 | Slow, large, fires back |

## Assets plan

- Sprites: [Kenney space pack](https://kenney.nl/assets) (CC0) + son's custom hero in [Piskel](https://www.piskelapp.com/)
- SFX: [jsfxr.me](https://sfxr.me/) (CC0)
- Music: [Pixabay Music](https://pixabay.com/music/) (royalty-free)

## Open questions (resolve with son)

- Final game name (working title: *Alien Quiz Shooter*)
- Default topic packs to ship (suggested: multiplication, animals, world capitals)
- GitHub handle for deployment URL

## Out of scope for v1

Cosmetic unlocks, boss aliens, online leaderboards, URL-encoded pack sharing, multiplayer.
