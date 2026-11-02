# BlockStory AI

A free-first, website-based prototype for turning a story idea into an editable block-style storyboard and a downloadable WebM video.

## Run it

1. Open the repository's **index.html** file, or enable GitHub Pages to publish it as a website.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then save.
5. Open the published Pages URL shown in that section.

## Current prototype features

- Enter a story idea and choose a duration and visual mood.
- Generate a simple six-beat storyboard, scaled to the selected duration.
- Select scenes and preview procedural block-style animation.
- Use browser text-to-speech narration or subtitles-only mode.
- Record the canvas preview and download a WebM video.
- No server, paid API key, or desktop software is required.

## Important limitations

This is the first free browser prototype, not a full AI video-generation service. Story planning is rule-based, and the visuals are procedural 2D canvas artwork with a block-world look. It does not yet generate original 3D Roblox assets, understand every prompt, provide character customization, or use a hosted generative-video model. Browser support for WebM recording and speech varies.

## Project structure

- `index.html` — complete website prototype (HTML, CSS, and JavaScript).
- `README.md` — setup and feature notes.

The project is intentionally dependency-free so it can be hosted as a static website.
