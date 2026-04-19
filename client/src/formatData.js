export function formatStockData(data) {
  return data.map(d => ({
    date: new Date(d.Date),
    open: Number(d.Open),
    high: Number(d.High),
    low: Number(d.Low),
    close: Number(d.Close),
    volume: Number(d.Volume),
  }))
}