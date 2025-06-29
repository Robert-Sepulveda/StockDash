from plotly import graph_objects as go
import pandas as pd
import talib
import numpy as np
import yfinance as yf
from datetime import datetime

def candlePlot(timeStamps,opens,highs,lows,closes,name,fig):
    fig.add_trace(go.Candlestick(x=timeStamps,open=opens,high=highs,low=lows,close=closes, name=name))

def bollingerBandPlot(closes,timeStamps,fig):
    npcloses = np.array(closes)
    upper, middle, lower = talib.BBANDS(npcloses,timeperiod=20,nbdevdn=2,matype=0)

    fig.add_trace(go.Scatter(x=timeStamps,y=upper,line=dict(color='blue'),name='BB Upper'))
    fig.add_trace(go.Scatter(x=timeStamps,y=lower,line=dict(color='lightblue'),name='BB Lower'))
    fig.add_trace(go.Scatter(x=timeStamps,y=middle,line=dict(color='green'),name='BB Middle'))

def getTicker(symbol):
    dat = yf.Ticker(symbol)
    if(dat.get_info()['trailingPegRatio'] == None):
        return 'error'
    return dat

def getHistoricalData(dat,timeframe):
    if timeframe in ['1mo','6mo','ytd','1y','5y','max']:
        step = '1d'
        data = dat.history(timeframe,step)
    elif timeframe in ['1d','5d']:
        step = '1m'
        data = dat.history(timeframe,step)
        data = pd.concat([data, dat.history(timeframe,step,prepost=True)])
    else:
        return pd.DataFrame()
    
    return data




        

