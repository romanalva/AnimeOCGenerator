import {
  CHATGPT_SIZE,
  LANE_SUPPORT_POOLS,
  LANES,
  NOVA_SOL_ANCHOR,
  RATIO_INFO,
} from "./data";

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
  } = slots;
  const characterDirection = novaSol
    ? `Feature Nova Sol naturally within the environment: ${NOVA_SOL_ANCHOR}`
    : "Environment-led scene only, with no foreground character.";
  const themeDirection = collTheme
    ? `Create this as part of the collection theme "${collTheme}". `
    : "";

  const positive = `${themeDirection}Create a premium decor-ready 2D anime environment illustration. ${characterDirection} Core scene: ${env}. Compose the frame for a ${ratio} canvas, using a ${viewpoint} and ${composition}. Seasonal moment: ${timeOfDay} in ${season}. Lighting and atmosphere: ${light}; ${weather}. Foreground anchor: ${foreground}. Story details: ${details.join(", ")}. Surface language: ${texture}. Focus treatment: ${dof}. Color script: ${palette}. Ambient cue: ${soundRef}. Render approach: ${style}. Prioritize atmospheric depth, volumetric light, cohesive worldbuilding, and a polished gallery-ready finish. No text, no watermarks, no drop shadows, no ground plane.`;

  const negTerms =
    customNeg.length > 0 ? customNeg : laneConfig.neg.split(", ");
  const negative = novaSol
    ? negTerms.filter((term) => term !== "characters in foreground").join(", ")
    : negTerms.join(", ");
  const combined = `${positive}\n\nNegative prompt: ${negative}`;

  const etsy = buildEtsy(laneName, slots, novaSol);
  const rb = buildRedbubble(laneName, slots, novaSol);

  return {
    ...slots,
    positive,
    negative,
    combined,
    nanoBanana: {
      platform: "Nano Banana",
      lane: laneName,
      prompt: { positive, negative, combined },
      parameters: {
        aspect_ratio: ratio,
        resolution: RATIO_INFO[ratio].px.replace(/\s/g, ""),
        style_strength: 0.85,
        quality: "high",
        no_text: true,
        no_watermark: true,
        no_characters: !novaSol,
      },
      slot_summary: { ...slots, export_use: RATIO_INFO[ratio]?.use },
    },
    chatGPT: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI image generation assistant for Sunset Deck Studio. Generate atmospheric 2D anime ${novaSol ? "character and " : ""}background art. Never include text, watermarks, drop shadows, or ground planes. Produce premium decor-ready environment illustrations.`,
        },
        { role: "user", content: combined },
      ],
      image_generation: {
        size: CHATGPT_SIZE[ratio] || "1024x1024",
        quality: "hd",
        style: "vivid",
        n: 1,
      },
      slot_summary: { lane: laneName, ...slots, export_use: RATIO_INFO[ratio]?.use },
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
    },
    customNeg,
  );
}

export function buildResultFromSlots(laneName, slots, customNeg = []) {
  return assembleResult(laneName, slots, customNeg);
}
