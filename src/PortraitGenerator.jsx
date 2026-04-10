import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { downloadBlob, writeToClipboard } from "./browserUtils";
import { RatioPreview, SlotRow } from "./components";
import {
  buildPromptOutputs,
  DATA,
  FIELD_GROUPS,
  FIELD_LABELS,
  generatePrompt,
  getOrientationForAspectRatio,
  MOODS,
} from "./portraitData";

const ACCENT = "#f472b6";
const DIM = "#2a0a1a";
const ORDERED_FIELDS = FIELD_GROUPS.flatMap((group) => group.fields);

export function PortraitGenerator({ onSwitchMode }) {
  const [activeMood, setActiveMood] = useState("");
  const [prompt, setPrompt] = useState(null);
  const [locks, setLocks] = useState({});
  const [tab, setTab] = useState("prompt");
  const [copiedKey, setCopiedKey] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const firstRun = useRef(true);

  const presetNames = useMemo(() => Object.keys(MOODS), []);

  const flashCopied = useCallback((key) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  }, []);

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

  const slotDefinitions = useMemo(
    () =>
      prompt
        ? ORDERED_FIELDS.filter((field) => field in prompt).map((field) => [
            FIELD_LABELS[field] ?? field,
            field,
            prompt[field],
            field === "orientation"
              ? [getOrientationForAspectRatio(prompt.aspect_ratio)]
              : DATA[field] ?? [],
            field === "orientation" ? "Derived from aspect ratio" : "",
          ])
        : [],
    [prompt],
  );

  return (
    <div className="app-shell app-shell--portrait">
      <div
        className="app-bg-layer"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 15% 5%, ${DIM}cc 0%, transparent 65%), radial-gradient(ellipse 35% 30% at 85% 95%, rgba(10,5,30,0.45) 0%, transparent 65%)`,
        }}
      />

      <div className="app-container">
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
          {presetNames.map((moodName) => {
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
                  setPrompt((previous) =>
                    buildPromptOutputs(
                      key === "aspect_ratio"
                        ? {
                            ...previous,
                            aspect_ratio: nextValue,
                            orientation: getOrientationForAspectRatio(nextValue),
                          }
                        : { ...previous, [key]: nextValue },
                    ),
                  );
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
                  ["chatgpt", "CHATGPT JSON"],
                  ["nano", "NANO BANANA JSON"],
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
                  onClick={() =>
                    downloadBlob(
                      JSON.stringify(
                        {
                          chatGPT: prompt.chatGPT,
                          nanoBanana: prompt.nanoBanana,
                        },
                        null,
                        2,
                      ),
                      "application/json",
                      `portrait-prompt-${Date.now()}.json`,
                    )
                  }
                  style={{ color: "#7878a8", borderColor: "#252540", background: "transparent" }}
                >
                  DOWNLOAD JSON
                </button>
                {tab === "prompt" && (
                  <>
                    <button
                      className="pill"
                      onClick={() => {
                        writeToClipboard(prompt.regularPrompt, () => flashCopied("regular"));
                      }}
                      style={{
                        color: copiedKey === "regular" ? ACCENT : "#7878a8",
                        borderColor: copiedKey === "regular" ? `${ACCENT}77` : "#252540",
                        background: copiedKey === "regular" ? `${ACCENT}15` : "transparent",
                      }}
                    >
                      {copiedKey === "regular" ? "COPIED" : "COPY PROMPT"}
                    </button>
                    <button
                      className="pill"
                      onClick={() => {
                        writeToClipboard(prompt.chatgptPrompt, () => flashCopied("chatgpt-prompt"));
                      }}
                      style={{
                        color: copiedKey === "chatgpt-prompt" ? ACCENT : "#7878a8",
                        borderColor: copiedKey === "chatgpt-prompt" ? `${ACCENT}77` : "#252540",
                        background: copiedKey === "chatgpt-prompt" ? `${ACCENT}15` : "transparent",
                      }}
                    >
                      {copiedKey === "chatgpt-prompt" ? "COPIED" : "COPY CHATGPT PROMPT"}
                    </button>
                    <button
                      className="pill"
                      onClick={() => {
                        writeToClipboard(prompt.nanoPrompt, () => flashCopied("nano-prompt"));
                      }}
                      style={{
                        color: copiedKey === "nano-prompt" ? ACCENT : "#7878a8",
                        borderColor: copiedKey === "nano-prompt" ? `${ACCENT}77` : "#252540",
                        background: copiedKey === "nano-prompt" ? `${ACCENT}15` : "transparent",
                      }}
                    >
                      {copiedKey === "nano-prompt" ? "COPIED" : "COPY NANO PROMPT"}
                    </button>
                  </>
                )}
                {tab !== "prompt" && (
                  <button
                    className="pill"
                    onClick={() =>
                      writeToClipboard(
                        JSON.stringify(
                          tab === "chatgpt" ? prompt.chatGPT : prompt.nanoBanana,
                          null,
                          2,
                        ),
                        () => flashCopied("json"),
                      )
                    }
                    style={{
                      color: copiedKey === "json" ? ACCENT : "#7878a8",
                      borderColor: copiedKey === "json" ? `${ACCENT}77` : "#252540",
                      background: copiedKey === "json" ? `${ACCENT}15` : "transparent",
                    }}
                  >
                    {copiedKey === "json" ? "COPIED" : "COPY JSON"}
                  </button>
                )}
              </div>
            </div>

            {tab === "prompt" && (
              <div style={{ padding: 16, fontSize: 12, lineHeight: 1.85, maxHeight: 520, overflowY: "auto" }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>
                  Regular Prompt
                </div>
                <div style={{ color: "#c8c8e0", marginBottom: 16, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {prompt.regularPrompt}
                </div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>
                  ChatGPT Prompt
                </div>
                <div style={{ color: "#b7b7d4", marginBottom: 16, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {prompt.chatgptPrompt}
                </div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>
                  Nano Banana Prompt
                </div>
                <div style={{ color: "#b7b7d4", marginBottom: 16, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {prompt.nanoPrompt}
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
                  <div style={{ color: "#6868a0" }}>{prompt.negativePrompt}</div>
                </div>
              </div>
            )}

            {tab === "chatgpt" && (
              <div style={{ padding: "14px 16px", fontSize: 11, lineHeight: 1.8, color: "#5dbd8a", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 520, overflowY: "auto", background: "rgba(0,0,0,0.2)" }}>
                {JSON.stringify(prompt.chatGPT, null, 2)}
              </div>
            )}

            {tab === "nano" && (
              <div style={{ padding: "14px 16px", fontSize: 11, lineHeight: 1.8, color: "#5dbd8a", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 520, overflowY: "auto", background: "rgba(0,0,0,0.2)" }}>
                {JSON.stringify(prompt.nanoBanana, null, 2)}
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
