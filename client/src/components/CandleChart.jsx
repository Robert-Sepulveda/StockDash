import React from "react"
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis, YAxis,
  CrossHairCursor,
  discontinuousTimeScaleProvider, 
  BarSeries,
  MouseCoordinateX, MouseCoordinateY,
  EdgeIndicator,
  LineSeries,
  StraightLine,
  ZoomButtons
} from "react-financial-charts"

const CandleChart = ({ data: initialData, range}) => {
  if (!initialData || initialData.length === 0) {
    return <div>Sorry, cannot display any information at this time</div>
  }
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
  const {
    data,
    xScale,
    xAccessor,
    displayXAccessor,
  } = React.useMemo(()=>xScaleProvider(initialData),[initialData])
  const lastPriceClose = data[data.length-1].close
  const firstPriceClose = data[0].close
  const isPriceUp = lastPriceClose >= data[data.length-2].close
  const lastPriceColor = isPriceUp ? "#26a69a" : "#ef5350"
  const showLastPrice = range === "1D"

  const [xExtentsState, setXExtentsState] = React.useState(()=>[
    xAccessor(data[data.length - 1]),
    xAccessor(data[0])
  ])

  const zoomIn = () => {
  setXExtentsState(prev => {
    const [start, end] = prev;
    const range = start - end;
    const newRange = range * 0.7;

    return [start, start - newRange];
  });
};

const zoomOut = () => {
  setXExtentsState(prev => {
    const [start, end] = prev;
    const range = start - end;
    const newRange = range * 1.3;

    return [start, start - newRange];
  });
};

  React.useEffect(() => {
  setXExtentsState([
      xAccessor(data[data.length - 1]),
      xAccessor(data[0])
    ])
  }, [data])

  return (
    <ChartCanvas
      clamp={true}
      height={500}
      width={Math.min(1200, window.innerWidth)}
      margin={{
        left: 60,
        right: 90,
        top: 20,
        bottom: 60
      }}
      ratio={1}
      data={data}
      seriesName="Stock"
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtentsState}
    >
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>−</button>
      </div>
      <Chart id={1} yExtents={d => [d.high, d.low]}>
        <XAxis className="x-axis" strokeStyle="#1a1a1a" showTicks={false} tickLabelFill="white"/>
        <YAxis strokeStyle="#1a1a1a" showGridLines={true} gridLinesStrokeWidth={0.4} showTicks={false} ticks={5} tickLabelFill="white"/>
        <CrossHairCursor/>
        <MouseCoordinateX at="bottom" displayFormat={d => d.toLocaleDateString()}/>
        <MouseCoordinateY at="right" orient="right" dx={30} displayFormat={d => d.toFixed(2)}/>
        <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={()=>lastPriceClose} fill={lastPriceColor} displayFormat={d=>d.toFixed(2)}/>
        <StraightLine lineDash={'ShortDash'} yValue={lastPriceClose} strokeStyle={lastPriceColor}/>
        {showLastPrice && (
          <>
            <StraightLine lineDash={'ShortDash'} yValue={firstPriceClose} strokeStyle="gray"/>
            <EdgeIndicator itemType="last" yAccessor={()=>firstPriceClose}/>
          </> 
        )}
        <CandlestickSeries widthRatio={0.6}/>
      </Chart>
      <Chart id={2} height={100} origin={(w,h) => [0,h-100]} yExtents={d=>d.volume}>
        <BarSeries yAccessor={d=>d.volume} fillStyle={d => d.close > d.open ? "#26a6997c" : "#ef535077"}/>
      </Chart>
    </ChartCanvas>
  )
}

export default CandleChart