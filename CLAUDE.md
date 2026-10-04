# Water — working rules

A from-scratch Three.js r180 island + water scene, built to run well on a phone (WebGL2). One
`index.html`, native ES modules, `vendor/` three. **No build step.** The Tidewater (WebGPU) import is
preserved on the `tidewater` branch and is not on `main`.

**Always merge to `main` and push.** The owner hosts it on GitHub Pages and previews on a phone, so a change
on a branch cannot be tested. No pull requests unless asked. `.github/workflows/deploy.yml` uploads the repo
root as-is (Settings > Pages > Source = GitHub Actions).

**Run `npm run bump` before every push** (the cyan `wN` badge top-left; a running copy polls
`version.json` and shows a "build ready · tap" pill). **`npm run check`** is the parse gate. Report
"shipped unverified" with the build number.

`npm run shot [out.png]` renders the page headless (swiftshader) and prints console and shader-compile
errors -- worth running after any GLSL change, because a shader that fails to compile is a black screen on
the phone with nothing to say why. `EVAL="water.setTime('sunset')"` runs code before the shot.

## Design rules that keep it fast

- The seabed shader carries the water column's colour; the surface is one transparent draw call. Do not add
  a refraction/reflection render pass without measuring it on a phone first.
- No float textures (iOS). All baked textures are RGBA8.
- Anything opaque that can be underwater must go through `waterPatch()` or it will look dry under water.
- Sky, fog and water all read the same uniforms (`U`), so the horizon cannot seam.
- `waveAt()` in JS must stay the same sum as `waveAt()` in GLSL.

## The character (`models/glorp_character.glb`, from the Peggy repo)

Measured offline before use, posing the real rig through the vendored loader -- not assumed:
- Faces **+Z** (toes read 0.999 along +Z), so `root.rotation.y = face` with forward `(sin h, cos h)`.
- **Measure the POSED skin, never the raw geometry.** Bind space does not match the posed body on this
  export (Peggy shipped him 2.8 m tall and floating that way). `SkinnedMesh.computeBoundingBox()` after
  `mixer.update(0)` is the honest measure. He is drawn at `MOVE.height` 1.5 m, centred on his Hips.
- Ships with **no material**. The texture is `images/glorp_texture.webp`, which stores **LINEAR** pixel
  values (set `LinearSRGBColorSpace`). Peggy's posterised cel version reads blotchy under real light.
- Clips used: `idle`, `walk`, `run`, `running_jump`, `in_air`, `landing`. Every clip also has a `.001`
  duplicate and there is `CINEMA_4D_Main` / `tpose` residue -- ignored. Also present, unused:
  `run_backward`, `left_strafe`, `right_strafe`.
- Reference speeds (planted toe, in heights/second): walk 0.779, run 1.534 -> 1.17 / 2.30 m/s at 1.5 m.
- His material goes through `waterPatch()`, which is why his legs read as underwater when he wades.

## Controls

Left half: floating stick (walk, or steer the boat camera-relative). Right half: drag to orbit, pinch to
zoom, tap water for ripples. Jump button; a contextual Board / Go ashore button. Laptop: WASD, Space, E.
