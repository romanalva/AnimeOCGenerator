import test from "node:test";
import assert from "node:assert/strict";
import { DATA, generatePrompt, MOODS } from "../src/portraitData.js";

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

test("portrait scene presets are registered without duplicate names", () => {
  const presetNames = Object.keys(MOODS);
  assert.equal(new Set(presetNames).size, presetNames.length);
  NEW_PRESETS.forEach((presetName) => {
    assert.ok(MOODS[presetName], `${presetName} should exist in MOODS`);
  });
});

test("new portrait scene presets apply their scene-specific setting and composition", () => {
  NEW_PRESETS.forEach((presetName) => {
    const preset = MOODS[presetName];
    const prompt = generatePrompt(preset);
    assert.equal(prompt.setting, preset.setting);
    assert.equal(prompt.lighting, preset.lighting);
    assert.equal(prompt.composition, preset.composition);
  });
});

test("new portrait scene settings are selectable in the portrait data pool", () => {
  NEW_PRESETS.forEach((presetName) => {
    assert.ok(
      DATA.setting.includes(MOODS[presetName].setting),
      `${presetName} setting should be selectable`,
    );
  });
});

test("new beach volleyball preset outfits are selectable in the portrait data pool", () => {
  NEW_PRESETS
    .filter((presetName) => presetName.startsWith("Beach Volleyball"))
    .forEach((presetName) => {
      assert.ok(
        DATA.outfit.includes(MOODS[presetName].outfit),
        `${presetName} outfit should be selectable`,
      );
    });
});
