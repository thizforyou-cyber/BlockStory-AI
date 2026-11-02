# BlockStory AI

A free-first, browser-based foundation for the user's goal: enter a short story idea and turn it into a connected block-world movie, with as little manual editing as possible.

## Publish as a website

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Open the published Pages URL shown in that section.

## Features in this browser prototype

- Story idea input, video duration and visual mood.
- Automatic story beat / storyboard generation.
- A recurring hero and villain identity across the generated scenes.
- Animated block-style canvas preview with scene titles and dialogue captions.
- Browser speech narration (when supported by the browser).
- Scene selection plus an editor to change title, action text, dialogue and duration.
- Add and delete scenes.
- Record the animation and download a WebM video in supported browsers.
- Static website: no desktop app, install, server or paid API key required for this prototype.

## Important truth about the current version

This is **not yet a full AI video generator**. The current story planner uses simple rules and the visuals are procedural 2D canvas animation. It does not yet generate true 3D Roblox characters, AI-generated environments, realistic character motion, automatic cinematic camera work, or a guaranteed MP4 file. Browser speech synthesis is not embedded as an audio track in the exported video. Those features need a suitable generation/rendering engine and compute service; a static free website alone cannot provide unlimited high-quality AI video generation.

## Project files

- `index.html` — website, styling, story planner, scene editor, preview and WebM export.
- `README.md` — setup and feature notes.

The project is intentionally dependency-free so it can be hosted as a static website.
