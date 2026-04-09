import { RatioPreview } from "./components";

export function ControlsPanel({
  activeLane,
  setActiveLane,
  laneNames,
  lanes,
  accentColor,
  outputMode,
  setOutputMode,
  pinnedRatio,
  setPinnedRatio,
  showNegEditor,
  setShowNegEditor,
  novaSol,
  setNovaSol,
  collTheme,
  setCollTheme,
  result,
  ratioInfo,
  negTerms,
  customNegInput,
  setCustomNegInput,
  addNegTerm,
  removeNegTerm,
  resetNeg,
}) {
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
        {laneNames.map((name) => {
          const laneColor = lanes[name].color;
          const active = activeLane === name;
          return (
            <button
              key={name}
              className="pill"
              onClick={() => setActiveLane(name)}
              style={{
                background: active ? `${laneColor}15` : "rgba(255,255,255,0.02)",
                borderColor: active ? `${laneColor}66` : "rgba(255,255,255,0.12)",
                color: active ? laneColor : "#8888aa",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16, alignItems: "center" }}>
        <button
          className="pill"
          onClick={() => setOutputMode((mode) => (mode === "single" ? "collection" : "single"))}
          style={{
            background: outputMode === "collection" ? `${accentColor}12` : "rgba(255,255,255,0.02)",
            borderColor: outputMode === "collection" ? `${accentColor}55` : "rgba(255,255,255,0.12)",
            color: outputMode === "collection" ? accentColor : "#8888aa",
          }}
        >
          {outputMode === "single" ? "SINGLE" : "COLLECTION"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <select
            value={pinnedRatio || ""}
            onChange={(event) => setPinnedRatio(event.target.value || null)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              color: pinnedRatio ? accentColor : "#8888aa",
              fontSize: 9,
              letterSpacing: 2,
              padding: "5px 7px",
            }}
          >
            <option value="">RATIO: RANDOM</option>
            {Object.keys(ratioInfo).map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
          <RatioPreview ratio={pinnedRatio || result?.ratio} color={accentColor} />
        </div>

        <button
          className="pill"
          onClick={() => setShowNegEditor((value) => !value)}
          style={{
            background: showNegEditor ? "rgba(255,77,109,0.1)" : "rgba(255,255,255,0.02)",
            borderColor: showNegEditor ? "rgba(255,77,109,0.5)" : "rgba(255,255,255,0.12)",
            color: showNegEditor ? "#ff7090" : "#8888aa",
          }}
        >
          NEG EDITOR
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: "auto" }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: novaSol ? "#fb923c" : "#6868a0", textTransform: "uppercase" }}>
            NOVA SOL
          </span>
          <button
            className="toggle-track"
            onClick={() => setNovaSol((value) => !value)}
            style={{ background: novaSol ? "rgba(251,146,60,0.45)" : "rgba(255,255,255,0.07)" }}
          >
            <div className="toggle-thumb" style={{ left: novaSol ? "19px" : "3px" }} />
          </button>
        </div>
      </div>

      {outputMode === "collection" && (
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: "#7070a8", textTransform: "uppercase", flexShrink: 0 }}>
            Collection Theme
          </span>
          <input
            className="text-input"
            value={collTheme}
            onChange={(event) => setCollTheme(event.target.value)}
            placeholder="e.g. rainy Tokyo trilogy, neon dusk series..."
            style={{ flex: 1 }}
          />
        </div>
      )}

      {showNegEditor && (
        <div className="fade-up" style={{ border: "1px solid rgba(255,77,109,0.2)", borderRadius: 4, padding: 14, marginBottom: 14, background: "rgba(30,5,12,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 9, letterSpacing: 3, color: "#ff7090", textTransform: "uppercase" }}>
              Negative Prompt Editor - {negTerms.length} terms
            </span>
            <button className="pill" onClick={resetNeg} style={{ color: "#ff7090", borderColor: "rgba(255,77,109,0.25)", background: "transparent" }}>
              Reset
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {negTerms.map((term) => (
              <span key={term} className="neg-tag">
                {term}
                <button onClick={() => removeNegTerm(term)}>x</button>
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 7 }}>
            <input
              className="text-input"
              value={customNegInput}
              onChange={(event) => setCustomNegInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addNegTerm()}
              placeholder="Add custom term..."
              style={{ flex: 1 }}
            />
            <button className="pill" onClick={addNegTerm} style={{ color: "#ff7090", borderColor: "rgba(255,77,109,0.25)", background: "rgba(255,77,109,0.1)" }}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
