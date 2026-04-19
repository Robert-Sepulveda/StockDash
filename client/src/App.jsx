import { useState, useEffect, useRef } from 'react'
import './styles/App.css'
import { fetchStock } from './api'
import { formatStockData } from './formatData'
import CandleChart from './components/CandleChart'

const RANGES = {
  "1D" : {range:"1d"},
  "5D" : {range:"5d"},
  "1M" : {range:"1mo"},
  "6M" : {range:"6mo"},
  "YTD": {range:"ytd"},
  "1Y" : {range:"1y"},
  "5Y" : {range:"5y"},
  "All" : {range:"max"}
}

function App() {
  const [data, setData] = useState([])
  const [range, setRange] = useState("1M")
  const [ticker, setTicker] = useState("AAPL")
  const [inputTicker, setInputTicker] = useState("AAPL")
  const intervalRef = useRef(null)

  const loadData = async (symbol, r) => {
    const {range} = RANGES[r]
    const raw = await fetchStock(symbol, range)
    if (!raw.length) {
      console.error("No data found for ticker");
    }
    const formatted = formatStockData(raw)
    
    setData(formatted)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setTicker(inputTicker.toUpperCase())
  }

  useEffect(() => {
    loadData(ticker,range)
  }, [ticker,range])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      loadData(ticker,range)
    }, 10000000000)

    return () => clearInterval(intervalRef.current)
  }, [ticker,range])

  return (
    <div className="app-container">
      <h1>StockDash</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          placeholder="Enter ticker"
        />
        <button type="submit">Search</button>
      </form>
      <div className="range-buttons">
        {Object.keys(RANGES).map(range => (
          <button key={range} onClick={() => setRange(range)}>
            {range}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <CandleChart key={range + ticker} data={data} range={range} />
      </div>
    </div>
  );
}

export default App