import { memo } from "react";
import { LANES } from "./data";

export const OutputCard = memo(function OutputCard({
  tab,
  setTab,
  tabs,
  accentColor,
  result,
  collection,
  copyAllDone,
  copied,
  onCopyAll,
  onCopy,
  onDownloadJson,
  ratioInfo,
  versionLogValue,
  logInput,
  setLogInput,
  onSaveLog,
}) {
  return (
    <div
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
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className="tab-btn"
              onClick={() => setTab(key)}
              style={{
                color: tab === key ? accentColor : "#7070a0",
                borderBottomColor: tab === key ? accentColor : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="responsive-output-actions" style={{ display: "flex", gap: 5, marginLeft: 8 }}>
          <button className="icon-btn" onClick={onDownloadJson} style={{ color: "#7878a8" }}>
            DOWNLOAD JSON
          </button>
          <button
            className="pill"
            onClick={onCopyAll}
            style={{
              color: copyAllDone ? "#a0a0e0" : "#6060a0",
              borderColor: "#252540",
              background: copyAllDone ? "rgba(112,112,192,0.15)" : "transparent",
            }}
          >
            {copyAllDone ? "ALL COPIED" : "COPY ALL"}
          </button>
          <button
            className="pill"
            onClick={onCopy}
            style={{
              color: copied ? accentColor : "#7878a8",
              borderColor: copied ? `${accentColor}77` : "#252540",
              background: copied ? `${accentColor}15` : "transparent",
            }}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      </div>

      {tab === "combined" && (
        <div style={{ padding: 16, fontSize: 12, lineHeight: 1.9, maxHeight: 400, overflowY: "auto" }}>
          <div style={{ color: "#c8c8e0", marginBottom: 14, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {result.positive}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
            <span style={{ fontSize: 9, letterSpacing: 3, color: "#ff4d6d", textTransform: "uppercase" }}>
              Negative Prompt:{" "}
            </span>
            <span style={{ color: "#6868a0", fontSize: 11 }}>{result.negative}</span>
          </div>
        </div>
      )}

      {(tab === "nano" || tab === "chatgpt") && (
        <div
          style={{
            padding: "14px 16px",
            fontSize: 11,
            lineHeight: 1.8,
            color: "#5dbd8a",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 440,
            overflowY: "auto",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {tab === "nano"
            ? JSON.stringify(result.nanoBanana, null, 2)
            : JSON.stringify(result.chatGPT, null, 2)}
        </div>
      )}

      {tab === "etsy" && (
        <div style={{ padding: 16, fontSize: 12, lineHeight: 1.8, maxHeight: 440, overflowY: "auto" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: accentColor, textTransform: "uppercase", marginBottom: 5 }}>
              TITLE
            </div>
            <div style={{ color: "#d0d0e8", wordBreak: "break-word" }}>{result.etsy.title}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: accentColor, textTransform: "uppercase", marginBottom: 5 }}>
              TAGS ({result.etsy.tags.length}/13)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {result.etsy.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "3px 8px",
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}28`,
                    borderRadius: 2,
                    fontSize: 10,
                    color: "#b0b0d0",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ color: "#a0a0c0", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {result.etsy.description}
          </div>
        </div>
      )}

      {tab === "redbubble" && (
        <div style={{ padding: 16, fontSize: 12, lineHeight: 1.8, maxHeight: 440, overflowY: "auto" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: accentColor, textTransform: "uppercase", marginBottom: 5 }}>
              TITLE
            </div>
            <div style={{ color: "#d0d0e8", wordBreak: "break-word" }}>{result.rb.title}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: accentColor, textTransform: "uppercase", marginBottom: 5 }}>
              TAGS ({result.rb.tags.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {result.rb.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "3px 8px",
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}28`,
                    borderRadius: 2,
                    fontSize: 10,
                    color: "#b0b0d0",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12, color: "#a0a0c0", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {result.rb.description}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {result.rb.bestProducts.map((product) => (
              <span
                key={product}
                style={{
                  padding: "3px 10px",
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}40`,
                  borderRadius: 2,
                  fontSize: 10,
                  color: accentColor,
                }}
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === "collection" && (
        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {collection.length === 0 && (
            <div style={{ padding: "20px 16px", color: "#6868a0", fontSize: 11 }}>
              ROLL TO BUILD COLLECTION
            </div>
          )}
          {collection.map((entry, index) => (
            <div
              key={`${entry.lane}-${index}`}
              style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 3,
                  color: LANES[entry.lane].color,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Prompt {index + 1} - {entry.lane} | {entry.ratio}
              </div>
              <div style={{ fontSize: 11, color: "#9898b8", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.7 }}>
                {entry.positive}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.005)",
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#5858a0", textTransform: "uppercase", marginBottom: 6 }}>
          Version Log {versionLogValue ? "- saved" : ""}
        </div>
        {versionLogValue && <div style={{ fontSize: 11, color: "#7878a8", marginBottom: 6 }}>{versionLogValue}</div>}
        <div className="responsive-log-row" style={{ display: "flex", gap: 7 }}>
          <input
            className="text-input"
            value={logInput}
            onChange={(event) => setLogInput(event.target.value)}
            placeholder="Note what worked, what to adjust..."
            style={{ flex: 1 }}
          />
          <button className="pill" onClick={onSaveLog} style={{ color: accentColor, borderColor: `${accentColor}44`, background: `${accentColor}15` }}>
            Save
          </button>
        </div>
      </div>

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
          {ratioInfo[result.ratio]?.use}
        </div>
        <div style={{ fontSize: 9, color: "#6060a0", letterSpacing: 2 }}>
          {tab === "combined"
            ? "PLAIN TEXT"
            : tab === "nano"
              ? "NANO BANANA JSON"
              : tab === "chatgpt"
                ? "GPT-4O JSON"
                : tab === "etsy"
                  ? "ETSY LISTING"
                  : tab === "redbubble"
                    ? "REDBUBBLE LISTING"
                    : "MINI-COLLECTION"}
        </div>
      </div>
    </div>
  );
});
