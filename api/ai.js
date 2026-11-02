const MODELS = new Set(["Wan-AI/Wan2.2-TI2V-5B"]);
const PROVIDERS = new Set(["fal-ai"]);

function sendJson(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function writeStoryboard(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI story writing is not configured. Add GEMINI_API_KEY in Vercel Environment Variables.");
  const system = [
    "You are the story director for BlockStory AI, a Roblox-inspired block-world animation studio.",
    "Turn the user's idea into 4 to 6 connected, filmable scenes.",
    'Return ONLY valid JSON with shape { "scenes": [{ "title": "...", "description": "...", "dialogue": "...", "action": "idle|run|jump|power|attack|celebrate", "duration": 5, "setting": "...", "hero": "...", "villain": "..." }] }.',
    "Use action only from idle, run, jump, power, attack, celebrate. Keep each description visual and concise.",
    "Keep the same hero, villain and setting consistent across scenes. No markdown."
  ].join(" ");
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + encodeURIComponent(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 1800, responseMimeType: "application/json" }
    })
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = data?.error?.message || "Gemini request failed.";
    throw new Error(detail);
  }
  const raw = data?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("") || "";
  let parsed;
  try { parsed = JSON.parse(raw.replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/, "").trim()); }
  catch { throw new Error("The story AI returned an unreadable response. Please try again."); }
  if (!Array.isArray(parsed.scenes) || !parsed.scenes.length) throw new Error("The story AI did not return any scenes.");
  return parsed.scenes.slice(0, 6);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Use POST for AI generation." });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const prompt = String(body.prompt || "").trim().slice(0, 1800);
    const task = body.task;
    if (!prompt) return sendJson(res, 400, { error: "Please enter a story prompt." });
    if (!["storyboard", "video"].includes(task)) return sendJson(res, 400, { error: "Unknown AI task." });

    if (task === "storyboard") {
      const scenes = await writeStoryboard(prompt);
      return sendJson(res, 200, { scenes });
    }

    const token = process.env.HF_TOKEN;
    if (!token) return sendJson(res, 503, { error: "AI video generation is not configured. Add HF_TOKEN in Vercel Environment Variables." });
    const { InferenceClient } = await import("@huggingface/inference");
    const hf = new InferenceClient(token);
    const model = MODELS.has(body.model) ? body.model : "Wan-AI/Wan2.2-TI2V-5B";
    const provider = PROVIDERS.has(body.provider) ? body.provider : "fal-ai";
    const style = String(body.style || "city").slice(0, 30);
    const genre = String(body.genre || "adventure").slice(0, 30);
    const videoPrompt = [
      "Create a short cinematic 3D animated video in a family-friendly blocky sandbox game aesthetic.",
      "Original generic block characters, chunky geometric shapes, expressive movement, colorful game environment, smooth camera motion.",
      "World: " + style + ". Mood: " + genre + ". Story: " + prompt,
      "No logos, no copyrighted game characters, no subtitles or text overlays."
    ].join(" ");
    const video = await hf.textToVideo({ inputs: videoPrompt, model, provider, num_frames: 81, guidance_scale: 5 });
    const bytes = Buffer.from(await video.arrayBuffer());
    if (!bytes.length) throw new Error("The video provider returned an empty file.");
    res.status(200);
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="blockstory-ai-video.mp4"');
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Length", String(bytes.length));
    return res.end(bytes);
  } catch (error) {
    const message = String(error?.message || "AI generation failed").slice(0, 500);
    const status = /unauthorized|invalid.*token|forbidden|api key not valid/i.test(message) ? 401 : 502;
    return sendJson(res, status, { error: message });
  }
}
