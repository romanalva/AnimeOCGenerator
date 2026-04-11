import test from "node:test";
import assert from "node:assert/strict";
import { buildResultFromSlots } from "../src/helpers.js";

test("environment character outputs use the shared soft-render preset for both models", () => {
  const result = buildResultFromSlots("Sunset Pulse", {
    env: "rooftop terrace overlooking the city",
    mood: "golden nostalgic warmth",
    light: "warm tangerine backlight",
    weather: "clear sky with warm haze",
    details: ["birds silhouetted against sky", "slow traffic light trails"],
    style: "Makoto Shinkai cinematic 2D anime background",
    ratio: "4:5",
    viewpoint: "eye-level street view",
    timeOfDay: "late afternoon",
    season: "summer",
    foreground: "iron railing detail",
    palette: "warm amber and deep brown",
    composition: "rule of thirds",
    texture: "polished marble",
    dof: "soft bokeh background",
    soundRef: "jazz piano late night",
    novaSol: true,
    style_preset_name: "soft_render_cinematic_anime",
    finish_intensity: "high",
    lighting_mode: "golden_hour_soft_glow",
    reference_mode: { enabled: true },
    refinement_instruction: true,
  });

  assert.equal(result.style_preset_name, "soft_render_cinematic_anime");
  assert.equal(result.render_profile, "soft_render_cinematic_anime");
  assert.ok(result.chatgptPrompt.includes("Render the character finish with modern high-detail anime style"));
  assert.ok(result.nanoPrompt.includes("Render the character finish with modern high-detail anime style"));
  assert.ok(result.chatgptPrompt.includes("Reference image direction:"));
  assert.ok(result.nanoPrompt.includes("Match the rendering finish"));
  assert.ok(result.negativePrompt.includes("flat cel shading"));
  assert.ok(result.chatGPT.prompt.style_lock.includes("soft-render digital illustration"));
  assert.ok(result.nanoBanana.prompt.avoid_lock.includes("Avoid flat cel shading"));
});
