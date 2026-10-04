# Water

A mobile-first island-and-ocean scene in Three.js r180 (WebGL2). Native ES modules, vendored three,
**no build step**: `index.html` opens and runs, and Pages serves the repo root.

Live: https://colinwillow.github.io/water/

The earlier import of [dgreenheck/tidewater](https://github.com/dgreenheck/tidewater) (WebGPU, MIT) is kept
whole on the `tidewater` branch.

## How the water works (and why it is cheap)

- **The seabed carries the water colour.** Every opaque material is patched (`waterPatch`) so that below
  y = 0 it gets caustics, the light path down through the water and the view path back up, with per-channel
  absorption (red dies first). Shallow water is turquoise because it is the sand seen through it.
- **The surface is one alpha-blended draw call** on top: Fresnel sky reflection, the sun's glint and foam.
  No render targets, no refraction or reflection pass, no float textures.
- **Waves** are four summed sines in the vertex shader, plus three samples of a baked tileable slope map.
  `waveAt()` in JS is the same sum, so floating things sit on the surface the GPU draws.
- **Interaction** is a ring buffer of 32 ripple sources (`addRipple(x, z, strength)`): expanding rings that
  bend the normals and carry a foam crest. The boat drops one at its stern every 0.22 s, which adds up to a
  wake. Tapping the water drops one.
- **Shore foam** reads a baked height texture of the island.
- Every texture is generated at load (caustic cells, cloud/foam noise, slopes, height): zero image files.
- Dynamic resolution: below ~48 fps it gives up pixels, not frames.

## Scripts

    npm run bump    # before every push: raises the build number and version.json
    npm run check   # the module script must parse (a parse error is a blank page)
    npm run shot    # dev only: headless Chromium render + console/shader errors
