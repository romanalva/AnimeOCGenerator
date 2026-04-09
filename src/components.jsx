import { RATIO_INFO } from "./data";

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

function themedSurface(hex, intensity = 0.18, base = 10) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(base + (channel - base) * intensity);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function themedBorder(hex, alpha = 0.42) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function RatioPreview({ ratio, color }) {
  if (!ratio || !RATIO_INFO[ratio]) {
    return null;
  }

  const { w, h } = RATIO_INFO[ratio];
  const maxW = 48;
  const maxH = 36;
  const scale = Math.min(maxW / w, maxH / h);
  const previewWidth = Math.round(w * scale);
  const previewHeight = Math.round(h * scale);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: maxW,
        height: maxH,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: previewWidth,
          height: previewHeight,
          border: `1px solid ${color}66`,
          background: `${color}10`,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 7, color: `${color}99`, letterSpacing: 1 }}>
          {ratio}
        </span>
      </div>
    </div>
  );
}

export function SlotRow({
  label,
  value,
  options,
  helperText,
  spinning,
  locked,
  onToggleLock,
  onChange,
  color,
  last,
}) {
  const isMulti = Array.isArray(value);
  const renderedValue = isMulti ? value : [value];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "7px 14px",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <button
        onClick={onToggleLock}
        title={locked ? "Unlock" : "Lock"}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px 3px",
          flexShrink: 0,
          marginTop: 1,
          fontSize: 11,
          color: locked ? color : "#585878",
          transition: "color 0.2s",
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
          width: 90,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {options?.length ? (
          <>
            <select
              multiple={isMulti}
              value={renderedValue}
              onChange={(event) => {
                if (!onChange) {
                  return;
                }
                if (isMulti) {
                  const nextValues = Array.from(
                    event.target.selectedOptions,
                    (option) => option.value,
                  );
                  if (nextValues.length) {
                    onChange(nextValues);
                  }
                  return;
                }
                onChange(event.target.value);
              }}
              style={{
                width: "100%",
                minHeight: isMulti ? 78 : "auto",
                background: themedSurface(color, 0.18, 10),
                border: `1px solid ${locked ? themedBorder(color, 0.55) : themedBorder(color, 0.34)}`,
                borderRadius: 2,
                color: "#f7f7fb",
                animation: spinning ? "flicker 0.12s infinite" : "none",
                opacity: spinning ? 0.7 : 1,
                transition: "color 0.15s,border-color 0.15s",
                fontSize: 11,
                lineHeight: 1.5,
                fontFamily: "inherit",
                padding: isMulti ? 8 : "7px 10px",
              }}
            >
              {options.map((option) => (
                <option
                  key={option}
                  value={option}
                  style={{
                    color: "#f7f7fb",
                    background: themedSurface(color, 0.24, 12),
                  }}
                >
                  {option}
                </option>
              ))}
            </select>
            {helperText && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  lineHeight: 1.4,
                  color: "#7070a8",
                  wordBreak: "break-word",
                }}
              >
                {helperText}
              </div>
            )}
          </>
        ) : (
          <span
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: spinning ? color : "#d4d4ec",
              animation: spinning ? "flicker 0.12s infinite" : "none",
              opacity: spinning ? 0.7 : 1,
              transition: "color 0.15s",
              wordBreak: "break-word",
            }}
          >
            {isMulti ? renderedValue.join(" | ") : value}
          </span>
        )}
      </div>
    </div>
  );
}
