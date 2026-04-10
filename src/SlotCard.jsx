import { memo } from "react";
import { RatioPreview, SlotRow } from "./components";

export const SlotCard = memo(function SlotCard({
  accentColor,
  laneTag,
  slots,
  slotDefinitions,
  rolling,
  locks,
  onToggleLock,
  onChangeField,
}) {
  return (
    <div
      style={{
        border: `1px solid ${accentColor}28`,
        borderRadius: 4,
        overflow: "hidden",
        background: "rgba(8,8,14,0.94)",
        marginBottom: 12,
        boxShadow: rolling ? `0 0 50px ${accentColor}28` : `0 0 40px ${accentColor}20`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          background: `${accentColor}08`,
          borderBottom: `1px solid ${accentColor}18`,
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: 4, color: accentColor, textTransform: "uppercase" }}>
          Roll - {slots ? laneTag : "READY"}
        </div>
        {slots && <RatioPreview ratio={slots.ratio} color={accentColor} />}
      </div>

      {slots ? (
        slotDefinitions.map(([label, key, value, options, helperText], index) => (
          <SlotRow
            key={label}
            label={label}
            value={value}
            options={options}
            helperText={helperText}
            spinning={rolling && !locks[key]}
            locked={Boolean(locks[key])}
            onToggleLock={() => onToggleLock(key)}
            onChange={(nextValue) => onChangeField?.(key, nextValue)}
            color={accentColor}
            last={index === slotDefinitions.length - 1}
          />
        ))
      ) : (
        <div style={{ padding: "28px 14px", fontSize: 10, letterSpacing: 4, color: "#585878" }}>
          READY - PRESS ROLL
        </div>
      )}
    </div>
  );
});
