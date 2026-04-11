import test from "node:test";
import assert from "node:assert/strict";
import {
  DATA,
  buildCharacterLock,
  buildNegativePrompt,
  buildRenderBlock,
  buildSceneBlock,
  dedupeDescriptors,
  generatePrompt,
  getOrientationForAspectRatio,
  MOODS,
} from "../src/portraitData.js";

const NEW_PRESETS = [
  "Volleyball Gym Sideline",
  "Volleyball Bleachers",
  "Volleyball Outdoor Sunset",
  "Beach Volleyball Sunrise Court",
  "Beach Volleyball Golden Hour Tournament",
  "Beach Volleyball Tropical Practice",
  "Beach Volleyball Luxury Resort",
  "Beach Volleyball Stormy Coast Match",
  "Office Modern Window",
  "Office Desk Workspace",
  "Office Conference Room",
];

const BEACH_OUTFITS = [
  "fitted pastel sports bikini top, high-waisted athletic bikini bottoms, lightweight cropped mesh cover-up",
  "competitive two-piece volleyball uniform with number-marked sports top, compression shorts, arm sleeve, taped fingers",
  "bright tropical sports bra, relaxed drawstring athletic shorts, open lightweight shirt, ankle wrap",
  "sleek designer-inspired volleyball set with elegant wrap skirt cover-up and subtle jewelry accents",
  "dark high-performance longline top, fitted athletic bottoms, windbreaker tied at the waist, supportive knee brace",
];

test("portrait scene presets are registered without duplicate names", () => {
  const presetNames = Object.keys(MOODS);
  assert.equal(new Set(presetNames).size, presetNames.length);
  NEW_PRESETS.forEach((presetName) => {
    assert.ok(MOODS[presetName], `${presetName} should exist in MOODS`);
  });
});

test("new portrait scene presets generate coherent scene-driven prompts", () => {
  NEW_PRESETS.forEach((presetName) => {
    const preset = MOODS[presetName];
    const prompt = generatePrompt(preset);
    assert.ok(DATA.setting.includes(prompt.setting));
    assert.ok(DATA.lighting.includes(prompt.lighting));
    assert.ok(DATA.composition.includes(prompt.composition));
    assert.ok(prompt.style_tags.length >= 3 && prompt.style_tags.length <= 5);
  });
});

test("new portrait scene settings are selectable in the portrait data pool", () => {
  NEW_PRESETS.forEach((presetName) => {
    const prompt = generatePrompt(MOODS[presetName]);
    assert.ok(
      DATA.setting.includes(prompt.setting),
      `${presetName} setting should be selectable`,
    );
  });
});

test("orientation is derived from the selected aspect ratio", () => {
  const portraitPrompt = generatePrompt({ aspect_ratio: "2:3 vertical (portrait)" });
  const landscapePrompt = generatePrompt({ aspect_ratio: "16:9 landscape (cinematic)" });
  const squarePrompt = generatePrompt({ aspect_ratio: "1:1 square" });

  assert.equal(portraitPrompt.orientation, "portrait");
  assert.equal(landscapePrompt.orientation, "landscape");
  assert.equal(squarePrompt.orientation, "square");
  assert.equal(getOrientationForAspectRatio("3:4 vertical (portrait)"), "portrait");
});

test("portrait outputs include full prompt plus modular prompt blocks", () => {
  const prompt = generatePrompt(MOODS["Office Modern Window"]);

  assert.ok(prompt.fullPrompt.includes("Create a high-quality anime illustration"));
  assert.ok(prompt.characterLockPrompt.includes("clearly adult woman"));
  assert.ok(prompt.scenePrompt.length > 0);
  assert.ok(prompt.renderBlockPrompt.length > 0);
  assert.ok(prompt.nanoPrompt.includes("Character Lock:"));
  assert.equal(prompt.chatGPT.prompt.negative, prompt.negativePrompt);
  assert.equal(prompt.nanoBanana.prompt.negative, prompt.negativePrompt);
});

test("new beach volleyball preset outfits are selectable in the portrait data pool", () => {
  BEACH_OUTFITS.forEach((outfit) => {
    assert.ok(DATA.outfit.includes(outfit), `${outfit} should be selectable`);
  });
});

const BLOATED_OVERRIDE = {
  age_aesthetic: "mature and elegant",
  body_type: "petite with curves",
  skin_tone: "light tan",
  face_shape: "angular elegant face",
  eye_color: "cool dark brown",
  eye_style: "bold wide eyes with thick lashes",
  lips: "full plump lips",
  hair_color: "rich chestnut",
  hair_length: "long with loose waves",
  hair_style: "softly wavy",
  outfit: "neon-trimmed bodysuit with sheer panels, thigh-high boots",
  accessories: "large gold hoop earrings",
  pose: "standing arms crossed with bold expression",
  expression: "confident direct stare",
  shot_type: "medium portrait",
  composition: "diagonal dynamic composition",
  camera_lens: "wide-angle slight distortion",
  setting: "retrowave arcade with glowing screens and neon signs",
  time_of_day: "blue hour",
  lighting: "vibrant neon-tinged city night light",
  color_palette: "retrowave purple and orange",
  weather_atmosphere: "clear and still",
  mood: "mysterious and sultry",
  anime_render_style: "modern anime poster art",
  linework_style: "bold graphic anime outlines",
  shading_style: "high-contrast dramatic anime shading",
  anime_eye_render: "cinematic anime eyes with wet-line shine",
  style_tags: [
    "premium anime poster art",
    "modern anime poster art",
    "polished commercial finish",
    "illustration-grade detailing",
    "high detail",
    "chromatic aberration",
  ],
};

test("bloated portrait prompt gets compressed without losing core identity", () => {
  const prompt = generatePrompt(BLOATED_OVERRIDE);

  assert.ok(prompt.regularPrompt.includes("clearly adult woman"));
  assert.ok(prompt.regularPrompt.includes("light tan"));
  assert.ok(prompt.regularPrompt.includes("neon-trimmed bodysuit"));
  assert.ok(prompt.regularPrompt.includes("Negative prompt:"));
  assert.ok(prompt.characterLockPrompt.split(/\s+/).length <= 25);
});

test("duplicate style phrases are collapsed in render block", () => {
  const prompt = generatePrompt(BLOATED_OVERRIDE);
  const renderBlock = buildRenderBlock(prompt);
  assert.equal((renderBlock.match(/poster art/gi) ?? []).length, 1);
});

test("conflicting lens terms are resolved to one", () => {
  const prompt = generatePrompt({
    ...BLOATED_OVERRIDE,
    camera_lens: "50mm natural lens",
    shot_type: "medium portrait",
    composition: "rule of thirds",
  });
  const scene = buildSceneBlock(prompt);
  assert.equal((scene.poseAndFraming.match(/lens/gi) ?? []).length, 1);
});

test("negative prompt stays compact default list", () => {
  const prompt = generatePrompt(BLOATED_OVERRIDE);
  assert.equal(prompt.negativePrompt, buildNegativePrompt());
  assert.equal(prompt.negativePrompt, "low quality, blurry, bad anatomy, malformed hands, extra fingers, extra limbs, asymmetrical eyes, facial distortion, muddy colors, text, watermark, logo");
});

test("character lock output stays stable across scene changes", () => {
  const base = generatePrompt(BLOATED_OVERRIDE);
  const changedScene = generatePrompt({
    ...BLOATED_OVERRIDE,
    setting: "modern penthouse with floor-to-ceiling city view at night",
    lighting: "cool moonlit blue-white light",
    mood: "bold and confident",
  });

  assert.equal(buildCharacterLock(base), buildCharacterLock(changedScene));
});

test("scene prompt changes while character lock stays constant", () => {
  const sceneA = generatePrompt({
    ...BLOATED_OVERRIDE,
    setting: "retrowave arcade with glowing screens and neon signs",
  });
  const sceneB = generatePrompt({
    ...BLOATED_OVERRIDE,
    setting: "moonlit balcony overlooking ocean",
  });

  assert.equal(sceneA.characterLockPrompt, sceneB.characterLockPrompt);
  assert.notEqual(sceneA.scenePrompt, sceneB.scenePrompt);
});

test("optional fields are omitted when empty or redundant", () => {
  const prompt = generatePrompt({
    ...BLOATED_OVERRIDE,
    accessories: "no accessories",
    weather_atmosphere: "",
    style_tags: ["high detail", "high detail", "illustration-grade detailing"],
  });

  assert.ok(!prompt.regularPrompt.includes("no accessories"));
  assert.deepEqual(
    dedupeDescriptors(prompt.style_tags),
    ["high detail"],
  );
});
