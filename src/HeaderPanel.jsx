import { LANES, RATIO_INFO } from "./data";

export function HeaderPanel({ accentColor, result, rolling }) {
  return (
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
          textShadow: `0 0 35px ${accentColor}55`,
        }}
      >
        PROMPT GENERATOR
      </div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: accentColor, marginTop: 5, minHeight: 14 }}>
        {result
          ? `${LANES[result.lane].tag} | ${result.ratio} | ${RATIO_INFO[result.ratio]?.px}`
          : rolling
            ? "ROLLING..."
            : "SELECT LANE AND ROLL"}
      </div>
    </div>
  );
}
