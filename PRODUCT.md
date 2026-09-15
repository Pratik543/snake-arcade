# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Bun + Vite + React 19 + TypeScript (existing codebase answers this).

## Users

The player: someone taking a short break, wanting a fast, satisfying arcade run with keyboard controls. Session length is one run (30s–3min).

## Product Purpose

Snake Arcade is a browser snake game with two modes — Classic (endless, wrap-around, speed ramp) and Arcade (leveled runs with walls, portals, combo scoring, bonus food, speed-boost and shield power-ups). Success = a run that feels juicy and replayable, with a high score worth chasing.

## Positioning

A lovingly crafted pixel-art take on snake: retro Gameboy/CGA aesthetic executed with modern motion craft, rather than a generic neon-gradient canvas game.

## Operating Context

Played in the browser, keyboard-first (arrows/WASD, space/enter to act, P/Esc to pause). High score persisted in localStorage.

## Capabilities and Constraints

- Classic mode: wrap-around edges, combo scoring, progressive speed ramp.
- Arcade mode: multiple levels with walls and a portal, per-level target scores, level-complete flow, power-ups (bonus food, speed boost, shield).
- WebAudio sound engine (no external audio assets).
- Existing game engine (useGame, useKeyboard hooks) is confirmed working and is preserved; this round redesigns presentation only.

## Brand Commitments

- Pixel-art retro world (user-selected 2026-09-15): Gameboy/CGA palette, chunky sprites, dithering. Binding for this and future visual work.

## Product Principles

1. The game is the hero — chrome recedes, the board leads.
2. Juice everywhere: every eat, death, and level change is felt, not just seen.
3. Responsive feel over visual flourish — input latency and animation speed come first.
4. One committed visual world, no mixed metaphors.

## Accessibility & Inclusion

prefers-reduced-motion must tone down (not eliminate) motion; keyboard-only play is fully supported; text rendered as real DOM text where possible, not baked into sprites.
