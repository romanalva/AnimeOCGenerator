import test from "node:test";
import assert from "node:assert/strict";
import {
  DATA,
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

test("portrait outputs include differentiated regular, ChatGPT, and Nano Banana prompts", () => {
  const prompt = generatePrompt(MOODS["Office Modern Window"]);

  assert.ok(prompt.regularPrompt.includes(prompt.setting));
  assert.ok(prompt.chatgptPrompt.includes("Create a polished anime portrait illustration."));
  assert.ok(prompt.nanoPrompt.includes("Scene:"));
  assert.notEqual(prompt.regularPrompt, prompt.chatgptPrompt);
  assert.notEqual(prompt.chatgptPrompt, prompt.nanoPrompt);
  assert.equal(prompt.chatGPT.prompt.negative, prompt.negativePrompt);
  assert.equal(prompt.nanoBanana.prompt.negative, prompt.negativePrompt);
});

test("new beach volleyball preset outfits are selectable in the portrait data pool", () => {
  BEACH_OUTFITS.forEach((outfit) => {
    assert.ok(DATA.outfit.includes(outfit), `${outfit} should be selectable`);
  });
});
