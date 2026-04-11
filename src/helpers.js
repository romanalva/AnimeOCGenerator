import {
  CHATGPT_SIZE,
  LANE_SUPPORT_POOLS,
  LANES,
  NOVA_SOL_ANCHOR,
  RATIO_INFO,
} from "./data.js";
import {
  DEFAULT_STYLE_PRESET_NAME,
  FINISH_INTENSITY_GUIDANCE,
  LIGHTING_MODE_GUIDANCE,
  resolveStylePreset,
  STYLE_PRESETS,
} from "./renderStylePresets.js";

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleWithoutReplacement(arr, count) {
  const sampleSize = Math.max(0, Math.min(count, arr.length));
  const copy = [...arr];

  for (let index = 0; index < sampleSize; index += 1) {
    const swapIndex =
      index + Math.floor(Math.random() * (copy.length - index));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy.slice(0, sampleSize);
}

export function pickN(arr, count) {
  return sampleWithoutReplacement(arr, count);
}

function getLaneSupportPool(laneName, key, fallback) {
  return LANE_SUPPORT_POOLS[laneName]?.[key] || fallback;
}

function uniqueList(items, limit = items.length) {
  return [...new Set(items.filter(Boolean))].slice(0, limit);
}

function formatNaturalList(items) {
  const filtered = items.filter(Boolean);
  if (filtered.length <= 1) {
    return filtered[0] || "";
  }
  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered[filtered.length - 1]}`;
}

function stripAvoidPrefix(value = "") {
  return value.replace(/^avoid\s+/i, "").trim();
}

function buildAvoidGuidanceSentence(negativeStyleGuidance = []) {
  const cleaned = negativeStyleGuidance.map(stripAvoidPrefix).filter(Boolean);
  if (!cleaned.length) {
    return "";
  }
  return `Avoid ${formatNaturalList(cleaned)}.`;
}

function inferEnvironmentLightingMode(slots) {
  const searchable = `${slots.env || ""} ${slots.light || ""} ${slots.timeOfDay || ""} ${slots.palette || ""}`.toLowerCase();

  if (searchable.includes("neon") || searchable.includes("cyber") || searchable.includes("midnight")) {
    return "neon_rim_lighting";
  }
  if (
    searchable.includes("golden")
    || searchable.includes("sunset")
    || searchable.includes("dusk")
    || searchable.includes("peach")
  ) {
    return "golden_hour_soft_glow";
  }
  if (
    searchable.includes("studio")
    || searchable.includes("setup")
    || searchable.includes("office")
    || searchable.includes("desk")
    || searchable.includes("interior")
  ) {
    return "studio_softbox_anime";
  }
  return "warm_indoor_vs_cool_night";
}

function normalizeReferenceMode(referenceMode) {
  return {
    enabled: Boolean(referenceMode?.enabled),
    instruction: referenceMode?.instruction || "",
  };
}

function resolveEnvironmentRenderConfig(slots) {
  const characterAnchor =
    slots.characterAnchor || (slots.novaSol ? NOVA_SOL_ANCHOR : "");
  const characterName =
    slots.characterName || (slots.novaSol ? "Nova Sol" : "");
  const stylePresetName =
    slots.style_preset_name
    || (characterAnchor ? DEFAULT_STYLE_PRESET_NAME : "");
  const stylePreset = stylePresetName ? resolveStylePreset(stylePresetName) : null;
  const finishIntensity = FINISH_INTENSITY_GUIDANCE[slots.finish_intensity]
    ? slots.finish_intensity
    : "medium";
  const lightingMode = LIGHTING_MODE_GUIDANCE[slots.lighting_mode]
    ? slots.lighting_mode
    : inferEnvironmentLightingMode(slots);
  const negativeStyleGuidance = uniqueList(
    slots.negative_style_guidance?.length
      ? slots.negative_style_guidance
      : stylePreset?.avoid_guidance || [],
    8,
  );
  const refinementInstruction =
    slots.refinement_instruction === true
      ? "auto"
      : slots.refinement_instruction || "";

  return {
    ...slots,
    characterAnchor,
    characterName,
    style_preset_name: stylePresetName,
    render_profile:
      slots.render_profile
      || (stylePreset ? stylePresetName : "default_environment"),
    model_target:
      slots.model_target === "nano_banana" ? "nano_banana" : "chatgpt",
    stylePreset,
    finish_intensity: finishIntensity,
    lighting_mode: lightingMode,
    reference_mode: normalizeReferenceMode(slots.reference_mode),
    refinement_instruction: refinementInstruction,
    negative_style_guidance: negativeStyleGuidance,
    soft_render_lock: stylePreset?.soft_render_lock || "",
    avoid_lock:
      buildAvoidGuidanceSentence(negativeStyleGuidance)
      || stylePreset?.avoid_lock
      || "",
  };
}

function buildEnvironmentReferenceInstruction(slots, modelTarget) {
  if (!slots.reference_mode?.enabled || !slots.stylePreset) {
    return "";
  }

  const baseInstruction = (
    slots.reference_mode.instruction
    || slots.stylePreset.reference_match_instruction
    || ""
  )
    .replace(/\s*while preserving the target character identity\s*/i, " ")
    .replace(/\s*preserving the target character identity\s*/i, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[,\s]+$/, "");

  if (!baseInstruction) {
    return "";
  }

  const preservedIdentity = slots.characterName
    ? `the ${slots.characterName} character identity`
    : "the target character identity";
  const explicitConstraints = formatNaturalList([
    `${slots.env} scene`,
    `${slots.viewpoint} framing`,
    `${slots.composition} composition`,
  ]);

  if (modelTarget === "nano_banana") {
    return `${baseInstruction.charAt(0).toUpperCase() + baseInstruction.slice(1)} while preserving ${preservedIdentity}, ${explicitConstraints}, and any explicit wardrobe or pose constraints already defined.`;
  }

  return `Reference image direction: ${baseInstruction}, while preserving ${preservedIdentity}, ${explicitConstraints}, and any explicit wardrobe or pose constraints already defined.`;
}

function buildEnvironmentRefinementInstruction(slots, modelTarget) {
  if (!slots.refinement_instruction || !slots.stylePreset) {
    return "";
  }

  const baseInstruction =
    slots.refinement_instruction === "auto"
      ? slots.stylePreset.refinement_pass
      : slots.refinement_instruction;
  if (!baseInstruction) {
    return "";
  }

  if (modelTarget === "nano_banana") {
    return `${baseInstruction.charAt(0).toUpperCase() + baseInstruction.slice(1)}.`;
  }

  return `Refinement pass: ${baseInstruction}.`;
}

function buildEnvironmentCharacterConsistency(slots) {
  if (!slots.characterAnchor) {
    return "";
  }

  return `Keep ${slots.characterName || "the character"} on-model and fully consistent with this character brief: ${slots.characterAnchor}`;
}

function buildEnvironmentStyleDirection(slots, modelTarget) {
  if (!slots.stylePreset || !slots.characterAnchor) {
    return "";
  }

  const finishGuidance =
    FINISH_INTENSITY_GUIDANCE[slots.finish_intensity]?.[modelTarget]
    || FINISH_INTENSITY_GUIDANCE.medium[modelTarget];
  const lightingGuidance =
    LIGHTING_MODE_GUIDANCE[slots.lighting_mode]
    || LIGHTING_MODE_GUIDANCE.warm_indoor_vs_cool_night;

  return `Render the character finish with ${formatNaturalList(slots.stylePreset.primary_style_keywords)}, ${formatNaturalList(slots.stylePreset.linework)}, ${formatNaturalList(slots.stylePreset.rendering)}, and ${formatNaturalList(slots.stylePreset.detail_keywords)}. ${finishGuidance} Let the lighting ${lightingGuidance}.`;
}

function buildEnvironmentSummary(slots, laneName) {
  return {
    lane: laneName,
    env: slots.env,
    mood: slots.mood,
    light: slots.light,
    weather: slots.weather,
    style: slots.style,
    ratio: slots.ratio,
    viewpoint: slots.viewpoint,
    timeOfDay: slots.timeOfDay,
    season: slots.season,
    foreground: slots.foreground,
    palette: slots.palette,
    composition: slots.composition,
    texture: slots.texture,
    dof: slots.dof,
    soundRef: slots.soundRef,
    characterName: slots.characterName,
    style_preset_name: slots.style_preset_name,
    render_profile: slots.render_profile,
    finish_intensity: slots.finish_intensity,
    lighting_mode: slots.lighting_mode,
    reference_mode: slots.reference_mode?.enabled || false,
    export_use: RATIO_INFO[slots.ratio]?.use,
  };
}

function buildEnvironmentRegularPrompt(slots, laneName) {
  const themeLead = slots.collTheme
    ? `Art direct this piece as part of the "${slots.collTheme}" collection. `
    : "";
  const characterLead = slots.novaSol
    ? `Integrate ${slots.characterName || "Nova Sol"} naturally into the scene: ${slots.characterAnchor} `
    : "Keep the image environment-led, with no foreground character. ";

  const styleDirection = buildEnvironmentStyleDirection(slots, "chatgpt");
  const consistency = buildEnvironmentCharacterConsistency(slots);

  return `${themeLead}Create a premium 2D anime environment illustration for the ${laneName} lane. ${characterLead}The core scene is ${slots.env}, seen from a ${slots.viewpoint} with ${slots.composition} on a ${slots.ratio} canvas. Stage it during ${slots.timeOfDay} in ${slots.season}, using ${slots.light} and ${slots.weather}. Anchor the foreground with ${slots.foreground}, layer in ${slots.details.join(", ")}, and emphasize ${slots.texture} surfaces with ${slots.dof}. Push a ${slots.palette} color script and let ${slots.soundRef} inform the atmosphere. Render it in ${slots.style} with strong depth, cohesive worldbuilding, and a decor-ready finish.${styleDirection ? ` ${styleDirection}` : ""}${consistency ? ` ${consistency}.` : ""}${slots.avoid_lock ? ` ${slots.avoid_lock}` : ""}`;
}

function buildEnvironmentChatGptPrompt(slots, laneName) {
  const themeLead = slots.collTheme
    ? `This image belongs to the "${slots.collTheme}" collection and should clearly reinforce that theme. `
    : "";
  const characterLead = slots.novaSol
    ? `Include ${slots.characterName || "Nova Sol"} naturally within the world: ${slots.characterAnchor} `
    : "Do not place a featured character in the foreground. ";
  const styleDirection = buildEnvironmentStyleDirection(slots, "chatgpt");
  const consistency = buildEnvironmentCharacterConsistency(slots);
  const referenceInstruction = buildEnvironmentReferenceInstruction(slots, "chatgpt");
  const refinementInstruction = buildEnvironmentRefinementInstruction(slots, "chatgpt");

  return `Create a polished anime environment illustration for Sunset Deck Studio. ${themeLead}${characterLead}Scene: ${slots.env}. Composition: ${slots.viewpoint}, ${slots.composition}, ${slots.ratio} framing. Time and season: ${slots.timeOfDay} in ${slots.season}. Lighting and atmosphere: ${slots.light}, ${slots.weather}. Foreground and story cues: ${slots.foreground}; ${slots.details.join(", ")}. Surface and focus treatment: ${slots.texture}; ${slots.dof}. Color direction: ${slots.palette}. Ambient reference: ${slots.soundRef}. Render in ${slots.style}. ${styleDirection}${consistency ? ` Consistency lock: ${consistency}.` : ""}${slots.avoid_lock ? ` ${slots.avoid_lock}` : ""}${referenceInstruction ? ` ${referenceInstruction}` : ""}${refinementInstruction ? ` ${refinementInstruction}` : ""} Keep the image premium, cohesive, atmospheric, and gallery-ready, with no text, watermark, logo, signature, drop shadows, or ground plane.`;
}

function buildEnvironmentNanoPrompt(slots) {
  const themeLead = slots.collTheme
    ? `Collection theme: ${slots.collTheme}. `
    : "";
  const characterLead = slots.novaSol
    ? `Character: ${slots.characterAnchor}. `
    : "No foreground character. ";
  const styleDirection = buildEnvironmentStyleDirection(slots, "nano");
  const consistency = buildEnvironmentCharacterConsistency(slots);
  const referenceInstruction = buildEnvironmentReferenceInstruction(slots, "nano_banana");
  const refinementInstruction = buildEnvironmentRefinementInstruction(slots, "nano_banana");

  return `${themeLead}${characterLead}Scene: ${slots.env}. Format: ${slots.ratio}. Camera: ${slots.viewpoint}; ${slots.composition}. Time: ${slots.timeOfDay}; ${slots.season}. Lighting: ${slots.light}. Atmosphere: ${slots.weather}. Foreground: ${slots.foreground}. Story details: ${slots.details.join(", ")}. Surface: ${slots.texture}. Focus: ${slots.dof}. Palette: ${slots.palette}. Audio vibe: ${slots.soundRef}. Style: ${slots.style}.${styleDirection ? ` ${styleDirection}` : ""}${consistency ? ` ${consistency}.` : ""}${slots.avoid_lock ? ` ${slots.avoid_lock}` : ""}${referenceInstruction ? ` ${referenceInstruction}` : ""}${refinementInstruction ? ` ${refinementInstruction}` : ""} Output goal: premium decor-ready anime environment, strong depth, volumetric light, no text, no watermark, no drop shadows, no ground plane.`;
}

export function buildEtsy(lane, slots, novaSol) {
  const laneConfig = LANES[lane];
  const ratioLabel =
    slots.ratio === "16:9"
      ? "Landscape"
      : slots.ratio === "2:3"
        ? "Portrait"
        : slots.ratio === "1:1"
          ? "Square"
          : "Vertical";
  const title = `${pick(laneConfig.etsyTitleBase)} Printable Wall Art - Anime ${ratioLabel} Digital Download | ${laneConfig.tag
    .split(" ")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ")} Print`;
  const keywords = pickN(laneConfig.etsyKeywords, 10);
  const base = [
    "digital download",
    "printable wall art",
    "instant download",
    "anime wall art",
    "digital art print",
  ];
  const tags = [...new Set([...keywords, ...base])].slice(0, 13);
  const description = `Bring the ${slots.mood} atmosphere of a ${slots.env} into your space with this premium anime-inspired digital art print.

ART DETAILS
- Style: ${slots.style}
- Mood: ${slots.mood}
- Lighting: ${slots.light}
- Season: ${slots.season} | ${slots.timeOfDay}
- Sound reference: ${slots.soundRef}
- Collection: Sunset Deck Studio - ${lane}${novaSol ? "\n- Features: Nova Sol signature character" : ""}

WHAT IS INCLUDED
- High-resolution digital file optimized for ${slots.ratio} (${RATIO_INFO[slots.ratio]?.px})
- Suitable for: ${RATIO_INFO[slots.ratio]?.use}
- Instant download - no waiting, no shipping

PRINTING TIPS
Print at your local print shop or use an online service. Recommended paper: matte fine art or satin photo paper. Standard frame sizes work best for 2:3 and 4:5 ratios.

PERFECT FOR
Music rooms | Gaming setups | Creator desks | Gallery walls | Aesthetic bedrooms | Gifts for music lovers and gamers

Copyright Sunset Deck Studio. Personal use only. No resale or redistribution.`;

  return { title, tags, description };
}

export function buildRedbubble(lane, slots, novaSol) {
  const laneConfig = LANES[lane];
  const title = `${slots.env} - ${slots.mood} | Sunset Deck Studio ${laneConfig.tag
    .split(" ")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ")} Anime Art`;
  const tags = [
    ...new Set([
      ...laneConfig.rbKeywords,
      "anime art",
      "digital art",
      "sunset deck studio",
      "wall art",
      "aesthetic",
      "premium art print",
    ]),
  ].slice(0, 15);
  const description = `Premium anime-inspired ${lane} atmosphere art from Sunset Deck Studio.

Scene: ${slots.env}
Mood: ${slots.mood} | Lighting: ${slots.light}
Style: ${slots.style}${novaSol ? "\nFeatures Nova Sol signature character" : ""}

Available on posters, art prints, stickers, phone cases, and more.`;

  return {
    title,
    tags,
    description,
    bestProducts: laneConfig.rbProducts,
  };
}

function assembleResult(laneName, slots, customNeg = []) {
  const laneConfig = LANES[laneName];
  const resolvedSlots = resolveEnvironmentRenderConfig(slots);
  const {
    env,
    mood,
    light,
    weather,
    details,
    style,
    ratio,
    viewpoint,
    timeOfDay,
    season,
    foreground,
    palette,
    composition,
    texture,
    dof,
    soundRef,
    novaSol = false,
    collTheme = "",
  } = resolvedSlots;
  const negTerms =
    customNeg.length > 0 ? customNeg : laneConfig.neg.split(", ");
  const mergedNegatives = uniqueList(
    [
      ...negTerms,
      ...resolvedSlots.negative_style_guidance.map(stripAvoidPrefix),
    ],
    20,
  );
  const negative = novaSol
    ? mergedNegatives.filter((term) => term !== "characters in foreground").join(", ")
    : mergedNegatives.join(", ");
  const slotSummary = buildEnvironmentSummary(resolvedSlots, laneName);
  const regularPrompt = buildEnvironmentRegularPrompt(resolvedSlots, laneName);
  const chatgptPrompt = buildEnvironmentChatGptPrompt(resolvedSlots, laneName);
  const nanoPrompt = buildEnvironmentNanoPrompt(resolvedSlots);
  const positive = regularPrompt;
  const combined = `${regularPrompt}\n\nNegative prompt: ${negative}`;
  const chatgptCombined = `${chatgptPrompt}\n\nNegative prompt: ${negative}`;
  const nanoCombined = `${nanoPrompt}\n\nNegative prompt: ${negative}`;

  const etsy = buildEtsy(laneName, resolvedSlots, novaSol);
  const rb = buildRedbubble(laneName, resolvedSlots, novaSol);

  return {
    ...resolvedSlots,
    regularPrompt,
    chatgptPrompt,
    nanoPrompt,
    negativePrompt: negative,
    positive,
    negative,
    combined,
    nanoBanana: {
      platform: "Nano Banana",
      lane: laneName,
      prompt: {
        regular: regularPrompt,
        positive: nanoPrompt,
        negative,
        combined: nanoCombined,
        style_lock: resolvedSlots.soft_render_lock,
        avoid_lock: resolvedSlots.avoid_lock,
        reference_instruction: buildEnvironmentReferenceInstruction(
          resolvedSlots,
          "nano_banana",
        ),
        refinement_instruction: buildEnvironmentRefinementInstruction(
          resolvedSlots,
          "nano_banana",
        ),
      },
      parameters: {
        aspect_ratio: ratio,
        resolution: RATIO_INFO[ratio].px.replace(/\s/g, ""),
        style_strength: 0.85,
        quality: "high",
        no_text: true,
        no_watermark: true,
        no_characters: !novaSol,
      },
      slot_summary: slotSummary,
    },
    chatGPT: {
      model: "gpt-4o",
      prompt: {
        regular: regularPrompt,
        optimized: chatgptPrompt,
        negative,
        combined: chatgptCombined,
        style_lock: resolvedSlots.soft_render_lock,
        avoid_lock: resolvedSlots.avoid_lock,
        reference_instruction: buildEnvironmentReferenceInstruction(
          resolvedSlots,
          "chatgpt",
        ),
        refinement_instruction: buildEnvironmentRefinementInstruction(
          resolvedSlots,
          "chatgpt",
        ),
      },
      messages: [
        {
          role: "system",
          content: `You are an AI image generation assistant for Sunset Deck Studio. Generate atmospheric 2D anime ${novaSol ? "character and " : ""}background art. Never include text, watermarks, drop shadows, or ground planes. Produce premium decor-ready environment illustrations.`,
        },
        { role: "user", content: chatgptCombined },
      ],
      image_generation: {
        size: CHATGPT_SIZE[ratio] || "1024x1024",
        quality: "hd",
        style: "vivid",
        n: 1,
      },
      slot_summary: slotSummary,
    },
    etsy,
    rb,
    lane: laneName,
    negTerms,
  };
}

export function buildResult(laneName, slotsData, customNeg = []) {
  const {
    locks = {},
    overrides = {},
    viewpoints,
    timesOfDay,
    seasons,
    palettes,
    compositions,
    textures,
    depths,
    soundRefs,
    foregrounds,
  } = slotsData;
  const laneConfig = LANES[laneName];
  const viewpointsPool = getLaneSupportPool(laneName, "viewpoints", viewpoints);
  const palettesPool = getLaneSupportPool(laneName, "palettes", palettes);
  const compositionsPool = getLaneSupportPool(laneName, "compositions", compositions);
  const texturesPool = getLaneSupportPool(laneName, "textures", textures);
  const depthsPool = getLaneSupportPool(laneName, "depths", depths);
  const soundRefsPool = getLaneSupportPool(laneName, "soundRefs", soundRefs);

  return assembleResult(
    laneName,
    {
      env: locks.env ? overrides.env : pick(laneConfig.environments),
      mood: locks.mood ? overrides.mood : pick(laneConfig.moods),
      light: locks.light ? overrides.light : pick(laneConfig.lighting),
      weather: locks.weather ? overrides.weather : pick(laneConfig.weather),
      details: locks.details ? overrides.details : pickN(laneConfig.details, 2),
      style: locks.style ? overrides.style : pick(laneConfig.style),
      ratio: locks.ratio ? overrides.ratio : pick(laneConfig.ratios),
      viewpoint: locks.viewpoint ? overrides.viewpoint : pick(viewpointsPool),
      timeOfDay: locks.timeOfDay ? overrides.timeOfDay : pick(timesOfDay),
      season: locks.season ? overrides.season : pick(seasons),
      foreground: locks.foreground
        ? overrides.foreground
        : pick(foregrounds[laneName] || foregrounds["Neon Deck"]),
      palette: locks.palette ? overrides.palette : pick(palettesPool),
      composition: locks.composition ? overrides.composition : pick(compositionsPool),
      texture: locks.texture ? overrides.texture : pick(texturesPool),
      dof: locks.dof ? overrides.dof : pick(depthsPool),
      soundRef: locks.soundRef ? overrides.soundRef : pick(soundRefsPool),
      novaSol: overrides.novaSol || false,
      collTheme: overrides.collTheme || "",
      characterName: overrides.characterName || "",
      characterAnchor: overrides.characterAnchor || "",
      style_preset_name: overrides.style_preset_name || "",
      render_profile: overrides.render_profile || "",
      model_target:
        overrides.model_target === "nano_banana" ? "nano_banana" : "chatgpt",
      finish_intensity: overrides.finish_intensity || "medium",
      lighting_mode: overrides.lighting_mode || "",
      reference_mode: overrides.reference_mode || { enabled: false, instruction: "" },
      refinement_instruction:
        overrides.refinement_instruction === true
          ? "auto"
          : overrides.refinement_instruction || "",
      negative_style_guidance: overrides.negative_style_guidance || [],
    },
    customNeg,
  );
}

export function buildResultFromSlots(laneName, slots, customNeg = []) {
  return assembleResult(laneName, slots, customNeg);
}
