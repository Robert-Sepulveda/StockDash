import { useState, useEffect, useRef } from 'react'
import './styles/App.css'
import { fetchStock } from './api'
import { formatStockData } from './formatData'
import CandleChart from './components/CandleChart'

const RANGES = {
  "1D" : {range:"1d", interval:"day"},
  "5D" : {range:"5d", interval:"day"},
  "1M" : {range:"1mo", interval:"month"},
  "6M" : {range:"6mo", interval:"month"},
  "YTD": {range:"ytd", interval:"year"},
  "1Y" : {range:"1y", interval:"year"},
  "5Y" : {range:"5y", interval:"year"},
  "All" : {range:"max", interval:"max"}
}
const INTERVALS_BY_RANGE = {
  "day": {
    "1 min" : {interval:"1m"},
    "2 min" : {interval:"2m"},
    "3 min" : {interval:"3m"},
    "5 min" : {interval:"5m"},
    "15 min" : {interval:"15m"},
    "30 min" : {interval:"30m"},
    "1 hour" : {interval:"1h"}
  },
  "month": {
    "1 hour" : {interval:"1h"}, 
    "4 hour" : {interval:"4h"}, 
    "1 day" : {interval:"1d"}, 
    "1 week" : {interval:"1wk"}
  },
  "year": {
    "1 day" : {interval:"1d"},
    "1 week" : {interval:"1wk"},
    "1 month" : {interval:"1mo"},
    "3 month" : {interval:"3mo"},
  },
  "max": {
    "1 month" : {interval:"1mo"},
    "3 month" : {interval:"3mo"}
  }
}

function App() {
  const [data, setData] = useState([])
  const [range, setRange] = useState("1D")
  const [interval, setInterval] = useState("1m")
  const [ticker, setTicker] = useState("AAPL")
  const [inputTicker, setInputTicker] = useState("AAPL")
  const intervalRef = useRef(null)
  const availableIntervals = INTERVALS_BY_RANGE[RANGES[range].interval];

  const loadData = async (symbol, r, interval) => {
    const {range} = RANGES[r]
    const raw = await fetchStock(symbol, range, interval)
    if (!raw.length) {
      console.error("No data found for ticker");
    }
    else
    {
      const formatted = formatStockData(raw)
      
      setData(formatted)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setTicker(inputTicker.toUpperCase())
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    loadData(ticker,range,interval)
    // intervalRef.current = setInterval(() => {
    //   loadData(ticker,range,interval)
    // }, 10000000000)

    return () => clearInterval(intervalRef.current)
  }, [ticker,range,interval])

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
      <div className="chart-container">
        <CandleChart key={range + ticker + interval} data={data} range={range} />
      </div>
      <div className="range-buttons">
        {Object.keys(RANGES).map(range => (
          <button onClick={() => setRange(range)}>
            {range}
          </button>
        ))}
        <select className="interval-select" value={interval} onChange={e=>setInterval(e.target.value)}>
          {Object.entries(availableIntervals).map(([key, value]) => (
            <option key={key} value={value.interval}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default App