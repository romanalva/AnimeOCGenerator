import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { downloadBlob, writeToClipboard } from "./browserUtils";
import { ControlsPanel } from "./ControlsPanel";
import { HeaderPanel } from "./HeaderPanel";
import { HistoryPanel } from "./HistoryPanel";
import { OutputCard } from "./OutputCard";
import { SlotCard } from "./SlotCard";
import {
  COLOR_PALETTES,
  COMPOSITIONS,
  DEFAULT_NEG_TERMS,
  DEPTHS,
  FOREGROUNDS,
  LANE_SUPPORT_POOLS,
  LANE_NAMES,
  LANES,
  RATIO_INFO,
  SEASONS,
  SOUND_REFS,
  TEXTURES,
  TIMES_OF_DAY,
  VIEWPOINTS,
} from "./data";
import { buildResult, buildResultFromSlots, pick, pickN } from "./helpers";
const PortraitGenerator = lazy(() =>
  import("./PortraitGenerator").then((module) => ({
    default: module.PortraitGenerator,
  })),
);

export default function App() {
  const [generatorMode, setGeneratorMode] = useState("environment");
  const [activeLane, setActiveLane] = useState("Sunset Pulse");
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [liveSlots, setLiveSlots] = useState(null);
  const [tab, setTab] = useState("combined");
  const [copied, setCopied] = useState(false);
  const [copyAllDone, setCopyAllDone] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [novaSol, setNovaSol] = useState(false);
  const [outputMode, setOutputMode] = useState("single");
  const [collTheme, setCollTheme] = useState("");
  const [collection, setCollection] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [locks, setLocks] = useState({});
  const [pinnedRatio, setPinnedRatio] = useState(null);
  const [showNegEditor, setShowNegEditor] = useState(false);
  const [negTerms, setNegTerms] = useState([...DEFAULT_NEG_TERMS]);
  const [customNegInput, setCustomNegInput] = useState("");
  const [versionLog, setVersionLog] = useState({});
  const [logInput, setLogInput] = useState("");
  const ticker = useRef(null);

  const staticSlotSources = useMemo(
    () => ({
      viewpoints: VIEWPOINTS,
      timesOfDay: TIMES_OF_DAY,
      seasons: SEASONS,
      palettes: COLOR_PALETTES,
      compositions: COMPOSITIONS,
      textures: TEXTURES,
      depths: DEPTHS,
      soundRefs: SOUND_REFS,
      foregrounds: FOREGROUNDS,
    }),
    [],
  );
  const activeNegTerms = useMemo(() => negTerms.filter(Boolean), [negTerms]);
  const displayLane = result?.lane || activeLane;
  const laneConfig = LANES[displayLane];
  const accentColor = laneConfig.color;
  const laneSupportPools = LANE_SUPPORT_POOLS[displayLane] || {};

  const buildSlotsResult = useCallback(
    (lane, inputLocks = {}, overrides = {}) =>
      buildResult(
        lane,
        {
          ...staticSlotSources,
          locks: inputLocks,
          overrides,
        },
        activeNegTerms,
      ),
    [activeNegTerms, staticSlotSources],
  );

  const rebuildFromCurrentSlots = useCallback(
    (lane, slotValues) =>
      buildResultFromSlots(
        lane,
        {
          ...slotValues,
          novaSol,
          collTheme,
        },
        activeNegTerms,
      ),
    [activeNegTerms, collTheme, novaSol],
  );

  const doRoll = useCallback(
    (lane, existingLocks = {}, existingResult = null) => {
      if (rolling) {
        return;
      }

      setRolling(true);
      setCopied(false);

      const overrides = existingResult
        ? {
            env: existingResult.env,
            mood: existingResult.mood,
            light: existingResult.light,
            weather: existingResult.weather,
            details: existingResult.details,
            style: existingResult.style,
            ratio: existingResult.ratio,
            viewpoint: existingResult.viewpoint,
            timeOfDay: existingResult.timeOfDay,
            season: existingResult.season,
            foreground: existingResult.foreground,
            palette: existingResult.palette,
            composition: existingResult.composition,
            texture: existingResult.texture,
            dof: existingResult.dof,
            soundRef: existingResult.soundRef,
            novaSol,
            collTheme,
          }
        : { novaSol, collTheme };

      let nextLocks = existingLocks;
      if (pinnedRatio) {
        overrides.ratio = pinnedRatio;
        nextLocks = { ...existingLocks, ratio: true };
      }

      const target = buildSlotsResult(lane, nextLocks, overrides);
      const currentLane = LANES[lane];
      const laneSupport = LANE_SUPPORT_POOLS[lane] || {};
      let tick = 0;
      clearInterval(ticker.current);

      ticker.current = setInterval(() => {
        const nextLiveSlots = {
          env: nextLocks.env ? target.env : tick < 9 ? pick(currentLane.environments) : target.env,
          mood: nextLocks.mood ? target.mood : tick < 7 ? pick(currentLane.moods) : target.mood,
          light: nextLocks.light ? target.light : tick < 8 ? pick(currentLane.lighting) : target.light,
          weather: nextLocks.weather ? target.weather : tick < 6 ? pick(currentLane.weather) : target.weather,
          details: nextLocks.details ? target.details : tick < 7 ? pickN(currentLane.details, 2) : target.details,
          style: nextLocks.style ? target.style : tick < 10 ? pick(currentLane.style) : target.style,
          ratio: target.ratio,
          viewpoint: nextLocks.viewpoint
            ? target.viewpoint
            : tick < 8
              ? pick(laneSupport.viewpoints || VIEWPOINTS)
              : target.viewpoint,
          timeOfDay: nextLocks.timeOfDay ? target.timeOfDay : tick < 6 ? pick(TIMES_OF_DAY) : target.timeOfDay,
          season: nextLocks.season ? target.season : tick < 5 ? pick(SEASONS) : target.season,
          foreground: nextLocks.foreground
            ? target.foreground
            : tick < 7
              ? pick(FOREGROUNDS[lane] || FOREGROUNDS["Neon Deck"])
              : target.foreground,
          palette: nextLocks.palette
            ? target.palette
            : tick < 9
              ? pick(laneSupport.palettes || COLOR_PALETTES)
              : target.palette,
          composition: nextLocks.composition
            ? target.composition
            : tick < 8
              ? pick(laneSupport.compositions || COMPOSITIONS)
              : target.composition,
          texture: nextLocks.texture
            ? target.texture
            : tick < 7
              ? pick(laneSupport.textures || TEXTURES)
              : target.texture,
          dof: nextLocks.dof
            ? target.dof
            : tick < 6
              ? pick(laneSupport.depths || DEPTHS)
              : target.dof,
          soundRef: nextLocks.soundRef
            ? target.soundRef
            : tick < 8
              ? pick(laneSupport.soundRefs || SOUND_REFS)
              : target.soundRef,
        };

        setLiveSlots(nextLiveSlots);
        tick += 1;

        if (tick > 13) {
          clearInterval(ticker.current);
          setResult(target);
          setLiveSlots(null);
          setRolling(false);
          setCardKey((previous) => previous + 1);
          setLogInput("");
          setCollection((previous) =>
            outputMode === "collection" ? [...previous, target].slice(0, 5) : [target],
          );
          setHistory((previous) => [target, ...previous].slice(0, 20));
        }
      }, 70);
    },
    [
      buildSlotsResult,
      collTheme,
      novaSol,
      outputMode,
      pinnedRatio,
      rolling,
    ],
  );

  useEffect(() => {
    doRoll("Sunset Pulse", {}, { novaSol: false, collTheme: "" });
  }, []);

  useEffect(() => () => clearInterval(ticker.current), []);

  const slots = useMemo(
    () =>
      liveSlots ||
      (result
        ? {
            env: result.env,
            mood: result.mood,
            light: result.light,
            weather: result.weather,
            details: result.details,
            style: result.style,
            ratio: result.ratio,
            viewpoint: result.viewpoint,
            timeOfDay: result.timeOfDay,
            season: result.season,
            foreground: result.foreground,
            palette: result.palette,
            composition: result.composition,
            texture: result.texture,
            dof: result.dof,
            soundRef: result.soundRef,
          }
        : null),
    [liveSlots, result],
  );

  const fieldOptions = useMemo(
    () =>
      slots
        ? {
            viewpoint: laneSupportPools.viewpoints || VIEWPOINTS,
            env: LANES[displayLane].environments,
            timeOfDay: TIMES_OF_DAY,
            season: SEASONS,
            mood: LANES[displayLane].moods,
            light: LANES[displayLane].lighting,
            weather: LANES[displayLane].weather,
            foreground: FOREGROUNDS[displayLane] || FOREGROUNDS["Neon Deck"],
            texture: laneSupportPools.textures || TEXTURES,
            dof: laneSupportPools.depths || DEPTHS,
            soundRef: laneSupportPools.soundRefs || SOUND_REFS,
            palette: laneSupportPools.palettes || COLOR_PALETTES,
            composition: laneSupportPools.compositions || COMPOSITIONS,
            details: LANES[displayLane].details,
            style: LANES[displayLane].style,
            ratio: LANES[displayLane].ratios,
          }
        : {},
    [displayLane, laneSupportPools, slots],
  );

  const slotDefinitions = useMemo(
    () =>
      slots
        ? [
            ["Viewpoint", "viewpoint", slots.viewpoint, fieldOptions.viewpoint],
            ["Environment", "env", slots.env, fieldOptions.env],
            ["Time of Day", "timeOfDay", slots.timeOfDay, fieldOptions.timeOfDay],
            ["Season", "season", slots.season, fieldOptions.season],
            ["Mood", "mood", slots.mood, fieldOptions.mood],
            ["Lighting", "light", slots.light, fieldOptions.light],
            ["Weather", "weather", slots.weather, fieldOptions.weather],
            ["Foreground", "foreground", slots.foreground, fieldOptions.foreground],
            ["Texture", "texture", slots.texture, fieldOptions.texture],
            ["Depth of Field", "dof", slots.dof, fieldOptions.dof],
            ["Sound Ref", "soundRef", slots.soundRef, fieldOptions.soundRef],
            ["Color Palette", "palette", slots.palette, fieldOptions.palette],
            ["Composition", "composition", slots.composition, fieldOptions.composition],
            ["Details", "details", slots.details, fieldOptions.details],
            ["Art Style", "style", slots.style, fieldOptions.style],
            ["Ratio", "ratio", slots.ratio, fieldOptions.ratio, result && !rolling ? RATIO_INFO[slots.ratio]?.use : ""],
          ]
        : [],
    [fieldOptions, result, rolling, slots],
  );

  const tabs = useMemo(
    () => [
      ["combined", "PROMPT"],
      ["nano", "NANO BANANA"],
      ["chatgpt", "CHATGPT"],
      ["etsy", "ETSY"],
      ["redbubble", "REDBUBBLE"],
      ...(outputMode === "collection" ? [["collection", "COLLECTION"]] : []),
    ],
    [outputMode],
  );

  const favId = useCallback((entry) => `${entry.env}${entry.mood}${entry.lane}`, []);
  const isFav = useCallback(
    (entry) =>
      entry && favorites.some((favorite) => favId(favorite) === favId(entry)),
    [favId, favorites],
  );
  const logKey = result ? favId(result) : null;
  const savedLog = logKey ? versionLog[logKey] : null;
  const addNegTerm = useCallback(() => {
    const term = customNegInput.trim();
    if (term && !negTerms.includes(term)) {
      setNegTerms((previous) => [...previous, term]);
      setCustomNegInput("");
    }
  }, [customNegInput, negTerms]);
  const removeNegTerm = useCallback(
    (term) => setNegTerms((previous) => previous.filter((item) => item !== term)),
    [],
  );
  const resetNeg = useCallback(() => setNegTerms([...DEFAULT_NEG_TERMS]), []);
  const exportCollection = useCallback(() => {
    const text = collection
      .map(
        (entry, index) =>
          `=== PROMPT ${index + 1} - ${entry.lane.toUpperCase()} ===\n${entry.combined}`,
      )
      .join("\n\n");
    downloadBlob(
      text,
      "text/plain",
      `sds-collection-${Date.now()}.txt`,
    );
  }, [collection]);

  if (generatorMode === "portrait") {
    return (
      <Suspense
        fallback={
          <div className="app-shell app-shell--portrait">
            <div className="app-loading-fallback">Loading portrait engine...</div>
          </div>
        }
      >
        <PortraitGenerator onSwitchMode={setGeneratorMode} />
      </Suspense>
    );
  }

  return (
    <div className="app-shell">
      <div
        className="app-bg-layer"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 15% 5%, ${laneConfig.dim}cc 0%, transparent 65%), radial-gradient(ellipse 35% 30% at 85% 95%, rgba(20,5,35,0.4) 0%, transparent 65%)`,
        }}
      />

      <div className="app-container">
        <div className="responsive-pill-row" style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            className="pill"
            style={{ background: `${accentColor}15`, borderColor: `${accentColor}55`, color: accentColor }}
          >
            Environment Engine
          </button>
          <button
            className="pill"
            onClick={() => setGeneratorMode("portrait")}
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.12)", color: "#8888aa" }}
          >
            Portrait Engine
          </button>
        </div>

        <HeaderPanel accentColor={accentColor} result={result} rolling={rolling} />

        <ControlsPanel
          activeLane={activeLane}
          setActiveLane={setActiveLane}
          laneNames={LANE_NAMES}
          lanes={LANES}
          accentColor={accentColor}
          outputMode={outputMode}
          setOutputMode={setOutputMode}
          pinnedRatio={pinnedRatio}
          setPinnedRatio={setPinnedRatio}
          showNegEditor={showNegEditor}
          setShowNegEditor={setShowNegEditor}
          novaSol={novaSol}
          setNovaSol={setNovaSol}
          collTheme={collTheme}
          setCollTheme={setCollTheme}
          result={result}
          ratioInfo={RATIO_INFO}
          negTerms={negTerms}
          customNegInput={customNegInput}
          setCustomNegInput={setCustomNegInput}
          addNegTerm={addNegTerm}
          removeNegTerm={removeNegTerm}
          resetNeg={resetNeg}
        />

        <SlotCard
          accentColor={accentColor}
          laneTag={LANES[displayLane].tag}
          slots={slots}
          slotDefinitions={slotDefinitions}
          rolling={rolling}
          locks={locks}
          onToggleLock={(key) => {
            if (!result) {
              return;
            }
            setLocks((previous) => ({ ...previous, [key]: !previous[key] }));
          }}
          onChangeField={(key, nextValue) => {
            if (!slots) {
              return;
            }
            const normalizedValue =
              key === "details"
                ? nextValue.slice(0, 2)
                : nextValue;
            const nextSlots = {
              ...slots,
              [key]: normalizedValue,
            };
            setResult(rebuildFromCurrentSlots(displayLane, nextSlots));
            setLocks((previous) => ({ ...previous, [key]: true }));
            setCardKey((previous) => previous + 1);
          }}
        />

        <div className="responsive-action-bar" style={{ display: "flex", gap: 9, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            className="roll-btn"
            disabled={rolling}
            onClick={() => doRoll(activeLane, locks, result)}
            style={{
              flex: 1,
              minWidth: 220,
              padding: "13px 18px",
              fontSize: 18,
              border: `1px solid ${rolling ? "#141420" : `${accentColor}44`}`,
              background: rolling ? "rgba(255,255,255,0.01)" : `linear-gradient(135deg, ${accentColor}18, ${accentColor}06)`,
              color: rolling ? "#5858a0" : accentColor,
            }}
          >
            {rolling
              ? "ROLLING..."
              : outputMode === "collection"
                ? `ADD TO COLLECTION (${collection.length}/5)`
                : `ROLL ${LANES[activeLane].tag}`}
          </button>
          <button className="roll-btn" disabled={rolling} onClick={() => { const lane = pick(LANE_NAMES); setActiveLane(lane); doRoll(lane, {}, null); }} style={{ padding: "13px 14px", fontSize: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}>
            RANDOM
          </button>
          {history.length > 0 && (
            <button className="roll-btn" onClick={() => setShowHistory((value) => !value)} style={{ padding: "13px 12px", fontSize: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}>
              HISTORY
            </button>
          )}
          {collection.length > 0 && (
            <button
              className="roll-btn"
              onClick={exportCollection}
              style={{ padding: "13px 12px", fontSize: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}
            >
              EXPORT BATCH
            </button>
          )}
        </div>

        {showHistory && (
          <HistoryPanel
            history={history}
            favorites={favorites}
            lanes={LANES}
            favId={favId}
            onLoad={(entry) => {
              setResult(entry);
              setActiveLane(entry.lane);
              setLocks({});
              setShowHistory(false);
              setCardKey((previous) => previous + 1);
            }}
            onToggleFav={(entry) =>
              setFavorites((previous) =>
                isFav(entry)
                  ? previous.filter((favorite) => favId(favorite) !== favId(entry))
                  : [entry, ...previous].slice(0, 10),
              )
            }
            isFav={isFav}
          />
        )}

        {result && !rolling && (
          <OutputCard
            key={cardKey}
            tab={tab}
            setTab={setTab}
            tabs={tabs}
            accentColor={accentColor}
            result={result}
            collection={collection}
            copyAllDone={copyAllDone}
            copied={copied}
            onCopyAll={() => {
              const text = [
                `=== COMBINED PROMPT ===\n${result.combined}`,
                `=== NANO BANANA JSON ===\n${JSON.stringify(result.nanoBanana, null, 2)}`,
                `=== CHATGPT JSON ===\n${JSON.stringify(result.chatGPT, null, 2)}`,
              ].join("\n\n");
              writeToClipboard(text, () => {
                setCopyAllDone(true);
                setTimeout(() => setCopyAllDone(false), 2500);
              });
            }}
            onCopy={() => {
              const text =
                tab === "combined"
                  ? result.combined
                  : tab === "nano"
                    ? JSON.stringify(result.nanoBanana, null, 2)
                    : tab === "chatgpt"
                      ? JSON.stringify(result.chatGPT, null, 2)
                      : tab === "etsy"
                        ? `TITLE:\n${result.etsy.title}\n\nTAGS:\n${result.etsy.tags.join(", ")}\n\nDESCRIPTION:\n${result.etsy.description}`
                        : tab === "redbubble"
                          ? `TITLE:\n${result.rb.title}\n\nTAGS:\n${result.rb.tags.join(", ")}\n\nDESCRIPTION:\n${result.rb.description}\n\nBEST PRODUCTS:\n${result.rb.bestProducts.join(", ")}`
                          : collection
                              .map((entry, index) => `--- PROMPT ${index + 1} (${entry.lane}) ---\n${entry.combined}`)
                              .join("\n\n");
              writeToClipboard(text, () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            onDownloadJson={() => {
              downloadBlob(
                JSON.stringify(
                  { nanoBanana: result.nanoBanana, chatGPT: result.chatGPT },
                  null,
                  2,
                ),
                "application/json",
                `sds-${result.lane.replace(/\s/g, "-").toLowerCase()}.json`,
              );
            }}
            ratioInfo={RATIO_INFO}
            versionLogValue={savedLog}
            logInput={logInput}
            setLogInput={setLogInput}
            onSaveLog={() => {
              if (!result || !logInput.trim()) {
                return;
              }
              setVersionLog((previous) => ({
                ...previous,
                [favId(result)]: logInput.trim(),
              }));
            }}
          />
        )}

        <div style={{ marginTop: 36, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 9, letterSpacing: 3, color: "#5858a0", textAlign: "center" }}>
          SUNSET DECK STUDIO | PROMPT ENGINE | 5 LANES | 16 SLOT ATTRIBUTES
        </div>
      </div>
    </div>
  );
}
