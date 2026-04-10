import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildPromptString,
  DATA,
  FIELD_GROUPS,
  FIELD_LABELS,
  generatePrompt,
  MOODS,
} from "./portraitData";

const ACCENT = "#f472b6";
const DIM = "#2a0a1a";

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;
  const value = Number.parseInt(full, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function themedSurface(hex, intensity = 0.2, base = 12) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(base + (channel - base) * intensity);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function themedBorder(hex, alpha = 0.4) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function copyFallback(text, onDone) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText =
    "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.warn("Copy failed", error);
  }
  document.body.removeChild(textarea);
  onDone();
}

function writeToClipboard(text, onDone) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone).catch(() => copyFallback(text, onDone));
    return;
  }
  copyFallback(text, onDone);
}

function FieldRow({
  field,
  label,
  value,
  options,
  locked,
  onToggleLock,
  onChange,
  stacked,
}) {
  const isMulti = Array.isArray(value);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: stacked ? "column" : "row",
        gap: stacked ? 6 : 10,
        padding: "7px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <button
        onClick={() => onToggleLock(field)}
        title={locked ? "Unlock" : "Lock"}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px 3px",
          flexShrink: 0,
          marginTop: 1,
          fontSize: 11,
          color: locked ? ACCENT : "#585878",
        }}
      >
        {locked ? "[LOCK]" : "[ ]"}
      </button>
      <span
        style={{
          fontSize: 9,
          letterSpacing: 3,
          color: "#7070a8",
          textTransform: "uppercase",
          width: stacked ? "auto" : 116,
          flexShrink: 0,
          paddingTop: stacked ? 0 : 2,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0, width: stacked ? "100%" : "auto" }}>
        {isMulti ? (
          <select
            multiple
            value={value}
            onChange={(event) => {
              const nextValues = Array.from(event.target.selectedOptions, (option) => option.value);
              if (nextValues.length) {
                onChange(field, nextValues);
              }
            }}
            style={{
              width: "100%",
              minHeight: 108,
              background: themedSurface(ACCENT, 0.2, 12),
              border: `1px solid ${themedBorder(ACCENT, locked ? 0.55 : 0.34)}`,
              borderRadius: 2,
              color: "#fdf7fb",
              fontSize: 11,
              padding: 8,
              fontFamily: "inherit",
            }}
          >
            {options.map((option) => (
              <option
                key={option}
                value={option}
                style={{
                  color: "#fdf7fb",
                  background: themedSurface(ACCENT, 0.26, 14),
                }}
              >
                {option}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={value}
            onChange={(event) => onChange(field, event.target.value)}
            style={{
              width: "100%",
              background: themedSurface(ACCENT, 0.2, 12),
              border: `1px solid ${themedBorder(ACCENT, locked ? 0.55 : 0.34)}`,
              borderRadius: 2,
              color: "#fdf7fb",
              fontSize: 11,
              padding: "8px 10px",
              fontFamily: "inherit",
            }}
          >
            {options.map((option) => (
              <option
                key={option}
                value={option}
                style={{
                  color: "#fdf7fb",
                  background: themedSurface(ACCENT, 0.26, 14),
                }}
              >
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function buildCombinedPrompt(prompt) {
  return `${buildPromptString(prompt)}\n\nNegative prompt: ${prompt.negative_tags.join(", ")}`;
}

export function PortraitGenerator({ onSwitchMode }) {
  const [activeMood, setActiveMood] = useState("");
  const [prompt, setPrompt] = useState(null);
  const [locks, setLocks] = useState({});
  const [tab, setTab] = useState("prompt");
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const firstRun = useRef(true);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );

  const combinedPrompt = useMemo(
    () => (prompt ? buildCombinedPrompt(prompt) : ""),
    [prompt],
  );
  const isCompact = viewportWidth < 900;
  const isPhone = viewportWidth < 560;

  const reroll = useCallback(
    (nextMood = activeMood) => {
      const baseOverrides = nextMood ? MOODS[nextMood] ?? {} : {};
      const lockOverrides = prompt
        ? Object.keys(locks).reduce((accumulator, field) => {
            if (locks[field]) {
              accumulator[field] = prompt[field];
            }
            return accumulator;
          }, {})
        : {};
      const nextPrompt = generatePrompt({ ...baseOverrides, ...lockOverrides });
      setPrompt(nextPrompt);
      setHistory((previous) => [nextPrompt, ...previous].slice(0, 12));
      setCardKey((previous) => previous + 1);
    },
    [activeMood, locks, prompt],
  );

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      const initial = generatePrompt();
      setPrompt(initial);
      setHistory([initial]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groups = FIELD_GROUPS.map((group) => ({
    ...group,
    items: group.fields
      .filter((field) => prompt && field in prompt)
      .map((field) => ({
        field,
        label: FIELD_LABELS[field] ?? field,
        value: prompt[field],
        options: DATA[field] ?? [],
      })),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080f",
        color: "#c8c8e0",
        fontFamily: "'IBM Plex Mono', monospace",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.28s ease forwards; }
        .roll-btn { font-family: 'Bebas Neue', sans-serif; letter-spacing: 4px; cursor: pointer; transition: all 0.18s; border-radius: 3px; }
        .roll-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
        .pill { font-family: 'IBM Plex Mono', monospace; cursor: pointer; transition: all 0.2s; letter-spacing: 2px; text-transform: uppercase; font-size: 9px; border-radius: 2px; border: 1px solid; padding: 5px 10px; }
        .tab-btn { font-family: 'IBM Plex Mono', monospace; cursor: pointer; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; background: transparent; border: none; padding: 9px 11px; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse 55% 45% at 15% 5%, ${DIM}cc 0%, transparent 65%), radial-gradient(ellipse 35% 30% at 85% 95%, rgba(10,5,30,0.45) 0%, transparent 65%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: isPhone ? "18px 12px 72px" : "26px 16px 80px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", flexDirection: isPhone ? "column" : "row", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
            <button
              className="pill"
              onClick={() => onSwitchMode("environment")}
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.12)", color: "#8888aa", width: isPhone ? "100%" : "auto", minHeight: isPhone ? 42 : undefined }}
            >
              Environment Engine
            </button>
            <button
              className="pill"
              style={{ background: `${ACCENT}15`, borderColor: `${ACCENT}55`, color: ACCENT, width: isPhone ? "100%" : "auto", minHeight: isPhone ? 42 : undefined }}
            >
              Portrait Engine
            </button>
          </div>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#5858a0", marginBottom: 4 }}>
            SUNSET DECK STUDIO
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(26px, 6vw, 46px)",
              letterSpacing: 6,
              color: "#fff",
              lineHeight: 1,
              textShadow: `0 0 35px ${ACCENT}55`,
            }}
          >
            ANIME PORTRAIT GENERATOR
          </div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: ACCENT, marginTop: 5, minHeight: 14 }}>
            {activeMood ? `${activeMood.toUpperCase()} PRESET ACTIVE` : "GENERAL PORTRAIT MODE"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isPhone ? "column" : "row", flexWrap: "wrap", gap: 7, marginBottom: 16, alignItems: "stretch" }}>
          {Object.keys(MOODS).map((moodName) => {
            const active = activeMood === moodName;
            return (
              <button
                key={moodName}
                className="pill"
                onClick={() => {
                  setActiveMood(moodName);
                  const nextPrompt = generatePrompt(MOODS[moodName]);
                  setPrompt(nextPrompt);
                  setHistory((previous) => [nextPrompt, ...previous].slice(0, 12));
                  setCardKey((previous) => previous + 1);
                }}
                style={{
                  background: active ? `${ACCENT}15` : "rgba(255,255,255,0.02)",
                  borderColor: active ? `${ACCENT}66` : "rgba(255,255,255,0.12)",
                  color: active ? ACCENT : "#8888aa",
                  width: isPhone ? "100%" : "auto",
                  minHeight: isPhone ? 42 : undefined,
                }}
              >
                {moodName}
              </button>
            );
          })}
          <button
            className="pill"
            onClick={() => {
              setActiveMood("");
              const nextPrompt = generatePrompt();
              setPrompt(nextPrompt);
              setHistory((previous) => [nextPrompt, ...previous].slice(0, 12));
              setCardKey((previous) => previous + 1);
            }}
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.12)", color: "#8888aa", width: isPhone ? "100%" : "auto", minHeight: isPhone ? 42 : undefined }}
          >
            Clear Preset
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: 14 }}>
          <div>
            {groups.map((group) => (
              <div
                key={group.label}
                style={{
                  border: `1px solid ${ACCENT}20`,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(8,8,14,0.94)",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    padding: "8px 14px",
                    background: `${ACCENT}08`,
                    borderBottom: `1px solid ${ACCENT}18`,
                    fontSize: 9,
                    letterSpacing: 4,
                    color: ACCENT,
                    textTransform: "uppercase",
                  }}
                >
                  {group.label}
                </div>
                {group.items.map((item, index) => (
                  <FieldRow
                    key={item.field}
                    field={item.field}
                    label={item.label}
                    value={item.value}
                    options={item.options}
                    locked={Boolean(locks[item.field])}
                    stacked={isCompact}
                    onToggleLock={(field) =>
                      setLocks((previous) => ({ ...previous, [field]: !previous[field] }))
                    }
                    onChange={(field, nextValue) => {
                      setPrompt((previous) => ({ ...previous, [field]: nextValue }));
                      setLocks((previous) => ({ ...previous, [field]: true }));
                    }}
                    last={index === group.items.length - 1}
                  />
                ))}
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", flexDirection: isPhone ? "column" : "row", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
              <button
                className="roll-btn"
                onClick={() => reroll()}
                style={{
                  flex: isPhone ? "none" : 1,
                  minWidth: isPhone ? 0 : 210,
                  width: isPhone ? "100%" : "auto",
                  padding: "13px 18px",
                  fontSize: 18,
                  border: `1px solid ${ACCENT}44`,
                  background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}06)`,
                  color: ACCENT,
                }}
              >
                ROLL PORTRAIT
              </button>
              <button
                className="roll-btn"
                onClick={() => {
                  setActiveMood("");
                  reroll("");
                }}
                style={{ padding: "13px 14px", width: isPhone ? "100%" : "auto", fontSize: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}
              >
                RANDOM
              </button>
              <button
                className="roll-btn"
                onClick={() => setShowHistory((previous) => !previous)}
                style={{ padding: "13px 14px", width: isPhone ? "100%" : "auto", fontSize: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}
              >
                HISTORY
              </button>
            </div>

            {showHistory && (
              <div
                className="fade-up"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 14,
                  background: "rgba(8,8,14,0.95)",
                }}
              >
                <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 9, letterSpacing: 4, color: "#7070a8" }}>
                  HISTORY - {history.length} ROLLS
                </div>
                {history.map((entry, index) => (
                  <div
                    key={`${entry.aspect_ratio}-${index}`}
                    onClick={() => {
                      setPrompt(entry);
                      setCardKey((previous) => previous + 1);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: isPhone ? "column" : "row",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 9, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", width: isPhone ? "auto" : 90, flexShrink: 0 }}>
                      {entry.mood}
                    </span>
                    <span style={{ fontSize: 11, color: "#8888b0", flex: 1, overflow: isPhone ? "visible" : "hidden", textOverflow: isPhone ? "clip" : "ellipsis", whiteSpace: isPhone ? "normal" : "nowrap" }}>
                      {entry.setting}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {prompt && (
              <div
                key={cardKey}
                className="fade-up"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(7,7,12,0.97)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isCompact ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isCompact ? "stretch" : "center",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    padding: isCompact ? "8px 12px" : "0 12px",
                    background: "rgba(255,255,255,0.01)",
                    overflowX: "auto",
                    gap: isCompact ? 8 : 0,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: isPhone ? "column" : "row", flexShrink: 0, width: isCompact ? "100%" : "auto" }}>
                    {[
                      ["prompt", "Prompt"],
                      ["json", "JSON"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        className="tab-btn"
                        onClick={() => setTab(key)}
                        style={{ color: tab === key ? ACCENT : "#7070a0", borderBottomColor: tab === key ? ACCENT : "transparent", width: isPhone ? "100%" : "auto" }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: isPhone ? "column" : "row", flexWrap: isCompact ? "wrap" : "nowrap", gap: 5, width: isCompact ? "100%" : "auto" }}>
                    <button
                      className="pill"
                      onClick={() => {
                        writeToClipboard(combinedPrompt, () => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      style={{ color: copied ? ACCENT : "#7878a8", borderColor: copied ? `${ACCENT}77` : "#252540", background: copied ? `${ACCENT}15` : "transparent", width: isPhone ? "100%" : "auto", minHeight: isPhone ? 42 : undefined }}
                    >
                      {copied ? "COPIED" : "COPY PROMPT"}
                    </button>
                    <button
                      className="pill"
                      onClick={() => {
                        writeToClipboard(JSON.stringify(prompt, null, 2), () => {
                          setCopiedJson(true);
                          setTimeout(() => setCopiedJson(false), 2000);
                        });
                      }}
                      style={{ color: copiedJson ? ACCENT : "#7878a8", borderColor: copiedJson ? `${ACCENT}77` : "#252540", background: copiedJson ? `${ACCENT}15` : "transparent", width: isPhone ? "100%" : "auto", minHeight: isPhone ? 42 : undefined }}
                    >
                      {copiedJson ? "COPIED" : "COPY JSON"}
                    </button>
                  </div>
                </div>

                {tab === "prompt" && (
                  <div style={{ padding: 16, fontSize: 12, lineHeight: 1.85, maxHeight: 520, overflowY: "auto" }}>
                    <div style={{ color: "#c8c8e0", marginBottom: 14, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {buildPromptString(prompt)}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                      <div style={{ fontSize: 9, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>
                        Style Tags
                      </div>
                      <div style={{ color: "#9898b8", marginBottom: 12 }}>
                        {prompt.style_tags.join(", ")}
                      </div>
                      <div style={{ fontSize: 9, letterSpacing: 3, color: "#ff4d6d", textTransform: "uppercase", marginBottom: 8 }}>
                        Negative Prompt
                      </div>
                      <div style={{ color: "#6868a0" }}>{prompt.negative_tags.join(", ")}</div>
                    </div>
                  </div>
                )}

                {tab === "json" && (
                  <div style={{ padding: "14px 16px", fontSize: 11, lineHeight: 1.8, color: "#5dbd8a", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 520, overflowY: "auto", background: "rgba(0,0,0,0.2)" }}>
                    {JSON.stringify(prompt, null, 2)}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.005)", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 9, color: "#6060a0", letterSpacing: 2 }}>
                    {prompt.aspect_ratio}
                  </div>
                  <div style={{ fontSize: 9, color: "#6060a0", letterSpacing: 2 }}>
                    {prompt.anime_render_style}
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 14, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, background: "rgba(255,255,255,0.01)" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#7070a8", textTransform: "uppercase", marginBottom: 8 }}>
                Available Fields
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.keys(DATA).map((field) => (
                  <span key={field} style={{ padding: "3px 8px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)", color: "#9090b8", fontSize: 10 }}>
                    {FIELD_LABELS[field] ?? field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 9, letterSpacing: 3, color: "#5858a0", textAlign: "center" }}>
          SUNSET DECK STUDIO | PORTRAIT ENGINE | PRESETS | LOCKABLE FIELDS
        </div>
      </div>
    </div>
  );
}
