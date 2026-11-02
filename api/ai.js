import { InferenceClient } from "@huggingface/inference";

const MODELS = new Set(["Wan-AI/Wan2.2-TI2V-5B"]);
const PROVIDERS = new Set(["fal-ai"]);

function sendJson(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Use POST for AI generation." });
  const token = process.env.HF_TOKEN;
  if (!token) return sendJson(res, 503, { error: "AI backend is not configured yet. Add HF_TOKEN in your hosting environment variables." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const prompt = String(body.prompt || "").trim().slice(0, 1800);
    const task = body.task;
    if (!prompt) return sendJson(res, 400, { error: "Please enter a story prompt." });
    if (!["storyboard", "video"].includes(task)) return sendJson(res, 400, { error: "Unknown AI task." });

    const hf = new InferenceClient(token);
    if (task === "storyboard") {
      const system = [
        "You are the story director for BlockStory AI, a Roblox-inspired block-world animation studio.",
        "Turn the user's idea into 4 to 6 connected, filmable scenes.",
        "Return ONLY valid JSON with shape { scenes: [{ title, description, dialogue, action, duration, setting, hero, villain }] }.",
        "Use action only from idle, run, jump, power, attack, celebrate. Keep each description visual and concise.",
        "Keep the same hero, villain and setting consistent across scenes. No markdown."
      ].join(" ");
      const result = await hf.chatCompletion({
        model: "openai/gpt-oss-20b:fastest",
        messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
        max_tokens: 1400,
        temperature: 0.75
      });
      const raw = result.choices?.[0]?.message?.content || "";
      const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      let parsed;
      try { parsed = JSON.parse(clean); } catch { throw new Error("The story AI returned an unreadable response. Please try again."); }
      if (!Array.isArray(parsed.scenes) || !parsed.scenes.length) throw new Error("The story AI did not return any scenes.");
      return sendJson(res, 200, { scenes: parsed.scenes.slice(0, 6) });
    }

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
    const status = /unauthorized|invalid.*token|forbidden/i.test(message) ? 401 : 502;
    return sendJson(res, status, { error: message });
  }
}
