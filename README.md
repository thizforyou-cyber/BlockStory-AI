# BlockStory AI

A simple, website-only studio for making block-world 3D story videos. The current version runs as a static GitHub Pages website and uses Three.js for interactive 3D scenes.

## Publish the website

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**, then save.
4. Open the Pages URL GitHub displays.

## What works in the current browser version

- Enter a story prompt and generate a connected scene outline.
- Create a block-style 3D city or forest with a hero, enemy and glowing object.
- Preview 3D characters and basic actions: idle, run, jump, power-up, attack and celebrate.
- Drag the preview to rotate the camera; choose wide, close or cinematic camera framing.
- Edit scene title, action, dialogue, duration and character action.
- Add and delete scenes, play the sequence, and record a WebM video in supported browsers.
- Save and reopen a project as JSON.
- No desktop application or mandatory API key is needed for this prototype.

## Important: what is not AI yet

The prompt-to-story planner is currently rule-based, and the 3D characters/world are built from procedural geometry. This is a working 3D browser editor foundation, **not yet a true generative text-to-video model**. The exported WebM captures the 3D preview; browser speech is not mixed into the exported video as an audio track.

To generate original AI video clips from text, the site needs a server-side GPU inference service. A static GitHub Pages site cannot host a large video model or provide unlimited free GPU rendering. We should add that as a separate connected backend only when a suitable hosting budget/compute option is chosen.

## Open-source projects used / evaluated

- **Three.js** — used in the website for WebGL 3D rendering and camera controls. MIT license. https://github.com/mrdoob/three.js
- **Wan2.1** — evaluated as a possible future text-to-video model. Apache-2.0 repository and supports text-to-video, but inference requires a GPU-backed service. Its published T2V-1.3B setup lists 8.19 GB VRAM and reports about four minutes for a five-second 480p video on an RTX 4090, so it is not a free static-browser feature. https://github.com/Wan-Video/Wan2.1
- **Theatre.js** — possible future timeline/keyframe tool for more detailed 3D animation. Review its package-specific licenses before integrating the editor package. https://github.com/theatre-js/theatre
- **Braincut** — evaluated as a possible browser video-editor reference (MIT). It is a separate application, not copied into this repository. https://github.com/swimmingbrain/braincut

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for dependency notices.

## Files

- `index.html` — complete website, 3D scene builder, storyboard editor, preview and WebM recording.
- `README.md` — setup and feature notes.
- `THIRD_PARTY_NOTICES.md` — open-source attributions and license notes.
