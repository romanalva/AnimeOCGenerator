export const DEFAULT_STYLE_PRESET_NAME = "soft_render_cinematic_anime";

export const SOFT_RENDER_LOCK =
  "modern high-detail anime style, soft-render digital illustration, clean thin refined line art, semi-realistic painterly shading, smooth skin gradients, soft highlights on skin, detailed irises with multiple highlights, layered voluminous hair with glossy sheen, volumetric lighting, soft rim lighting, cinematic atmosphere, warm practical light balanced with cool ambient exterior light";

export const SOFT_RENDER_AVOID_LOCK =
  "Avoid flat cel shading, heavy black outlines, harsh contrast, and stiff hair rendering.";

export const STYLE_PRESETS = {
  soft_render_cinematic_anime: {
    style_preset_name: "soft_render_cinematic_anime",
    primary_style_keywords: [
      "modern high-detail anime style",
      "soft-render digital illustration",
      "painterly shading",
      "refined line art",
    ],
    linework: [
      "clean thin line art",
      "delicate refined outlines",
      "light elegant contour work",
    ],
    rendering: [
      "semi-realistic painterly shading",
      "smooth skin gradients",
      "soft highlights on skin",
      "layered hair rendering",
      "glossy hair sheen",
    ],
    lighting: [
      "volumetric lighting",
      "soft rim lighting",
      "cinematic atmosphere",
      "warm practical light balanced with cool ambient exterior light",
    ],
    detail_keywords: [
      "detailed irises with multiple highlights",
      "soft subsurface scattering on skin",
      "layered voluminous hair",
    ],
    avoid_guidance: [
      "avoid flat cel shading",
      "avoid heavy black outlines",
      "avoid harsh contrast",
      "avoid stiff hair rendering",
    ],
    reference_match_instruction:
      "match the rendering finish, painterly shading, soft skin highlights, layered hair treatment, and cinematic lighting behavior of the reference image while preserving the target character identity",
    refinement_pass:
      "increase painterly shading depth, soften skin transitions, add soft luminous highlights, refine layered glossy hair, and strengthen the cinematic warm-vs-cool light balance",
    soft_render_lock: SOFT_RENDER_LOCK,
    avoid_lock: SOFT_RENDER_AVOID_LOCK,
  },
};

export const FINISH_INTENSITY_GUIDANCE = {
  light: {
    rendering:
      "keep the finish light, with mild painterly shading, lighter skin gradients, and subtle hair layering",
    nano:
      "Keep the finish restrained, with mild painterly shading, lighter skin gradients, and only subtle hair layering.",
    chatgpt:
      "Use a light finish intensity: mild painterly shading, lighter skin gradients, and subtle hair layering.",
  },
  medium: {
    rendering:
      "push stronger painterly skin gradients, visible glossy layered hair, and stronger cinematic light shaping",
    nano:
      "Use a medium finish with stronger painterly skin gradients, visible glossy layered hair, and stronger cinematic light shaping.",
    chatgpt:
      "Use a medium finish intensity with stronger painterly skin gradients, visible glossy layered hair, and stronger cinematic light shaping.",
  },
  high: {
    rendering:
      "apply the full soft-render cinematic finish with deeper painterly shading, more luminous skin highlights, and stronger atmospheric warm-vs-cool lighting contrast",
    nano:
      "Push the finish fully: deeper painterly shading, more luminous skin highlights, and stronger atmospheric warm-vs-cool lighting contrast.",
    chatgpt:
      "Use a high finish intensity: full soft-render cinematic finish, deeper painterly shading, more luminous skin highlights, and stronger atmospheric warm-vs-cool lighting contrast.",
  },
};

export const LIGHTING_MODE_GUIDANCE = {
  warm_indoor_vs_cool_night:
    "balance warm practical interior light against cool ambient night light for a cinematic contrast",
  golden_hour_soft_glow:
    "shape the scene with soft golden-hour glow, luminous diffusion, and warm atmospheric depth",
  studio_softbox_anime:
    "use a soft anime portrait light with softbox-like wrap, clean facial modeling, and controlled highlight rolloff",
  neon_rim_lighting:
    "build the light with saturated neon accents, soft rim separation, and atmospheric glow around the silhouette",
};

export function resolveStylePreset(stylePresetName) {
  return STYLE_PRESETS[stylePresetName] || null;
}
