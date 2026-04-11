from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from plotly import graph_objects as go
from plotly import io
import yfinance as yf
import datahandler as dh
import time

# create flask app and specify webpack origins allowed to connect
app = Flask(__name__)
cors = CORS(app, origins='*')

# handle api requests for historical stock data
@app.route("/api/historical",methods=['POST','GET'])
def get_plot():
    msg = request.get_json()
    symbol = msg['symbol']
    timeframe = msg['timeframe']
    dat = dh.getTicker(symbol)
    if(dat=='error'):
        return jsonify({'error':'badSymbol'})
    data = dh.getHistoricalData(dat,timeframe)
    if(data.empty):
        print("bad time frame")
        return jsonify({'error':'badTimeframe'})
    fig = go.Figure()
    candleLegend = msg['symbol'] + " Market Data"
    dh.candlePlot(data.index,data.Open,data.High,data.Low,data.Close,candleLegend,fig)
    if(timeframe in ['6mo','ytd','1y']):
        dh.bollingerBandPlot(data.Close,data.index,fig)
    fig.update_layout(xaxis_rangeslider_visible=False, template='plotly_dark')
    graphJSON = io.to_json(fig, pretty=True)
    graphTitle = dat.info['shortName'] + " (" + msg['symbol'].upper() + ")"
    jsonData = {'graphTitle':graphTitle,'graph':graphJSON,'timeframe':timeframe}
    return jsonify(jsonData)
        
    

if __name__=="__main__":

    app.run(debug=True,port=8080)
    