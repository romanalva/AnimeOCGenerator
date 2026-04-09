export function HistoryPanel({
  history,
  favorites,
  lanes,
  favId,
  onLoad,
  onToggleFav,
  isFav,
}) {
  const merged = [
    ...favorites.map((entry) => ({ ...entry, _fav: true })),
    ...history.filter(
      (entry) => !favorites.some((favorite) => favId(favorite) === favId(entry)),
    ),
  ].slice(0, 14);

  return (
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
        <span>* {favorites.length} FAVORITED</span>
      </div>

      {merged.map((entry, index) => (
        <div
          key={`${entry.lane}-${entry.env}-${index}`}
          onClick={() => onLoad(entry)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            cursor: "pointer",
          }}
        >
          {entry._fav && <span style={{ color: "#fbbf24", fontSize: 10 }}>*</span>}
          <span
            style={{
              fontSize: 9,
              color: lanes[entry.lane].color,
              letterSpacing: 2,
              textTransform: "uppercase",
              width: 92,
              flexShrink: 0,
            }}
          >
            {entry.lane}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#8888b0",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {entry.env} - {entry.mood}
          </span>
          <button
            className="icon-btn"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFav(entry);
            }}
          >
            <span style={{ color: isFav(entry) ? "#fbbf24" : "#585878" }}>*</span>
          </button>
        </div>
      ))}
    </div>
  );
}
