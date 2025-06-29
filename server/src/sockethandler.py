from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import yfinance as yf
import datahandler as dh
import asyncio

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
yf.set_tz_cache_location("C:/Users/Bobby/AppData/Local/py-yfinance")
ws = yf.WebSocket()

@socketio.on('liveticker')
def handle(message):
    print(f'recieved message: {message}')
    symbol = message['symbol']
    dat = dh.getTicker(symbol)
    if(dat=='error'):
        socketio.emit("recieve_ticker",{'status':'error','message':'badSymbol'})
    else:
        ws.subscribe(symbol)
        ws.listen(message_handler)
        socketio.emit("received_ticker",{'status':'success','message':symbol})

@socketio.on('tickerUpdates')
def message_handler(message):
    print("Received message: ",message)
    socketio.emit("recieved_update",{'status':'update','message':message})
    

async def main():
    async with yf.AsyncWebSocket() as ws:
        ws.subscribe(["AAPL","BTC-USD"])
        ws.listen(message_handler)

if __name__=="__main__":
    socketio.run(app,debug=True,)

    
    