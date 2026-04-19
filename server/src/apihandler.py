from flask import Flask, request, jsonify
from flask_cors import CORS
import datahandler as dh
import yfinance as yf


# create flask app and specify webpack origins allowed to connect
app = Flask(__name__)
cors = CORS(app, origins='*')

# handle api requests for historical stock data
@app.route("/api/historical/<ticker>")
def getHistorical(ticker):
    range = request.args.get("range","1mo")
    interval = request.args.get("interval","1d")
    symbol = dh.searchSymbolOrSimilar(ticker)
    if not symbol:
        app.logger.info('Could not find ticker or similar for: %s',ticker)
        return jsonify({'error':'nullTicker'}),404
    stock = yf.Ticker(symbol)
    try:
        data = dh.getHistoricalData(stock,range,interval)
    except Exception as e:
        app.logger.info(f"ERROR: getHistoricalData failed: {e}")
        return jsonify({'error':'an unexpected error occured'}),500
    if not data:
        app.logger.info('no historical data could be retrieved for ticker: %s range: %s interval: %s',ticker, range, interval)
        return jsonify({'error':'nullData'}),400
    app.logger.info('processed request for ticker: %s range: %s interval: %s | response data set: %d rows',ticker,range,interval,len(data))
    return jsonify(data)

@app.route("/api/historical/<ticker>/latest")
def getLatestHistorical(ticker):
    symbol = dh.searchSymbolOrSimilar(ticker)
    if not symbol:
        app.logger.info('Could not find ticker or similar for: %s',ticker)
        return jsonify([]),404
    stock = yf.Ticker(symbol)
    data = dh.getHistoricalData(stock,range)
    if not data:
        print("bad time frame")
        return jsonify({'error':'badTimeframe'})
    lastDataPoint = data.tail(1)
    lastDataPoint["Date"] = lastDataPoint["Date"].astype(str)
    return jsonify(lastDataPoint.to_dict(orient="records")[0])

@app.route("/api/status",methods=['GET'])
def status():
    package = {'message':'api endpoint is active'}
    return jsonify(package)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message':'not found'}),404

if __name__=="__main__":
    app.run(debug=True,port=8080)
    