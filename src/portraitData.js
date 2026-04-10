const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randMulti = (arr, min, max) => {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const sampleSize = Math.max(0, Math.min(count, arr.length));
  const copy = [...arr];

  for (let index = 0; index < sampleSize; index += 1) {
    const swapIndex =
      index + Math.floor(Math.random() * (copy.length - index));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy.slice(0, sampleSize);
};

export const DATA = {
  aspect_ratio: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square", "4:3 landscape", "3:2 landscape", "16:9 landscape (cinematic)", "21:9 ultrawide (cinematic)"],
  orientation: ["portrait", "landscape", "square"],
  shot_type: ["close-up portrait", "medium portrait", "3/4 body shot", "full body shot", "bust shot", "extreme close-up face", "wide full body with environment", "cowboy shot (waist to knees)", "overhead top-down shot", "low angle full body"],
  composition: ["centered symmetrical composition", "rule of thirds", "foreground framing with depth", "negative space on one side", "diagonal dynamic composition", "subject fills frame", "environmental context wide shot", "tight crop with bokeh background", "layered depth foreground and background", "silhouette against light source", "athlete portrait with shallow background separation", "balanced sports media-day portrait composition", "cinematic golden-hour sports lifestyle portrait", "clean executive portrait composition", "uncluttered desk-side professional portrait", "architectural leadership portrait composition"],
  camera_lens: ["50mm natural lens", "telephoto compressed background", "wide-angle slight distortion", "macro close detail", "vintage film lens softness", "85mm portrait lens", "35mm slight wide", "long lens shallow depth of field"],
  color_palette: ["warm amber and cream", "cool blue and white", "earthy terracotta and green", "soft pink and gold", "moody desaturated", "high contrast black and white with one accent color", "rich jewel tones", "sunset orange and violet", "pastel soft rainbow", "deep navy and gold", "warm rust and olive", "dreamy lavender and blush", "deep magenta electric violet and cyan neon", "hot pink and electric blue", "retrowave purple and orange", "seafoam teal and sunrise peach", "tropical aqua and hibiscus coral", "storm slate and deep ocean blue"],
  time_of_day: ["golden morning", "midday bright", "late afternoon", "dusk", "midnight", "blue hour", "early sunrise", "late evening"],
  weather_atmosphere: ["clear and still", "light rain with window drops", "humid golden haze", "cherry blossom wind", "soft snowfall", "golden dust particles", "warm lens flare", "soft morning fog", "overcast diffused", "sparkling bokeh particles in air"],
  body_type: ["slim and petite", "athletic and toned", "curvy and full-figured", "tall and lean", "soft and full", "slender with subtle curves", "compact and fit", "tall and curvaceous", "willowy and graceful", "petite with curves"],
  age_aesthetic: ["youthful soft features", "mature and elegant", "collegiate fresh-faced", "sophisticated late-twenties", "timeless ageless beauty", "soft girlish features", "refined and poised"],
  expression: ["soft warm smile", "melancholy distant look", "playful smirk", "surprised wide eyes", "sultry half-lidded gaze", "gentle shy glance downward", "confident direct stare", "joyful laughing", "pensive thoughtful look", "dreamy unfocused gaze", "bold fierce expression", "tender warm gaze"],
  makeup: ["natural no-makeup look", "soft glam with rosy tones", "bold red lip", "smoky eye with nude lip", "glossy dewy skin", "graphic liner with monochrome look", "monochromatic soft tones", "heavy lashes with soft blush", "bronzed sun-kissed glow", "sheer tinted lip gloss", "editorial bold eye", "fresh minimal tint"],
  hair_color: ["black", "dark brown", "soft brown", "charcoal black with subtle highlights", "dark gray", "black with dark blue tint", "warm brunette", "deep espresso", "dark auburn", "rich chestnut", "deep mahogany brown", "warm black with red undertones", "coily dark brown", "natural 4c black", "tight-curl espresso", "sun-kissed dark brown with caramel ends", "deep burgundy black", "blue-black", "dark olive brown", "warm umber"],
  hair_length: ["long flowing past shoulders", "very long to waist", "long layered", "shoulder length", "long with loose waves", "short natural afro", "medium length", "short cropped", "collarbone length", "big voluminous mid-length"],
  hair_style: ["loose and flowing", "softly wavy", "straight with wispy bangs", "parted side with face-framing layers", "half-up loose", "effortlessly disheveled", "sleek and straight", "tight natural coils", "voluminous curls", "soft afro puff", "box braids", "loose coily waves", "high puff with loose tendrils", "textured twist-out", "locs with loose ends", "big curly bangs", "kinky coils", "natural 4c with defined curls", "sporty high ponytail with flyaway strands"],
  eye_color: ["gray", "soft gray-green", "dark hazel", "warm brown", "steel blue-gray", "dark brown", "amber-brown", "deep dark brown", "rich warm brown", "honey brown", "golden hazel", "dark onyx", "warm hazel with gold flecks", "deep amber", "cool dark brown", "chestnut brown", "deep mahogany brown"],
  eye_style: ["heavy-lidded alluring gaze", "soft doe eyes", "sharp elegant eyes", "gentle expressive eyes", "sleepy seductive gaze", "bright clear eyes", "wide almond-shaped eyes", "deep-set soulful eyes", "monolid with soft liner", "large round expressive eyes", "narrow sultry almond eyes", "bold wide eyes with thick lashes", "deep hooded eyes", "bright upturned eyes", "warm low-set doe eyes", "richly lashed deep eyes"],
  face_shape: ["soft oval face", "heart-shaped face", "round full cheeks", "strong defined jawline", "delicate narrow chin", "broad high cheekbones", "angular elegant face", "soft square face", "wide prominent cheekbones", "gentle diamond face shape"],
  nose: ["small soft button nose", "broad flat nose with wide nostrils", "narrow straight nose", "slightly upturned nose", "strong prominent nose bridge", "wide rounded nose", "delicate tapered nose", "full-rounded nose tip", "high defined nose bridge", "soft medium nose"],
  lips: ["full plump lips", "thin elegant lips", "wide full lips with cupid's bow", "soft medium lips", "bold wide lips", "naturally defined lip line", "pouty lower lip", "softly parted full lips", "rich deep-toned full lips", "gentle small lips"],
  skin_tone: ["fair porcelain", "light warm ivory", "soft warm beige", "creamy peach-toned", "light tan", "warm golden brown", "deep warm brown", "rich dark brown", "deep ebony", "soft caramel", "sun-kissed medium brown", "warm tawny brown", "deep mahogany", "olive-toned medium", "warm sienna", "rich copper-toned", "deep mocha", "golden amber", "soft terracotta", "cool deep brown"],
  blush: ["subtle natural blush", "soft rosy cheeks", "light flushed cheeks", "no blush", "faint pink on nose and cheeks", "warm flush on deep brown skin", "golden-toned warmth on cheeks", "subtle bronzed glow on cheeks", "rich warm undertone blush", "deep rose on caramel skin", "soft peach flush on olive skin"],
  accessories: ["delicate star earrings", "small gold hoop earrings", "crystal drop earrings", "silver stud earrings", "dainty necklace", "layered gold jewelry", "hair clip", "sun hat", "no accessories", "large gold hoop earrings", "beaded jewelry", "cowrie shell earrings", "bold statement necklace", "wooden bead bracelet", "nose ring", "septum ring", "gold ear cuff", "silk head wrap", "beaded headband", "cultural hair beads", "ankara print headband", "layered chain necklace", "turquoise jewelry", "visor and sport sunglasses pushed up on head", "beach sandals set aside near the court line", "polished sunglasses and delicate layered jewelry"],
  outfit: ["oversized cream knit off-shoulder sweater, denim mini shorts", "white silk slip camisole, black lace underwear", "black spaghetti strap mini dress", "cream silk robe with lace trim, matching slip", "white sundress with thin straps", "cozy oversized cardigan over cami top, tiny shorts", "off-shoulder knit sweater dress", "white towel wrap", "casual black tank top, light-wash shorts", "elegant black bodycon dress", "loose white button-up shirt, underwear only", "colorful ankara print wrap dress", "kimono-style robe with floral sash", "cropped dashiki top, high-waisted linen shorts", "sari-inspired draped silk gown", "embroidered bohemian blouse, loose trousers", "cheongsam-inspired mini dress with side slit", "crochet crop top and wide-leg linen pants", "flowy off-shoulder maxi dress with tribal print", "vintage hanbok-inspired two-piece set", "strappy crop top, high-waisted batik skirt", "sheer caftan over swimsuit", "sporty crop hoodie, bike shorts", "sports bra and high-waisted leggings", "maid cafe uniform with apron", "school blazer with pleated mini skirt", "fantasy corset with lace-up boots", "oversized streetwear hoodie, cargo pants", "bikini top with sarong wrap", "festival crop top, high-waisted denim, body chains", "matching silk pajama set", "slip dress with sheer robe layered over", "traditional yukata with obi sash", "hanfu-inspired layered silk gown", "iridescent holographic crop jacket, high-waisted vinyl mini skirt, fishnet stockings, platform boots", "neon-trimmed bodysuit with sheer panels, thigh-high boots", "retro synthwave two-piece: cropped moto jacket, high-waisted shorts, leg warmers", "cyberpunk-lite mesh top with vinyl corset, micro skirt, chunky platform sneakers", "volleyball uniform jersey with fitted athletic shorts and knee pads", "tailored office blouse with pencil skirt and fitted blazer", "fitted pastel sports bikini top, high-waisted athletic bikini bottoms, lightweight cropped mesh cover-up", "competitive two-piece volleyball uniform with number-marked sports top, compression shorts, arm sleeve, taped fingers", "bright tropical sports bra, relaxed drawstring athletic shorts, open lightweight shirt, ankle wrap", "sleek designer-inspired volleyball set with elegant wrap skirt cover-up and subtle jewelry accents", "dark high-performance longline top, fitted athletic bottoms, windbreaker tied at the waist, supportive knee brace"],
  pose: ["sitting cross-legged looking at viewer with soft smile", "leaning forward resting on hands, gentle gaze", "sitting elegantly legs to side, holding coffee cup", "curled up on sofa reading a book", "kneeling looking up at viewer", "sitting by window gazing outside", "lying on bed propped on elbows", "standing touching hair with slight smile", "seated arms wrapped around knees", "standing confidently one hand on hip", "sitting on floor leaning against wall", "dancing with arms raised, joyful expression", "lying on back looking dreamily at ceiling", "crouching playfully with big smile", "standing arms crossed with bold expression", "stretching arms overhead, serene expression", "sitting sideways on chair looking over shoulder"],
  setting: ["luxurious bedroom with soft morning light, plants, large window", "cozy living room with warm lamp light, bookshelves", "modern penthouse with floor-to-ceiling city view at night", "bright sunlit room with white curtains and potted plants", "rainy window seat with bokeh city lights outside", "warm dimly lit bedroom, golden hour", "elegant vanity dressing room, perfume bottles", "minimalist white studio with natural diffused light", "cozy cafe corner seat, soft ambient lighting", "tropical beachside cabana, warm sunset light", "lush garden with soft dappled sunlight", "rooftop terrace overlooking a warm sunset cityscape", "colorful outdoor market with bokeh background", "cozy studio apartment with string lights and plants", "moonlit balcony overlooking ocean", "vibrant street scene with warm evening lantern light", "serene indoor pool with soft turquoise reflections", "neon-lit retro cityscape at night with glowing grid horizon and palm trees", "retrowave arcade with glowing screens and neon signs", "rooftop with synthwave sunset grid horizon and purple sky", "indoor volleyball gym sideline with polished wood court and net softly visible in the background", "indoor volleyball court with bleachers and clean team-media-day structure", "outdoor volleyball court at sunset with warm sand texture and cinematic depth", "modern office with large windows and softly blurred city exterior", "refined office desk workspace with laptop, notebook, and subtle work props", "modern conference room with glass walls and clean architectural lines", "early-morning beach volleyball court with calm ocean, clean sand, and pastel sky", "active beach tournament court with banners, taut nets, and a light crowd along the sideline", "palm-lined beach practice court near the shoreline with vivid tropical water", "luxury resort beach volleyball court with cabanas, umbrellas, and immaculate white sand", "dramatic cloudy beach court on a moody coastline with wind-swept wet sand"],
  lighting: ["soft golden hour warm light", "cool moonlit blue-white light", "warm lamp glow, dim ambient", "bright diffused natural daylight", "cinematic side lighting with soft shadows", "dreamy backlit glow from window", "rainy day soft flat lighting", "warm tropical sunset glow", "rich warm candlelight", "vibrant neon-tinged city night light", "soft dappled sunlight through trees", "cool blue twilight", "warm amber lantern light", "dramatic rim lighting on dark background", "soft overcast natural light", "bright directional gym lighting", "balanced athletic portrait lighting", "strong golden-hour sports separation", "natural window daylight with clean professional falloff", "soft directional office light", "neutral professional conference lighting", "soft sunrise sports glow with crisp ocean bounce light", "golden-hour tournament light with cinematic sidelight", "bright tropical noonday sun with reflective shoreline highlights", "refined resort daylight with polished editorial fill", "storm-front diffused light with dramatic coastal contrast"],
  mood: ["cozy and intimate", "elegant and serene", "dreamy and soft", "alluring and calm", "warm and comfortable", "quiet and contemplative", "soft and romantic", "bold and confident", "playful and joyful", "mysterious and sultry", "free-spirited and vibrant", "peaceful and grounded", "warm and radiant", "fierce and powerful", "gentle and nurturing", "focused athletic confidence", "team-media-day confidence", "golden-hour athletic ease", "polished executive confidence", "practical professional warmth", "credible leadership presence", "fresh energized athletic clarity", "focused high-stakes intensity", "fun casual beach confidence", "glamorous vacation-sport editorial", "dramatic powerful match tension"],
  anime_render_style: ["bishoujo key visual illustration", "shoujo manga illustration", "anime realism hybrid portrait", "cel-anime with painterly post-processing", "high-end visual novel CG illustration", "otome game promotional art", "modern anime poster art", "anime editorial fashion illustration", "90s retro anime cel look", "cinematic anime movie keyframe"],
  linework_style: ["ultra-clean lineart", "thin elegant shoujo linework", "variable-weight expressive ink lines", "soft sketch lines with refined contour", "bold graphic anime outlines", "delicate eyelashes and eye-line detail", "minimal linework with painted edges", "retro cel line contour"],
  shading_style: ["soft gradient cel shading", "multi-layer anime cel shading", "painterly skin blending with anime edges", "airbrushed highlights and rim light", "hard cel shadows with crisp separation", "diffused glow shading", "high-contrast dramatic anime shading", "watercolor-like soft anime shading"],
  anime_eye_render: ["large luminous bishoujo eyes with layered iris highlights", "sparkling shoujo eyes with star-like catchlights", "semi-realistic anime eyes with detailed limbal ring", "soft gradient anime irises with subtle reflections", "expressive manga-style eyes with glossy top highlight", "cinematic anime eyes with wet-line shine"],
  style_tags: ["semi-realistic anime", "painterly rendering", "high detail", "soft focus background", "cinematic composition", "warm color grading", "luminous skin", "ultra detailed hair", "8k quality", "studio lighting", "depth of field", "anime realism hybrid", "hyperdetailed", "soft bokeh", "film grain", "glamour photography style", "synthwave aesthetic", "retrowave neon glow", "bishoujo style", "chromatic aberration", "neon rim light", "vaporwave color grading", "80s retro anime influence", "shoujo manga sparkle", "clean lineart", "anime key visual", "expressive eye highlights", "otome game CG aesthetic", "cel-shaded finish", "illustration-grade detailing", "sports portrait editorial", "athlete media day polish", "business portrait polish", "executive portrait credibility", "corporate lifestyle portrait", "coastal athletic fashion", "beach volleyball premium look", "sun-kissed sports editorial", "resort sport-luxe styling", "stormy match drama"],
  negative_tags: ["3D render", "chibi", "deformed", "blurry face", "low quality", "bad anatomy", "bad hands", "extra fingers", "extra limbs", "asymmetrical eyes", "malformed face", "broken anatomy", "watermark", "text overlay"],
};

const ASPECT_RATIO_TO_ORIENTATION = {
  "9:16 vertical (portrait)": "portrait",
  "2:3 vertical (portrait)": "portrait",
  "3:4 vertical (portrait)": "portrait",
  "1:1 square": "square",
  "4:3 landscape": "landscape",
  "3:2 landscape": "landscape",
  "16:9 landscape (cinematic)": "landscape",
  "21:9 ultrawide (cinematic)": "landscape",
};

const PORTRAIT_PLATFORM_CONFIG = {
  "9:16 vertical (portrait)": {
    chatgptSize: "1024x1792",
    nanoAspectRatio: "9:16",
    nanoResolution: "1024x1792",
  },
  "2:3 vertical (portrait)": {
    chatgptSize: "1024x1536",
    nanoAspectRatio: "2:3",
    nanoResolution: "1024x1536",
  },
  "3:4 vertical (portrait)": {
    chatgptSize: "1024x1365",
    nanoAspectRatio: "3:4",
    nanoResolution: "1024x1365",
  },
  "1:1 square": {
    chatgptSize: "1024x1024",
    nanoAspectRatio: "1:1",
    nanoResolution: "1024x1024",
  },
  "4:3 landscape": {
    chatgptSize: "1536x1152",
    nanoAspectRatio: "4:3",
    nanoResolution: "1536x1152",
  },
  "3:2 landscape": {
    chatgptSize: "1536x1024",
    nanoAspectRatio: "3:2",
    nanoResolution: "1536x1024",
  },
  "16:9 landscape (cinematic)": {
    chatgptSize: "1792x1024",
    nanoAspectRatio: "16:9",
    nanoResolution: "1792x1024",
  },
  "21:9 ultrawide (cinematic)": {
    chatgptSize: "1792x1024",
    nanoAspectRatio: "21:9",
    nanoResolution: "1792x1024",
  },
};

const STYLE_PACKAGES = {
  bishoujo_key_visual: {
    anime_render_style: "bishoujo key visual illustration",
    linework_style: "thin elegant shoujo linework",
    shading_style: "soft gradient cel shading",
    anime_eye_render: "large luminous bishoujo eyes with layered iris highlights",
    style_tags: [
      "bishoujo style",
      "anime key visual",
      "clean lineart",
      "expressive eye highlights",
      "illustration-grade detailing",
    ],
    negative_tags: ["flat highlights", "lifeless eyes"],
  },
  shoujo_romance: {
    anime_render_style: "shoujo manga illustration",
    linework_style: "thin elegant shoujo linework",
    shading_style: "watercolor-like soft anime shading",
    anime_eye_render: "sparkling shoujo eyes with star-like catchlights",
    style_tags: [
      "shoujo manga sparkle",
      "soft bokeh",
      "clean lineart",
      "romantic color grading",
      "illustration-grade detailing",
    ],
    negative_tags: ["harsh shadows", "stiff expression"],
  },
  anime_realism_hybrid: {
    anime_render_style: "anime realism hybrid portrait",
    linework_style: "variable-weight expressive ink lines",
    shading_style: "painterly skin blending with anime edges",
    anime_eye_render: "semi-realistic anime eyes with detailed limbal ring",
    style_tags: [
      "anime realism hybrid",
      "high detail",
      "soft focus background",
      "luminous skin",
      "illustration-grade detailing",
    ],
    negative_tags: ["plastic skin", "muddy skin tones"],
  },
  sports_editorial_anime: {
    anime_render_style: "anime editorial fashion illustration",
    linework_style: "ultra-clean lineart",
    shading_style: "multi-layer anime cel shading",
    anime_eye_render: "cinematic anime eyes with wet-line shine",
    style_tags: [
      "sports portrait editorial",
      "athlete media day polish",
      "clean lineart",
      "depth of field",
      "illustration-grade detailing",
    ],
    negative_tags: ["warped sportswear", "awkward body proportions"],
  },
  executive_anime_portrait: {
    anime_render_style: "modern anime poster art",
    linework_style: "ultra-clean lineart",
    shading_style: "soft gradient cel shading",
    anime_eye_render: "semi-realistic anime eyes with detailed limbal ring",
    style_tags: [
      "business portrait polish",
      "executive portrait credibility",
      "clean lineart",
      "soft focus background",
      "illustration-grade detailing",
    ],
    negative_tags: ["distorted furniture", "bad perspective"],
  },
  synthwave_anime_portrait: {
    anime_render_style: "anime editorial fashion illustration",
    linework_style: "bold graphic anime outlines",
    shading_style: "high-contrast dramatic anime shading",
    anime_eye_render: "cinematic anime eyes with wet-line shine",
    style_tags: [
      "synthwave aesthetic",
      "retrowave neon glow",
      "chromatic aberration",
      "neon rim light",
      "illustration-grade detailing",
    ],
    negative_tags: ["muddy neon", "blown highlights", "unreadable glow"],
  },
};

const SCENARIO_BUNDLES = {
  cozy_indoor: {
    aspect_ratios: [
      "9:16 vertical (portrait)",
      "2:3 vertical (portrait)",
      "3:4 vertical (portrait)",
      "1:1 square",
    ],
    settings: ["cozy living room with warm lamp light, bookshelves"],
    lighting: ["warm lamp glow, dim ambient"],
    moods: ["cozy and intimate", "warm and comfortable"],
    time_of_day: ["late evening"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["warm amber and cream", "warm rust and olive"],
    outfit: [
      "oversized cream knit off-shoulder sweater, denim mini shorts",
      "cozy oversized cardigan over cami top, tiny shorts",
      "matching silk pajama set",
      "off-shoulder knit sweater dress",
    ],
    pose: [
      "curled up on sofa reading a book",
      "sitting cross-legged looking at viewer with soft smile",
      "seated arms wrapped around knees",
      "sitting by window gazing outside",
    ],
    accessories: ["no accessories", "small gold hoop earrings", "hair clip", "dainty necklace"],
    shot_type: ["close-up portrait", "medium portrait", "bust shot"],
    composition: ["tight crop with bokeh background", "foreground framing with depth", "centered symmetrical composition"],
    camera_lens: ["50mm natural lens", "85mm portrait lens"],
    expression: ["soft warm smile", "gentle shy glance downward", "tender warm gaze"],
    makeup: ["natural no-makeup look", "fresh minimal tint", "soft glam with rosy tones"],
    style_packages: ["anime_realism_hybrid", "bishoujo_key_visual"],
    scenario_tags: ["soft bokeh", "warm color grading", "luminous skin"],
    negative_tags: ["cluttered room", "distorted furniture"],
  },
  morning_light: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square"],
    settings: ["bright sunlit room with white curtains and potted plants"],
    lighting: ["bright diffused natural daylight", "dreamy backlit glow from window"],
    moods: ["warm and comfortable", "gentle and nurturing"],
    time_of_day: ["golden morning", "early sunrise"],
    weather_atmosphere: ["clear and still", "soft morning fog"],
    color_palette: ["soft pink and gold", "warm amber and cream"],
    outfit: [
      "loose white button-up shirt, underwear only",
      "white sundress with thin straps",
      "crochet crop top and wide-leg linen pants",
    ],
    pose: [
      "standing touching hair with slight smile",
      "leaning forward resting on hands, gentle gaze",
      "sitting by window gazing outside",
    ],
    accessories: ["small gold hoop earrings", "dainty necklace", "hair clip", "no accessories"],
    shot_type: ["close-up portrait", "medium portrait", "bust shot"],
    composition: ["subject fills frame", "negative space on one side", "tight crop with bokeh background"],
    camera_lens: ["50mm natural lens", "85mm portrait lens"],
    expression: ["soft warm smile", "dreamy unfocused gaze", "tender warm gaze"],
    makeup: ["fresh minimal tint", "glossy dewy skin", "natural no-makeup look"],
    style_packages: ["anime_realism_hybrid", "bishoujo_key_visual"],
    scenario_tags: ["soft focus background", "high detail", "luminous skin"],
    negative_tags: ["muddy daylight", "harsh underlighting"],
  },
  rainy_window_city: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square"],
    settings: ["rainy window seat with bokeh city lights outside"],
    lighting: ["rainy day soft flat lighting", "cool blue twilight"],
    moods: ["quiet and contemplative", "dreamy and soft"],
    time_of_day: ["blue hour", "late evening"],
    weather_atmosphere: ["light rain with window drops"],
    color_palette: ["moody desaturated", "deep navy and gold"],
    outfit: [
      "cozy oversized cardigan over cami top, tiny shorts",
      "oversized cream knit off-shoulder sweater, denim mini shorts",
      "matching silk pajama set",
    ],
    pose: [
      "sitting by window gazing outside",
      "sitting elegantly legs to side, holding coffee cup",
      "seated arms wrapped around knees",
    ],
    accessories: ["small gold hoop earrings", "dainty necklace", "no accessories"],
    shot_type: ["medium portrait", "bust shot", "close-up portrait"],
    composition: ["negative space on one side", "foreground framing with depth", "tight crop with bokeh background"],
    camera_lens: ["85mm portrait lens", "50mm natural lens", "long lens shallow depth of field"],
    expression: ["melancholy distant look", "pensive thoughtful look", "dreamy unfocused gaze"],
    makeup: ["fresh minimal tint", "monochromatic soft tones", "sheer tinted lip gloss"],
    style_packages: ["anime_realism_hybrid", "shoujo_romance"],
    scenario_tags: ["soft bokeh", "film grain", "cinematic composition"],
    negative_tags: ["muddy reflections", "warped window frame"],
  },
  golden_hour_romance: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square"],
    settings: [
      "luxurious bedroom with soft morning light, plants, large window",
      "lush garden with soft dappled sunlight",
      "rooftop terrace overlooking a warm sunset cityscape",
    ],
    lighting: ["soft golden hour warm light", "warm tropical sunset glow"],
    moods: ["soft and romantic", "warm and radiant", "dreamy and soft"],
    time_of_day: ["late afternoon", "dusk"],
    weather_atmosphere: ["golden dust particles", "warm lens flare"],
    color_palette: ["sunset orange and violet", "soft pink and gold"],
    outfit: [
      "cream silk robe with lace trim, matching slip",
      "slip dress with sheer robe layered over",
      "flowy off-shoulder maxi dress with tribal print",
      "white sundress with thin straps",
    ],
    pose: [
      "standing touching hair with slight smile",
      "sitting sideways on chair looking over shoulder",
      "leaning forward resting on hands, gentle gaze",
    ],
    accessories: ["crystal drop earrings", "dainty necklace", "layered gold jewelry"],
    shot_type: ["medium portrait", "3/4 body shot", "bust shot"],
    composition: ["rule of thirds", "tight crop with bokeh background", "silhouette against light source"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["soft warm smile", "tender warm gaze", "gentle shy glance downward"],
    makeup: ["soft glam with rosy tones", "glossy dewy skin", "sheer tinted lip gloss"],
    style_packages: ["bishoujo_key_visual", "shoujo_romance", "anime_realism_hybrid"],
    scenario_tags: ["warm color grading", "soft bokeh", "expressive eye highlights"],
    negative_tags: ["harsh midday shadows", "flat sunset glow"],
  },
  night_city: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square", "4:3 landscape"],
    settings: ["modern penthouse with floor-to-ceiling city view at night"],
    lighting: ["cool moonlit blue-white light"],
    moods: ["alluring and calm", "elegant and serene"],
    time_of_day: ["midnight", "blue hour"],
    weather_atmosphere: ["sparkling bokeh particles in air"],
    color_palette: ["deep navy and gold", "moody desaturated"],
    outfit: ["elegant black bodycon dress", "slip dress with sheer robe layered over", "black spaghetti strap mini dress"],
    pose: ["standing confidently one hand on hip", "sitting sideways on chair looking over shoulder", "standing touching hair with slight smile"],
    accessories: ["silver stud earrings", "layered gold jewelry", "dainty necklace"],
    shot_type: ["medium portrait", "3/4 body shot", "bust shot"],
    composition: ["negative space on one side", "subject fills frame", "foreground framing with depth"],
    camera_lens: ["85mm portrait lens", "long lens shallow depth of field"],
    expression: ["sultry half-lidded gaze", "confident direct stare", "dreamy unfocused gaze"],
    makeup: ["smoky eye with nude lip", "glossy dewy skin", "monochromatic soft tones"],
    style_packages: ["anime_realism_hybrid", "executive_anime_portrait"],
    scenario_tags: ["cinematic composition", "soft focus background", "high detail"],
    negative_tags: ["muddy skyline", "warped window reflections"],
  },
  synthwave_neon: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "1:1 square", "16:9 landscape (cinematic)"],
    settings: [
      "neon-lit retro cityscape at night with glowing grid horizon and palm trees",
      "retrowave arcade with glowing screens and neon signs",
      "rooftop with synthwave sunset grid horizon and purple sky",
    ],
    lighting: ["vibrant neon-tinged city night light"],
    moods: ["mysterious and sultry", "bold and confident"],
    time_of_day: ["midnight", "blue hour"],
    weather_atmosphere: ["sparkling bokeh particles in air"],
    color_palette: ["deep magenta electric violet and cyan neon", "retrowave purple and orange", "hot pink and electric blue"],
    outfit: [
      "iridescent holographic crop jacket, high-waisted vinyl mini skirt, fishnet stockings, platform boots",
      "neon-trimmed bodysuit with sheer panels, thigh-high boots",
      "retro synthwave two-piece: cropped moto jacket, high-waisted shorts, leg warmers",
      "cyberpunk-lite mesh top with vinyl corset, micro skirt, chunky platform sneakers",
    ],
    pose: [
      "standing confidently one hand on hip",
      "standing arms crossed with bold expression",
      "crouching playfully with big smile",
    ],
    accessories: ["large gold hoop earrings", "bold statement necklace", "septum ring", "gold ear cuff"],
    shot_type: ["3/4 body shot", "full body shot", "medium portrait"],
    composition: ["diagonal dynamic composition", "subject fills frame", "silhouette against light source"],
    camera_lens: ["35mm slight wide", "50mm natural lens", "wide-angle slight distortion"],
    expression: ["confident direct stare", "bold fierce expression", "playful smirk"],
    makeup: ["graphic liner with monochrome look", "editorial bold eye", "bold red lip"],
    style_packages: ["synthwave_anime_portrait"],
    scenario_tags: ["retrowave neon glow", "chromatic aberration", "neon rim light"],
    negative_tags: ["muddy neon", "blown highlights", "unreadable glow"],
  },
  volleyball_gym_sideline: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["indoor volleyball gym sideline with polished wood court and net softly visible in the background"],
    lighting: ["bright directional gym lighting"],
    moods: ["focused athletic confidence", "fierce and powerful"],
    time_of_day: ["midday bright"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["warm amber and cream", "cool blue and white"],
    outfit: [
      "volleyball uniform jersey with fitted athletic shorts and knee pads",
      "sports bra and high-waisted leggings",
      "sporty crop hoodie, bike shorts",
    ],
    pose: [
      "standing confidently one hand on hip",
      "standing arms crossed with bold expression",
      "stretching arms overhead, serene expression",
    ],
    accessories: ["no accessories", "hair clip", "small gold hoop earrings"],
    shot_type: ["medium portrait", "3/4 body shot"],
    composition: ["athlete portrait with shallow background separation", "rule of thirds"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["confident direct stare", "bold fierce expression", "soft warm smile"],
    makeup: ["fresh minimal tint", "bronzed sun-kissed glow", "natural no-makeup look"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["sports portrait editorial", "depth of field", "high detail"],
    negative_tags: ["distorted limbs", "warped sportswear", "broken knee pads", "awkward body proportions"],
  },
  volleyball_bleachers: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["indoor volleyball court with bleachers and clean team-media-day structure"],
    lighting: ["balanced athletic portrait lighting"],
    moods: ["team-media-day confidence", "bold and confident"],
    time_of_day: ["midday bright"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["cool blue and white", "deep navy and gold"],
    outfit: [
      "volleyball uniform jersey with fitted athletic shorts and knee pads",
      "sporty crop hoodie, bike shorts",
    ],
    pose: [
      "standing arms crossed with bold expression",
      "standing confidently one hand on hip",
      "crouching playfully with big smile",
    ],
    accessories: ["no accessories", "hair clip", "small gold hoop earrings"],
    shot_type: ["wide full body with environment", "3/4 body shot"],
    composition: ["balanced sports media-day portrait composition", "environmental context wide shot"],
    camera_lens: ["50mm natural lens", "35mm slight wide"],
    expression: ["confident direct stare", "joyful laughing", "bold fierce expression"],
    makeup: ["fresh minimal tint", "bronzed sun-kissed glow"],
    style_packages: ["sports_editorial_anime"],
    scenario_tags: ["athlete media day polish", "cinematic composition", "clean lineart"],
    negative_tags: ["distorted limbs", "warped sportswear", "awkward body proportions"],
  },
  volleyball_outdoor_sunset: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "16:9 landscape (cinematic)"],
    settings: ["outdoor volleyball court at sunset with warm sand texture and cinematic depth"],
    lighting: ["strong golden-hour sports separation"],
    moods: ["golden-hour athletic ease", "warm and radiant"],
    time_of_day: ["dusk", "late afternoon"],
    weather_atmosphere: ["warm lens flare", "clear and still"],
    color_palette: ["sunset orange and violet", "warm amber and cream"],
    outfit: [
      "volleyball uniform jersey with fitted athletic shorts and knee pads",
      "sports bra and high-waisted leggings",
    ],
    pose: [
      "standing confidently one hand on hip",
      "stretching arms overhead, serene expression",
      "standing touching hair with slight smile",
    ],
    accessories: ["no accessories", "small gold hoop earrings", "hair clip"],
    shot_type: ["3/4 body shot", "medium portrait", "wide full body with environment"],
    composition: ["cinematic golden-hour sports lifestyle portrait", "rule of thirds"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["confident direct stare", "soft warm smile", "tender warm gaze"],
    makeup: ["bronzed sun-kissed glow", "fresh minimal tint"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["warm color grading", "sports portrait editorial", "soft bokeh"],
    negative_tags: ["distorted limbs", "warped sportswear", "broken knee pads"],
  },
  beach_volleyball_sunrise_court: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "16:9 landscape (cinematic)"],
    settings: ["early-morning beach volleyball court with calm ocean, clean sand, and pastel sky"],
    lighting: ["soft sunrise sports glow with crisp ocean bounce light"],
    moods: ["fresh energized athletic clarity", "peaceful and grounded"],
    time_of_day: ["early sunrise"],
    weather_atmosphere: ["clear and still", "soft morning fog"],
    color_palette: ["seafoam teal and sunrise peach", "cool blue and white"],
    outfit: [
      "fitted pastel sports bikini top, high-waisted athletic bikini bottoms, lightweight cropped mesh cover-up",
      "bright tropical sports bra, relaxed drawstring athletic shorts, open lightweight shirt, ankle wrap",
    ],
    pose: [
      "stretching arms overhead, serene expression",
      "standing confidently one hand on hip",
      "standing touching hair with slight smile",
    ],
    accessories: ["visor and sport sunglasses pushed up on head", "no accessories"],
    shot_type: ["3/4 body shot", "medium portrait"],
    composition: ["athlete portrait with shallow background separation", "rule of thirds"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["confident direct stare", "soft warm smile", "tender warm gaze"],
    makeup: ["fresh minimal tint", "bronzed sun-kissed glow", "natural no-makeup look"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["coastal athletic fashion", "beach volleyball premium look", "clean lineart"],
    negative_tags: ["warped sportswear", "awkward body proportions", "muddy shoreline"],
  },
  beach_volleyball_golden_hour_tournament: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "16:9 landscape (cinematic)"],
    settings: ["active beach tournament court with banners, taut nets, and a light crowd along the sideline"],
    lighting: ["golden-hour tournament light with cinematic sidelight"],
    moods: ["focused high-stakes intensity", "fierce and powerful"],
    time_of_day: ["dusk", "late afternoon"],
    weather_atmosphere: ["warm lens flare", "clear and still"],
    color_palette: ["sunset orange and violet", "warm amber and cream"],
    outfit: [
      "competitive two-piece volleyball uniform with number-marked sports top, compression shorts, arm sleeve, taped fingers",
      "volleyball uniform jersey with fitted athletic shorts and knee pads",
    ],
    pose: [
      "standing arms crossed with bold expression",
      "stretching arms overhead, serene expression",
      "standing confidently one hand on hip",
    ],
    accessories: ["no accessories", "visor and sport sunglasses pushed up on head"],
    shot_type: ["full body shot", "3/4 body shot"],
    composition: ["cinematic golden-hour sports lifestyle portrait", "diagonal dynamic composition"],
    camera_lens: ["50mm natural lens", "85mm portrait lens"],
    expression: ["confident direct stare", "bold fierce expression"],
    makeup: ["fresh minimal tint", "bronzed sun-kissed glow"],
    hair_style: ["sporty high ponytail with flyaway strands"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["athlete media day polish", "beach volleyball premium look", "cinematic composition"],
    negative_tags: ["warped sportswear", "awkward body proportions", "crooked net lines"],
  },
  beach_volleyball_tropical_practice: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "16:9 landscape (cinematic)"],
    settings: ["palm-lined beach practice court near the shoreline with vivid tropical water"],
    lighting: ["bright tropical noonday sun with reflective shoreline highlights"],
    moods: ["fun casual beach confidence", "free-spirited and vibrant"],
    time_of_day: ["midday bright"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["tropical aqua and hibiscus coral", "seafoam teal and sunrise peach"],
    outfit: [
      "bright tropical sports bra, relaxed drawstring athletic shorts, open lightweight shirt, ankle wrap",
      "fitted pastel sports bikini top, high-waisted athletic bikini bottoms, lightweight cropped mesh cover-up",
    ],
    pose: [
      "standing touching hair with slight smile",
      "crouching playfully with big smile",
      "standing confidently one hand on hip",
    ],
    accessories: ["beach sandals set aside near the court line", "visor and sport sunglasses pushed up on head", "no accessories"],
    shot_type: ["wide full body with environment", "3/4 body shot"],
    composition: ["environmental context wide shot", "rule of thirds"],
    camera_lens: ["35mm slight wide", "50mm natural lens"],
    expression: ["joyful laughing", "playful smirk", "soft warm smile"],
    makeup: ["fresh minimal tint", "bronzed sun-kissed glow"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["sun-kissed sports editorial", "coastal athletic fashion", "beach volleyball premium look"],
    negative_tags: ["muddy shoreline", "warped sportswear", "awkward body proportions"],
  },
  beach_volleyball_luxury_resort: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["luxury resort beach volleyball court with cabanas, umbrellas, and immaculate white sand"],
    lighting: ["refined resort daylight with polished editorial fill"],
    moods: ["glamorous vacation-sport editorial", "warm and radiant"],
    time_of_day: ["late afternoon"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["cool blue and white", "seafoam teal and sunrise peach"],
    outfit: [
      "sleek designer-inspired volleyball set with elegant wrap skirt cover-up and subtle jewelry accents",
      "fitted pastel sports bikini top, high-waisted athletic bikini bottoms, lightweight cropped mesh cover-up",
    ],
    pose: [
      "standing touching hair with slight smile",
      "standing confidently one hand on hip",
      "sitting sideways on chair looking over shoulder",
    ],
    accessories: ["polished sunglasses and delicate layered jewelry", "layered gold jewelry"],
    shot_type: ["medium portrait", "3/4 body shot"],
    composition: ["rule of thirds", "tight crop with bokeh background"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["confident direct stare", "tender warm gaze", "soft warm smile"],
    makeup: ["soft glam with rosy tones", "glossy dewy skin", "bronzed sun-kissed glow"],
    style_packages: ["anime_realism_hybrid", "sports_editorial_anime"],
    scenario_tags: ["resort sport-luxe styling", "beach volleyball premium look", "soft bokeh"],
    negative_tags: ["muddy shoreline", "distorted furniture", "warped sportswear"],
  },
  beach_volleyball_stormy_coast_match: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "16:9 landscape (cinematic)"],
    settings: ["dramatic cloudy beach court on a moody coastline with wind-swept wet sand"],
    lighting: ["storm-front diffused light with dramatic coastal contrast"],
    moods: ["dramatic powerful match tension", "fierce and powerful"],
    time_of_day: ["late afternoon"],
    weather_atmosphere: ["overcast diffused"],
    color_palette: ["storm slate and deep ocean blue", "cool blue and white"],
    outfit: [
      "dark high-performance longline top, fitted athletic bottoms, windbreaker tied at the waist, supportive knee brace",
      "competitive two-piece volleyball uniform with number-marked sports top, compression shorts, arm sleeve, taped fingers",
    ],
    pose: [
      "standing arms crossed with bold expression",
      "stretching arms overhead, serene expression",
      "standing confidently one hand on hip",
    ],
    accessories: ["no accessories", "visor and sport sunglasses pushed up on head"],
    shot_type: ["3/4 body shot", "full body shot"],
    composition: ["diagonal dynamic composition", "cinematic golden-hour sports lifestyle portrait"],
    camera_lens: ["long lens shallow depth of field", "50mm natural lens"],
    expression: ["bold fierce expression", "confident direct stare"],
    makeup: ["fresh minimal tint", "natural no-makeup look"],
    style_packages: ["sports_editorial_anime", "anime_realism_hybrid"],
    scenario_tags: ["stormy match drama", "coastal athletic fashion", "cinematic composition"],
    negative_tags: ["warped sportswear", "awkward body proportions", "crooked net lines"],
  },
  office_modern_window: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["modern office with large windows and softly blurred city exterior"],
    lighting: ["natural window daylight with clean professional falloff"],
    moods: ["polished executive confidence", "elegant and serene"],
    time_of_day: ["midday bright", "late afternoon"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["cool blue and white", "deep navy and gold"],
    outfit: [
      "tailored office blouse with pencil skirt and fitted blazer",
      "elegant black bodycon dress",
    ],
    pose: [
      "standing confidently one hand on hip",
      "standing arms crossed with bold expression",
      "sitting sideways on chair looking over shoulder",
    ],
    accessories: ["silver stud earrings", "dainty necklace", "layered gold jewelry", "no accessories"],
    shot_type: ["medium portrait", "3/4 body shot", "bust shot"],
    composition: ["clean executive portrait composition", "negative space on one side"],
    camera_lens: ["85mm portrait lens", "50mm natural lens"],
    expression: ["confident direct stare", "tender warm gaze", "pensive thoughtful look"],
    makeup: ["fresh minimal tint", "soft glam with rosy tones", "glossy dewy skin"],
    style_packages: ["executive_anime_portrait", "anime_realism_hybrid"],
    scenario_tags: ["business portrait polish", "executive portrait credibility", "soft focus background"],
    negative_tags: ["cluttered desk", "distorted furniture", "bad perspective"],
  },
  office_desk_workspace: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["refined office desk workspace with laptop, notebook, and subtle work props"],
    lighting: ["soft directional office light"],
    moods: ["practical professional warmth", "polished executive confidence"],
    time_of_day: ["late afternoon", "midday bright"],
    weather_atmosphere: ["clear and still"],
    color_palette: ["warm amber and cream", "deep navy and gold"],
    outfit: [
      "tailored office blouse with pencil skirt and fitted blazer",
      "embroidered bohemian blouse, loose trousers",
    ],
    pose: [
      "sitting elegantly legs to side, holding coffee cup",
      "sitting sideways on chair looking over shoulder",
      "standing touching hair with slight smile",
    ],
    accessories: ["silver stud earrings", "dainty necklace", "small gold hoop earrings", "no accessories"],
    shot_type: ["medium portrait", "3/4 body shot"],
    composition: ["uncluttered desk-side professional portrait", "foreground framing with depth"],
    camera_lens: ["50mm natural lens", "85mm portrait lens"],
    expression: ["soft warm smile", "confident direct stare", "pensive thoughtful look"],
    makeup: ["fresh minimal tint", "soft glam with rosy tones"],
    style_packages: ["executive_anime_portrait", "anime_realism_hybrid"],
    scenario_tags: ["corporate lifestyle portrait", "business portrait polish", "high detail"],
    negative_tags: ["cluttered desk", "distorted furniture", "bad perspective"],
  },
  office_conference_room: {
    aspect_ratios: ["9:16 vertical (portrait)", "2:3 vertical (portrait)", "3:4 vertical (portrait)", "4:3 landscape"],
    settings: ["modern conference room with glass walls and clean architectural lines"],
    lighting: ["neutral professional conference lighting"],
    moods: ["credible leadership presence", "bold and confident"],
    time_of_day: ["midday bright"],
    weather_atmosphere: ["overcast diffused", "clear and still"],
    color_palette: ["deep navy and gold", "cool blue and white"],
    outfit: [
      "tailored office blouse with pencil skirt and fitted blazer",
      "elegant black bodycon dress",
    ],
    pose: [
      "standing arms crossed with bold expression",
      "standing confidently one hand on hip",
      "sitting sideways on chair looking over shoulder",
    ],
    accessories: ["silver stud earrings", "dainty necklace", "no accessories"],
    shot_type: ["medium portrait", "3/4 body shot", "bust shot"],
    composition: ["architectural leadership portrait composition", "centered symmetrical composition"],
    camera_lens: ["50mm natural lens", "85mm portrait lens"],
    expression: ["confident direct stare", "bold fierce expression", "tender warm gaze"],
    makeup: ["fresh minimal tint", "soft glam with rosy tones", "glossy dewy skin"],
    style_packages: ["executive_anime_portrait"],
    scenario_tags: ["executive portrait credibility", "business portrait polish", "clean lineart"],
    negative_tags: ["distorted furniture", "bad perspective", "crooked architectural lines"],
  },
};

const DEFAULT_SCENARIO_IDS = Object.keys(SCENARIO_BUNDLES);

function uniqueList(items, limit = items.length) {
  return [...new Set(items.filter(Boolean))].slice(0, limit);
}

function pickFrom(pool, fallback = []) {
  const source = pool?.length ? pool : fallback;
  return rand(source);
}

function resolveStylePackage(stylePackageId, scenario) {
  const selectedId =
    stylePackageId && STYLE_PACKAGES[stylePackageId]
      ? stylePackageId
      : pickFrom(scenario.style_packages, Object.keys(STYLE_PACKAGES));

  return { id: selectedId, config: STYLE_PACKAGES[selectedId] };
}

function resolveScenario(overrides = {}) {
  const scenarioId =
    overrides.scenario && SCENARIO_BUNDLES[overrides.scenario]
      ? overrides.scenario
      : pickFrom(DEFAULT_SCENARIO_IDS, DEFAULT_SCENARIO_IDS);
  return { id: scenarioId, config: SCENARIO_BUNDLES[scenarioId] };
}

function resolveOrientation(aspectRatio) {
  return ASPECT_RATIO_TO_ORIENTATION[aspectRatio] || "portrait";
}

function resolvePortraitPlatformConfig(aspectRatio) {
  return (
    PORTRAIT_PLATFORM_CONFIG[aspectRatio] || {
      chatgptSize: "1024x1024",
      nanoAspectRatio: "1:1",
      nanoResolution: "1024x1024",
    }
  );
}

function humanizeId(value = "") {
  return value
    .split("_")
    .filter(Boolean)
    .map((token) => token[0].toUpperCase() + token.slice(1))
    .join(" ");
}

function joinNatural(parts, joiner = ", ") {
  return parts.filter(Boolean).join(joiner);
}

function buildScenarioAwareTags(overrides, scenario, stylePackage) {
  if (overrides.style_tags) {
    return overrides.style_tags;
  }

  const tags = uniqueList(
    [
      ...randMulti(stylePackage.style_tags, 2, 3),
      ...randMulti(scenario.scenario_tags, 1, 2),
    ],
    5,
  );

  if (tags.length >= 3) {
    return tags;
  }

  return uniqueList([...tags, ...stylePackage.style_tags, ...scenario.scenario_tags], 5);
}

function buildScenarioAwareNegatives(overrides, scenario, stylePackage) {
  if (overrides.negative_tags) {
    return overrides.negative_tags;
  }

  return uniqueList(
    [
      ...DATA.negative_tags,
      ...stylePackage.negative_tags,
      ...scenario.negative_tags,
    ],
    16,
  );
}

export function getOrientationForAspectRatio(aspectRatio) {
  return resolveOrientation(aspectRatio);
}

function buildPortraitNegativePrompt(prompt) {
  return uniqueList(prompt.negative_tags, 14).join(", ");
}

function buildPortraitRegularPrompt(prompt) {
  return `Create a premium anime portrait in ${prompt.aspect_ratio} with a ${prompt.shot_type} and ${prompt.composition}, framed through a ${prompt.camera_lens}. The subject should feel ${prompt.age_aesthetic} with a ${prompt.body_type} presence, wearing ${prompt.outfit} with ${prompt.accessories}, posed ${prompt.pose}. Give her ${prompt.expression}, ${prompt.makeup}, ${prompt.face_shape}, ${prompt.nose}, ${prompt.lips}, ${prompt.eye_color} eyes with ${prompt.eye_style}, ${prompt.hair_color} hair that is ${prompt.hair_length} and ${prompt.hair_style}, plus ${prompt.skin_tone} skin with ${prompt.blush}. Place her in ${prompt.setting}, lit by ${prompt.lighting} during ${prompt.time_of_day} with ${prompt.weather_atmosphere}, carrying a ${prompt.mood} mood and a ${prompt.color_palette} color script. Render it as ${prompt.anime_render_style} with ${prompt.linework_style}, ${prompt.shading_style}, and ${prompt.anime_eye_render}. Finish with ${prompt.style_tags.join(", ")}.`;
}

function buildPortraitChatGptPrompt(prompt) {
  return `Create a polished anime portrait illustration. Use a ${prompt.aspect_ratio} canvas with ${prompt.orientation} orientation, a ${prompt.shot_type}, ${prompt.composition}, and a ${prompt.camera_lens}. Design the subject as ${prompt.age_aesthetic} with a ${prompt.body_type} build. Face and expression: ${joinNatural([prompt.expression, prompt.makeup, prompt.face_shape, prompt.nose, prompt.lips])}. Hair, eyes, and complexion: ${joinNatural([`${prompt.hair_color} hair`, prompt.hair_length, prompt.hair_style, `${prompt.eye_color} eyes`, prompt.eye_style, `${prompt.skin_tone} skin`, prompt.blush])}. Wardrobe and styling: ${prompt.outfit}, ${prompt.accessories}. Pose: ${prompt.pose}. Environment: ${prompt.setting}. Light the scene with ${prompt.lighting} at ${prompt.time_of_day}, with ${prompt.weather_atmosphere}, a ${prompt.mood} mood, and a ${prompt.color_palette} palette. Render in ${joinNatural([prompt.anime_render_style, prompt.linework_style, prompt.shading_style, prompt.anime_eye_render])}. Keep the final image coherent, commercial, and premium, with ${prompt.style_tags.join(", ")}. Exclude text, watermarking, malformed anatomy, and broken hands.`;
}

function buildPortraitNanoPrompt(prompt) {
  return `Format: ${prompt.aspect_ratio}; ${prompt.orientation} orientation; ${prompt.shot_type}; ${prompt.composition}; lens ${prompt.camera_lens}. Subject: ${prompt.age_aesthetic}, ${prompt.body_type}, ${prompt.expression}. Face: ${prompt.face_shape}; ${prompt.nose}; ${prompt.lips}; ${prompt.eye_color} eyes; ${prompt.eye_style}. Hair and skin: ${prompt.hair_color}; ${prompt.hair_length}; ${prompt.hair_style}; ${prompt.skin_tone}; ${prompt.blush}. Wardrobe: ${prompt.outfit}. Accessories: ${prompt.accessories}. Pose: ${prompt.pose}. Scene: ${prompt.setting}. Light and atmosphere: ${prompt.lighting}; ${prompt.time_of_day}; ${prompt.weather_atmosphere}; ${prompt.mood}; ${prompt.color_palette}. Render: ${prompt.anime_render_style}; ${prompt.linework_style}; ${prompt.shading_style}; ${prompt.anime_eye_render}. Tags: ${prompt.style_tags.join(", ")}.`;
}

function buildPortraitSummary(prompt) {
  return {
    scenario: prompt.scenario_id,
    style_package: prompt.style_package_id,
    aspect_ratio: prompt.aspect_ratio,
    orientation: prompt.orientation,
    shot_type: prompt.shot_type,
    composition: prompt.composition,
    camera_lens: prompt.camera_lens,
    setting: prompt.setting,
    lighting: prompt.lighting,
    mood: prompt.mood,
    outfit: prompt.outfit,
    pose: prompt.pose,
    style_tags: prompt.style_tags,
  };
}

function decoratePortraitPrompt(prompt) {
  const platformConfig = resolvePortraitPlatformConfig(prompt.aspect_ratio);
  const regularPrompt = buildPortraitRegularPrompt(prompt);
  const chatgptPrompt = buildPortraitChatGptPrompt(prompt);
  const nanoPrompt = buildPortraitNanoPrompt(prompt);
  const negativePrompt = buildPortraitNegativePrompt(prompt);
  const summary = buildPortraitSummary(prompt);
  const chatgptCombined = `${chatgptPrompt}\n\nNegative prompt: ${negativePrompt}`;
  const nanoCombined = `${nanoPrompt}\n\nNegative prompt: ${negativePrompt}`;

  return {
    ...prompt,
    regularPrompt,
    chatgptPrompt,
    nanoPrompt,
    negativePrompt,
    combinedPrompt: `${regularPrompt}\n\nNegative prompt: ${negativePrompt}`,
    chatGPT: {
      model: "gpt-4o",
      prompt: {
        regular: regularPrompt,
        optimized: chatgptPrompt,
        negative: negativePrompt,
        combined: chatgptCombined,
      },
      messages: [
        {
          role: "system",
          content:
            "You generate polished anime portrait illustrations with strong composition, attractive facial rendering, coherent wardrobe styling, and no text or watermarks.",
        },
        { role: "user", content: chatgptCombined },
      ],
      image_generation: {
        size: platformConfig.chatgptSize,
        quality: "hd",
        style: prompt.style_package_id === "synthwave_anime_portrait" ? "vivid" : "natural",
        n: 1,
      },
      slot_summary: summary,
    },
    nanoBanana: {
      platform: "Nano Banana",
      prompt: {
        regular: regularPrompt,
        positive: nanoPrompt,
        negative: negativePrompt,
        combined: nanoCombined,
      },
      parameters: {
        aspect_ratio: platformConfig.nanoAspectRatio,
        resolution: platformConfig.nanoResolution,
        quality: "high",
        style_strength: 0.82,
        no_text: true,
        no_watermark: true,
      },
      slot_summary: summary,
    },
  };
}

export function buildPromptOutputs(prompt) {
  return decoratePortraitPrompt(prompt);
}

export const MOODS = {
  "Cozy Indoor": { scenario: "cozy_indoor" },
  "Morning Light": { scenario: "morning_light" },
  "Night City": { scenario: "night_city" },
  "Rainy Day": { scenario: "rainy_window_city" },
  "Golden Hour": { scenario: "golden_hour_romance" },
  "Volleyball Gym Sideline": { scenario: "volleyball_gym_sideline" },
  "Volleyball Bleachers": { scenario: "volleyball_bleachers" },
  "Volleyball Outdoor Sunset": { scenario: "volleyball_outdoor_sunset" },
  "Beach Volleyball Sunrise Court": { scenario: "beach_volleyball_sunrise_court" },
  "Beach Volleyball Golden Hour Tournament": { scenario: "beach_volleyball_golden_hour_tournament" },
  "Beach Volleyball Tropical Practice": { scenario: "beach_volleyball_tropical_practice" },
  "Beach Volleyball Luxury Resort": { scenario: "beach_volleyball_luxury_resort" },
  "Beach Volleyball Stormy Coast Match": { scenario: "beach_volleyball_stormy_coast_match" },
  "Office Modern Window": { scenario: "office_modern_window" },
  "Office Desk Workspace": { scenario: "office_desk_workspace" },
  "Office Conference Room": { scenario: "office_conference_room" },
  Synthwave: { scenario: "synthwave_neon" },
  "Bishoujo Key Visual": { scenario: "golden_hour_romance", style_package: "bishoujo_key_visual" },
  "Shoujo Romance": { scenario: "golden_hour_romance", style_package: "shoujo_romance", weather_atmosphere: "cherry blossom wind" },
};

export const FIELD_LABELS = {
  aspect_ratio: "Aspect Ratio",
  orientation: "Orientation",
  shot_type: "Shot Type",
  composition: "Composition",
  camera_lens: "Camera / Lens",
  color_palette: "Color Palette",
  time_of_day: "Time of Day",
  weather_atmosphere: "Weather / Atmosphere",
  anime_render_style: "Anime Render",
  linework_style: "Linework",
  shading_style: "Shading",
  anime_eye_render: "Eye Rendering",
  body_type: "Body Type",
  age_aesthetic: "Age Aesthetic",
  expression: "Expression",
  makeup: "Makeup",
  hair_color: "Hair Color",
  hair_length: "Hair Length",
  hair_style: "Hair Style",
  eye_color: "Eye Color",
  eye_style: "Eye Style",
  face_shape: "Face Shape",
  nose: "Nose",
  lips: "Lips",
  skin_tone: "Skin Tone",
  blush: "Blush",
  accessories: "Accessories",
  outfit: "Outfit",
  pose: "Pose",
  setting: "Setting",
  lighting: "Lighting",
  mood: "Mood",
  style_tags: "Style Tags",
  negative_tags: "Negative Tags",
};

export const FIELD_GROUPS = [
  { label: "Composition & Camera", fields: ["aspect_ratio", "orientation", "shot_type", "composition", "camera_lens"] },
  { label: "Color & Atmosphere", fields: ["color_palette", "time_of_day", "weather_atmosphere", "lighting", "mood"] },
  { label: "Anime Rendering", fields: ["anime_render_style", "linework_style", "shading_style", "anime_eye_render"] },
  { label: "Character", fields: ["body_type", "age_aesthetic", "expression", "makeup", "skin_tone", "blush"] },
  { label: "Hair", fields: ["hair_color", "hair_length", "hair_style"] },
  { label: "Face", fields: ["eye_color", "eye_style", "face_shape", "nose", "lips"] },
  { label: "Style", fields: ["outfit", "accessories", "pose", "setting"] },
  { label: "Prompt Tags", fields: ["style_tags", "negative_tags"] },
];

export const generatePrompt = (overrides = {}) => {
  const { id: scenarioId, config: scenario } = resolveScenario(overrides);
  const { id: stylePackageId, config: stylePackage } = resolveStylePackage(
    overrides.style_package,
    scenario,
  );
  const aspectRatio =
    overrides.aspect_ratio ??
    pickFrom(scenario.aspect_ratios, DATA.aspect_ratio);

  return decoratePortraitPrompt({
    scenario_id: scenarioId,
    scenario_label: humanizeId(scenarioId),
    style_package_id: stylePackageId,
    style_package_label: humanizeId(stylePackageId),
    aspect_ratio: aspectRatio,
    orientation: resolveOrientation(aspectRatio),
    shot_type: overrides.shot_type ?? pickFrom(scenario.shot_type, DATA.shot_type),
    composition: overrides.composition ?? pickFrom(scenario.composition, DATA.composition),
    camera_lens: overrides.camera_lens ?? pickFrom(scenario.camera_lens, DATA.camera_lens),
    color_palette: overrides.color_palette ?? pickFrom(scenario.color_palette, DATA.color_palette),
    time_of_day: overrides.time_of_day ?? pickFrom(scenario.time_of_day, DATA.time_of_day),
    weather_atmosphere:
      overrides.weather_atmosphere ??
      pickFrom(scenario.weather_atmosphere, DATA.weather_atmosphere),
    anime_render_style: overrides.anime_render_style ?? stylePackage.anime_render_style,
    linework_style: overrides.linework_style ?? stylePackage.linework_style,
    shading_style: overrides.shading_style ?? stylePackage.shading_style,
    anime_eye_render: overrides.anime_eye_render ?? stylePackage.anime_eye_render,
    body_type: overrides.body_type ?? rand(DATA.body_type),
    age_aesthetic: overrides.age_aesthetic ?? rand(DATA.age_aesthetic),
    expression: overrides.expression ?? pickFrom(scenario.expression, DATA.expression),
    makeup: overrides.makeup ?? pickFrom(scenario.makeup, DATA.makeup),
    hair_color: overrides.hair_color ?? rand(DATA.hair_color),
    hair_length: overrides.hair_length ?? rand(DATA.hair_length),
    hair_style: overrides.hair_style ?? pickFrom(scenario.hair_style, DATA.hair_style),
    eye_color: overrides.eye_color ?? rand(DATA.eye_color),
    eye_style: overrides.eye_style ?? rand(DATA.eye_style),
    face_shape: overrides.face_shape ?? rand(DATA.face_shape),
    nose: overrides.nose ?? rand(DATA.nose),
    lips: overrides.lips ?? rand(DATA.lips),
    skin_tone: overrides.skin_tone ?? rand(DATA.skin_tone),
    blush: overrides.blush ?? rand(DATA.blush),
    accessories: overrides.accessories ?? pickFrom(scenario.accessories, DATA.accessories),
    outfit: overrides.outfit ?? pickFrom(scenario.outfit, DATA.outfit),
    pose: overrides.pose ?? pickFrom(scenario.pose, DATA.pose),
    setting: overrides.setting ?? pickFrom(scenario.settings, DATA.setting),
    lighting: overrides.lighting ?? pickFrom(scenario.lighting, DATA.lighting),
    mood: overrides.mood ?? pickFrom(scenario.moods, DATA.mood),
    style_tags: buildScenarioAwareTags(overrides, scenario, stylePackage),
    negative_tags: buildScenarioAwareNegatives(overrides, scenario, stylePackage),
  });
};

export const buildPromptString = (prompt) => buildPortraitRegularPrompt(prompt);
