import { useState, useEffect } from 'react'
import './App.css'
import {io} from 'socket.io-client';
import axios from 'axios'
import Plot from 'react-plotly.js'
// const socket = io.connect("http://127.0.0.1:5000")


function App() {
  const [plot, setPlot] = useState([])
  const [symbol, setSymbol] = useState('')
  const [timeframe,setTimeframe] = useState('1d')
  const [graphTitle, setTitle] = useState('')
  const [isGraph, setIsGraph] = useState(false)
  const [ticker, setTicker] = useState('')

  const postAPI=async(symbol,timeframe)=>{
    const response = await axios.post("http://127.0.0.1:8080/api/historical", {
      symbol: symbol,
      timeframe: timeframe,
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
    })
    if(response.data['error'])
    {
      setPlot([])
      if(response.data['error'] == 'badSymbol')
        setTitle('failed to fetch symbol, or symbol does not exist')
      else
        setTitle('some error occurred fetching data')
    }
    else
    {
      setPlot(JSON.parse(response.data['graph']))
      setTitle(response.data['graphTitle'])
      setIsGraph(true)
      setSymbol(symbol)
    }
  }

  // function requestTicker(symbol) {
  //   if(ticker != symbol)
  //   {
  //     socket.emit("liveticker", {symbol: symbol})
  //   }
  //   setTicker(symbol)
  // }

  function searchSymbol() {
    postAPI(symbol,timeframe)
    // requestTicker(symbol)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    searchSymbol()
  }

  function searchTime(tf) {
    document.querySelector('.selected').classList.remove('selected')
    event.target.classList.add('selected')
    setTimeframe(tf)
    postAPI(symbol,tf)
  }

  // useEffect(() => {
  //   socket.on("recieve_ticker", (data) => {
  //     if(data.error)
  //       alert(data.error)
  //     else
  //       console.log(data)
  //   })
  //   socket.on("receive_update", (data) => {
  //     console.log(data)
  //   })
  // }, [socket])

  return (
    <>
    <h1>StockDash</h1>
    <div>
      <form onSubmit={handleSubmit}>
          <input type="text" placeholder="AAPL..." name="symbol" onChange={e => setSymbol(e.target.value)}/>
          <button type="submit">Search</button>
      </form>
    </div>
    <div>
      
      <div>
        <h2>{graphTitle}</h2>
        {/*  TODO: SOCKET LIVE TICKER
        <h2 className = "liveTick" >price</h2>
        <h3 className = "liveTick" >change</h3>
        <h3 className = "liveTick" >(percent)</h3>
        */}
      </div>
      
      <div>
        <div>
          {isGraph&&<button className = "tf selected" onClick={e=>searchTime('1d')}>1D</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('5d')}>5D</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('1mo')}>1M</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('6mo')}>6M</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('ytd')}>YTD</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('1y')}>1Y</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('5y')}>5Y</button>}
          {isGraph&&<button className = "tf" onClick={e=>searchTime('max')}>MAX</button>}
        </div>
        {plot.data&&<Plot data={plot.data} layout={plot.layout}/>}
      </div>
    </div>
    </>
  )
}

export default App