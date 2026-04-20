const ControlBar = ({
  range,
  setRange,
  interval,
  setInterval,
//   zoomIn,
//   zoomOut,
//   jumpToLatest
}) => {
  const ranges = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "ALL"]

  return (
    <div style={styles.container}>
      
      {/* Timeframe buttons */}
      <div style={styles.group}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              ...styles.button,
              ...(range === r ? styles.active : {})
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={styles.divider}>|</div>

      <div style={styles.group}>
        <span style={{ marginRight: 6 }}>Interval:</span>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          style={styles.dropdown}
        >
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
        </select>
      </div>

      <div style={styles.divider}>|</div>

      <div style={styles.group}>
        <button onClick={zoomIn} style={styles.button}>+</button>
        <button onClick={zoomOut} style={styles.button}>−</button>
        <button onClick={jumpToLatest} style={styles.button}>{">>"}</button>
      </div>

    </div>
  )
}

export default ControlBar