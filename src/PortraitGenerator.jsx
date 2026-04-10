import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RatioPreview, SlotRow } from "./components";
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
const ORDERED_FIELDS = FIELD_GROUPS.flatMap((group) => group.fields);

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

  const combinedPrompt = useMemo(
    () => (prompt ? buildCombinedPrompt(prompt) : ""),
    [prompt],
  );

  const generateAndStore = useCallback((overrides = {}, nextMood = "") => {
    const nextPrompt = generatePrompt(overrides);
    setActiveMood(nextMood);
    setPrompt(nextPrompt);
    setHistory((previous) => [nextPrompt, ...previous].slice(0, 12));
    setCardKey((previous) => previous + 1);
  }, []);

  const reroll = useCallback(
    (nextMood = activeMood) => {
      const moodOverrides = nextMood ? MOODS[nextMood] ?? {} : {};
      const lockOverrides = prompt
        ? Object.keys(locks).reduce((accumulator, field) => {
            if (locks[field]) {
              accumulator[field] = prompt[field];
            }
            return accumulator;
          }, {})
        : {};
      generateAndStore({ ...moodOverrides, ...lockOverrides }, nextMood);
    },
    [activeMood, generateAndStore, locks, prompt],
  );

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      const initial = generatePrompt();
      setPrompt(initial);
      setHistory([initial]);
    }
  }, []);

  const slotDefinitions = prompt
    ? ORDERED_FIELDS.filter((field) => field in prompt).map((field) => [
        FIELD_LABELS[field] ?? field,
        field,
        prompt[field],
        DATA[field] ?? [],
        "",
      ])
    : [];

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
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .fade-up { animation: fadeUp 0.28s ease forwards; }
        .roll-btn { font-family: 'Bebas Neue', sans-serif; letter-spacing: 4px; cursor: pointer; transition: all 0.18s; border-radius: 3px; }
        .roll-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
        .pill { font-family: 'IBM Plex Mono', monospace; cursor: pointer; transition: all 0.2s; letter-spacing: 2px; text-transform: uppercase; font-size: 9px; border-radius: 2px; border: 1px solid; padding: 5px 10px; }
        .tab-btn { font-family: 'IBM Plex Mono', monospace; cursor: pointer; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; background: transparent; border: none; padding: 9px 11px; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
        @media (max-width: 900px) {
          .responsive-output-toolbar {
            flex-direction: column;
            align-items: stretch !important;
            gap: 8px;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .responsive-tab-row { overflow-x: auto; }
          .responsive-output-actions {
            margin-left: 0 !important;
            flex-wrap: wrap;
          }
        }
        @media (max-width: 720px) {
          .responsive-slot-row {
            flex-direction: column;
            gap: 6px;
          }
          .responsive-slot-label {
            width: auto !important;
            padding-top: 0 !important;
          }
          .responsive-slot-content {
            width: 100%;
          }
          .responsive-action-bar { gap: 8px !important; }
          .responsive-action-bar .roll-btn {
            width: 100%;
            min-width: 0 !important;
          }
          .responsive-pill-row .pill,
          .responsive-preset-row .pill {
            flex: 1 1 calc(50% - 7px);
            min-height: 40px;
          }
          .responsive-output-actions > * {
            flex: 1 1 calc(50% - 5px);
            min-height: 40px;
          }
          .responsive-history-row,
          .responsive-history-header {
            flex-direction: column;
            align-items: stretch !important;
          }
          .responsive-history-summary {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }
          .responsive-history-lane {
            width: auto !important;
          }
        }
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

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "26px 16px 80px" }}>
        <div className="responsive-pill-row" style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            className="pill"
            onClick={() => onSwitchMode("environment")}
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.12)", color: "#8888aa" }}
          >
            Environment Engine
          </button>
          <button
            className="pill"
            style={{ background: `${ACCENT}15`, borderColor: `${ACCENT}55`, color: ACCENT }}
          >
            Portrait Engine
          </button>
        </div>

        <div style={{ marginBottom: 22 }}>
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
            {prompt
              ? `${activeMood ? `${activeMood.toUpperCase()} | ` : ""}${prompt.aspect_ratio} | ${prompt.anime_render_style}`
              : "ROLL A PORTRAIT"}
          </div>
        </div>

        <div className="responsive-preset-row" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
          {Object.keys(MOODS).map((moodName) => {
            const active = activeMood === moodName;
            return (
              <button
                key={moodName}
                className="pill"
                onClick={() => generateAndStore(MOODS[moodName], moodName)}
                style={{
                  background: active ? `${ACCENT}15` : "rgba(255,255,255,0.02)",
                  borderColor: active ? `${ACCENT}66` : "rgba(255,255,255,0.12)",
                  color: active ? ACCENT : "#8888aa",
                }}
              >
                {moodName}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16, alignItems: "center" }}>
          <button
            className="pill"
            onClick={() => generateAndStore({}, "")}
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.12)", color: "#8888aa" }}
          >
            CLEAR PRESET
          </button>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#7070a8", textTransform: "uppercase" }}>
            {Object.keys(locks).filter((key) => locks[key]).length} Locked Fields
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${ACCENT}28`,
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(8,8,14,0.94)",
            marginBottom: 12,
            boxShadow: `0 0 40px ${ACCENT}20`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 14px",
              background: `${ACCENT}08`,
              borderBottom: `1px solid ${ACCENT}18`,
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: 4, color: ACCENT, textTransform: "uppercase" }}>
              Roll - Portrait Engine
            </div>
            {prompt && <RatioPreview ratio={prompt.aspect_ratio} color={ACCENT} />}
          </div>

          {prompt ? (
            slotDefinitions.map(([label, key, value, options, helperText], index) => (
              <SlotRow
                key={key}
                label={label}
                value={value}
                options={options}
                helperText={helperText}
                spinning={false}
                locked={Boolean(locks[key])}
                onToggleLock={() =>
                  setLocks((previous) => ({ ...previous, [key]: !previous[key] }))
                }
                onChange={(nextValue) => {
                  setPrompt((previous) => ({ ...previous, [key]: nextValue }));
                  setLocks((previous) => ({ ...previous, [key]: true }));
                  setCardKey((previous) => previous + 1);
                }}
                color={ACCENT}
                last={index === slotDefinitions.length - 1}
              />
            ))
          ) : (
            <div style={{ padding: "28px 14px", fontSize: 10, letterSpacing: 4, color: "#585878" }}>
              READY - PRESS ROLL
            </div>
          )}
        </div>

        <div className="responsive-action-bar" style={{ display: "flex", gap: 9, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            className="roll-btn"
            onClick={() => reroll()}
            style={{
              flex: 1,
              minWidth: 220,
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
            style={{ padding: "13px 14px", fontSize: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}
          >
            RANDOM
          </button>
          {history.length > 0 && (
            <button
              className="roll-btn"
              onClick={() => setShowHistory((value) => !value)}
              style={{ padding: "13px 12px", fontSize: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "#8888aa" }}
            >
              HISTORY
            </button>
          )}
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
            <div
              className="responsive-history-header"
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontSize: 9,
                letterSpacing: 4,
                color: "#7070a8",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>HISTORY - {history.length} ROLLS</span>
              <span>{activeMood ? "PRESET ACTIVE" : "GENERAL MODE"}</span>
            </div>
            {history.map((entry, index) => (
              <div
                className="responsive-history-row"
                key={`${entry.aspect_ratio}-${entry.setting}-${index}`}
                onClick={() => {
                  setPrompt(entry);
                  setCardKey((previous) => previous + 1);
                  setShowHistory(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  cursor: "pointer",
                }}
              >
                <span
                  className="responsive-history-lane"
                  style={{
                    fontSize: 9,
                    color: ACCENT,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    width: 110,
                    flexShrink: 0,
                  }}
                >
                  {entry.mood}
                </span>
                <span
                  className="responsive-history-summary"
                  style={{
                    fontSize: 11,
                    color: "#8888b0",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.setting} - {entry.outfit}
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
              className="responsive-output-toolbar"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "0 12px",
                background: "rgba(255,255,255,0.01)",
                overflowX: "auto",
              }}
            >
              <div className="responsive-tab-row" style={{ display: "flex", flexShrink: 0 }}>
                {[
                  ["prompt", "PROMPT"],
                  ["json", "JSON"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className="tab-btn"
                    onClick={() => setTab(key)}
                    style={{ color: tab === key ? ACCENT : "#7070a0", borderBottomColor: tab === key ? ACCENT : "transparent" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="responsive-output-actions" style={{ display: "flex", gap: 5, marginLeft: 8 }}>
                <button
                  className="pill"
                  onClick={() => {
                    writeToClipboard(combinedPrompt, () => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  style={{
                    color: copied ? ACCENT : "#7878a8",
                    borderColor: copied ? `${ACCENT}77` : "#252540",
                    background: copied ? `${ACCENT}15` : "transparent",
                  }}
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
                  style={{
                    color: copiedJson ? ACCENT : "#7878a8",
                    borderColor: copiedJson ? `${ACCENT}77` : "#252540",
                    background: copiedJson ? `${ACCENT}15` : "transparent",
                  }}
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 16px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(255,255,255,0.005)",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 9, color: "#6060a0", letterSpacing: 2 }}>
                {prompt.aspect_ratio}
              </div>
              <div style={{ fontSize: 9, color: "#6060a0", letterSpacing: 2 }}>
                {prompt.anime_render_style}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 36, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 9, letterSpacing: 3, color: "#5858a0", textAlign: "center" }}>
          SUNSET DECK STUDIO | PORTRAIT ENGINE | PRESETS | LOCKABLE FIELDS
        </div>
      </div>
    </div>
  );
}
