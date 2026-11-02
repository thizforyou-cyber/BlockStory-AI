# BlockStory AI

A website-only studio for creating block-world 3D stories, editing scenes, previewing them in Three.js, and optionally generating original AI video clips through a secure hosted backend. The editor runs in the browser; the AI key stays on the server.

## Deploy the complete website + AI backend

GitHub Pages can host the browser editor but cannot run the `/api/ai` server function. To use AI storyboard writing and AI video generation, deploy this same repository to Vercel:

1. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
2. Import `thizforyou-cyber/BlockStory-AI` from GitHub.
3. Keep the default settings and deploy. Vercel detects the `api/ai.js` serverless function and installs `@huggingface/inference` from `package.json`.
4. In Vercel, open **Project → Settings → Environment Variables**.
5. Add `GEMINI_API_KEY` only if you want the optional AI storyboard writer. The public LTX video workspace does not require a provider token.
6. Open the Vercel website URL. The `/api/ai` endpoint is same-origin, so the browser page never sees the private key.

For a token, visit [Hugging Face access tokens](https://huggingface.co/settings/tokens). Do not paste the token into the website, `index.html`, or a public GitHub file. `.env.example` is only a template.

You may still publish the static editor through **GitHub Settings → Pages**, but the AI buttons need the Vercel backend. If you use a different server host, it must support Node.js serverless functions and the `/api/ai` route.

## What works in the current browser version

- Enter a story prompt and generate a connected scene outline using the built-in local fallback.
- Optional AI storyboard writer: ask a hosted language model to draft 4–6 connected scenes, then edit them in the timeline.
- Public free text-to-video workspace: embed the Lightricks LTX Video Hugging Face Space directly in the studio, build a Roblox-inspired prompt from the story settings, and copy it into the generator. Download the generated MP4 from the public model workspace.
- Create a block-style 3D city or forest with a hero, enemy and glowing object.
- Preview 3D characters and basic actions: idle, run, jump, power-up, attack and celebrate.
- Drag the preview to rotate the camera; choose wide, close or cinematic camera framing.
- Edit scene title, action, dialogue, duration and character action.
- Add and delete scenes, play the sequence, and record a WebM video in supported browsers.
- Save and reopen a project as JSON.
- No desktop application or mandatory API key is needed for this prototype.

## Important limitations and costs

The optional AI storyboard writer works only after this repository is deployed to a Node.js host such as Vercel and a valid `GEMINI_API_KEY` is added as a server-side environment variable. The public LTX video workspace is hosted separately by Hugging Face and does not require an API key in this project.

The public LTX video workspace uses shared Hugging Face GPU capacity. It may have queues, daily usage limits, rate limits or outages; it is not unlimited private GPU hosting. Hugging Face documents ZeroGPU allowances by account type in its [Spaces API documentation](https://huggingface.co/docs/hub/en/spaces-api-endpoints).

The editable Three.js storyboard remains a procedural 3D animation system, not an AI-generated 3D world. The AI video output is a separate generated clip downloaded from the embedded public model workspace; it is not automatically converted into editable 3D characters or merged with the 3D timeline yet. The browser WebM export captures the 3D canvas; browser speech is not mixed into that WebM audio track.

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
