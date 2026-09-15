# 🐍 SNAKE ARCADE

A browser snake game built as a lovingly crafted pixel-art homage to the original Game Boy — a strict 4-shade green LCD world, chunky sprites, and stepped `steps()` motion, played inside a physical DMG-style handheld shell.

## 📖 Description

Snake Arcade is a fast, satisfying arcade run you can play in a coffee break (one run ≈ 30s–3min). It ships two modes:

- **Classic** — endless play with wrap-around edges, combo scoring, and a progressive speed ramp.
- **Arcade** — 7 handcrafted levels with walls, portals, per-level target scores, a level-complete flow, and power-ups (bonus food, speed boost, shield).

Every eat, death, and level change is *felt*, not just seen: particle bursts, screen shake, combos, and a WebAudio sound engine — no external audio assets, every blip is synthesized in the browser.

## ✨ Key Features

- **Two game modes** — Classic (endless) and Arcade (leveled runs)
- **7 arcade levels** — from OPEN FIELD to the portal-warping LABYRINTH, each with its own wall layouts, speed, and target score
- **Portals** — teleport across the board in later arcade levels
- **Power-ups** — bonus food (timed), speed boost, and shield
- **Combo scoring** — chain eats quickly for higher scores
- **Procedural chiptune audio** — square-wave tones and filtered noise via WebAudio, zero audio files
- **Game juice** — particle effects, screen shake, stepped retro motion
- **Persistent high score** — saved to `localStorage`
- **Accessibility** — keyboard-only play fully supported; `prefers-reduced-motion` tones down (not eliminates) motion

## 🎮 Controls

| Key | Action |
| --- | --- |
| Arrow keys / WASD | Steer the snake |
| Space / Enter | Confirm · restart |
| P / Esc | Pause |

## 🕹️ Tech Stack

- **Bun** — package manager & script runner
- **Vite 8** — dev server & bundler
- **React 19** + **TypeScript 6** — UI & game state
- **Oxlint** — linting
- **WebAudio API** — synthesized sound engine
- **Press Start 2P** — retro pixel lettering

## 🏗️ Architecture

The game is a pure client-side React app; there is no backend.

```
index.html            DMG shell + LCD screen container
src/
├── main.tsx          React entry
├── App.tsx           App shell & wiring
├── App.css           Console/shell styling
├── constants.ts      The 7 arcade level definitions
├── types.ts          GameState, ArcadeLevel, Particle, …
├── audio.ts          WebAudio sound engine (synthesized, no assets)
├── hooks/
│   ├── useGame.ts    Game loop: movement, collisions, food, power-ups, scoring
│   └── useKeyboard.ts Keyboard input mapping
└── components/
    ├── SnakeBoard.tsx  The LCD game board & sprites
    ├── HUD.tsx         Score / level / combo display
    ├── Overlays.tsx    Menu, pause, game-over, level-complete screens
    └── PixelIcons.tsx  SVG pixel-art icons
```

Game state lives in a single `GameState` object driven by `useGame` on a fixed tick; rendering is pure React/SVG with `crispEdges` pixel sprites.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) — or Node.js 20+ with npm

### Install & Run

```bash
# install dependencies
bun install

# start the dev server (HMR)
bun run dev

# production build
bun run build

# preview the production build
bun run preview
```

### Run with Docker

```bash
# build the image
docker build -t snake-arcade .

# run on http://localhost:8080
docker run -p 8080:80 snake-arcade
```

## 🛠️ Development Workflow

```bash
bun run lint    # oxlint
bun run build   # tsc -b && vite build (type-checks, then bundles)
bun run dev     # vite dev server
```

Branch from `main` for features; keep the build (`tsc -b`) and lint (`oxlint`) clean before committing.

## 📐 Coding Standards

- Linting via **Oxlint** (`.oxlintrc.json`); React rules-of-hooks enforced
- Strict TypeScript — `tsc -b` runs as part of `build`
- Product principles worth honoring in any change:
  1. The game is the hero — chrome recedes, the board leads.
  2. Juice everywhere — every eat, death, and level change is felt.
  3. Responsive feel over visual flourish — input latency comes first.
  4. One committed visual world — DMG Game Boy palette (`#0f380f` / `#306230` / `#8bac0f` / `#9bbc0f`), no mixed metaphors.

## 🧪 Testing

No automated test suite yet. Manual smoke checklist: both modes playable end-to-end, pause/resume, high-score persistence across reloads, sound after first keypress (browser autoplay policy), and reduced-motion behavior.

## 🤝 Contributing

Contributions welcome. Open an issue or PR, keep lint and type-check clean, and preserve the product principles above — see `PRODUCT.md` for the full product spec and brand commitments.

## 📄 License

All rights reserved (no license file yet).
