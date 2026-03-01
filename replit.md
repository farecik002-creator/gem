# Mystic Match — Fantasy Match-3 RPG

## Overview

A premium AAA-quality fantasy Match-3 combat RPG wrapped in an Expo React Native app with a dark fantasy aesthetic.

## Architecture

- **Frontend**: Expo React Native (Expo Router, file-based routing)
- **Backend**: Express.js (port 5000) — serves game HTML + assets
- **Game**: Self-contained HTML/CSS/JS loaded in a WebView

## Game Files

Extracted from the original ZIP game and served as static files:
- `server/public/game.html` — Complete standalone game (all logic in vanilla JS)
- `server/public/gems/` — Gem images (blue, red, green, purple, yellow, cyan)
- `server/public/bg-mystic.png` — Battle background
- `server/public/bg-mystic-forest.png` — Map background

## Expo App Structure

```
app/
  _layout.tsx          — Root layout (StatusBar hidden, no header)
  (tabs)/
    _layout.tsx        — Single-screen Stack layout (no tab bar)
    index.tsx          — Main game screen with WebView + premium wrapper
```

## Premium Wrapper Features (Phase 3)

- Dark fantasy animated gradient background (`#03000f` → `#0a0025`)
- 22 animated soft particles (purple/gold/cyan floating lights)
- Glow edge container around game (purple neon border with pulse)
- Smooth fade-in WebView transition
- Premium splash screen with animated progress bar
- Subtle board floating animation (sine wave)
- Native character container (right 35% — empty, z-index ready)

## Layout Structure (Phase 4)

**LEFT SIDE (65%)** — via `game.html`:
- 8×8 Match-3 board
- Enemy HP bar
- Player HP/Shield/EXP bars
- HEAL and SKILL buttons
- Combat UI (combo display, floating texts, particles)

**RIGHT SIDE (35%)** — Native React Native:
- Empty `CharacterContainer` component
- Transparent background
- Animated float (ready for sprite overlay)
- `pointerEvents="none"` — non-blocking
- `zIndex: 50` — above WebView

## Game Mechanics (preserved exactly)

- 8×8 board, 6 gem types: red, blue, green, yellow, purple, cyan
- Match 3+ horizontally or vertically
- Cascade combos with damage multiplier: `1 + (combo-1) * 0.5`
- Gem effects:
  - Red → Crit damage flag
  - Blue → Skill charge (+10/gem)
  - Green → Heal player (+3 HP/gem)
  - Purple → Shield (+5/gem)
  - Yellow → Heal charge (+10/gem)
  - Cyan → Burst effect
- Damage: `Math.floor(count * (baseDamage/2) * comboMultiplier)`
- Enemy attacks after each player turn
- Shield absorbs damage first
- Level up system with HP or ATK choice
- 50-level map with star ratings
- Progress saved to localStorage

## Configuration

- Orientation: Portrait (locked)
- Status bar: Hidden
- Hardware acceleration: Enabled (`renderToHardwareTextureAndroid`, `androidLayerType="hardware"`)
- WebView: `cacheEnabled`, `javaScriptEnabled`, `domStorageEnabled`

## Running

- **Backend**: `npm run server:dev` (port 5000)
- **Frontend**: `npm run expo:dev` (port 8081)
- **Game URL**: `https://${EXPO_PUBLIC_DOMAIN}/game.html`
