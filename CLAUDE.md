# Water — working rules

A copy of [dgreenheck/tidewater](https://github.com/dgreenheck/tidewater) (MIT) used as the base for our
own scenes, characters and game logic. Keep its `LICENSE` and `CREDITS.md`.

**Always merge to `main` and push.** The owner hosts it on GitHub Pages and previews on a phone, so a
change sitting on a branch cannot be tested. Branch while working if you like; end on `main`. No pull
requests unless asked.

Pages deploys via `.github/workflows/deploy.yml` on every push to `main` (Vite build of `dist/`).
Settings > Pages > Source must be "GitHub Actions".

**It is NOT Three.js.** It is his own engine written directly on WebGPU + WGSL (~80k lines in `src/`).
Nothing from the Three.js games in this account (Shredworld, Plutopia, Melee) drops in unchanged.

`npm run build` must pass before a push. `node test/game-logic.mjs` runs headless; `test/engine-smoke.mjs`
needs a real GPU adapter and cannot run in a headless container.

Heavy features can be switched off by URL for phone testing: `?noClouds&noVeg&noHaze&noCaustics&noSim`.
