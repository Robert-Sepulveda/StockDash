import yfinance as yf

DAY_RANGES = ['1d','5d']
MONTH_RANGES = ['1mo','6mo']
YEAR_RANGES = ['ytd','1y','5y']
DAY_INTERVALS = ['1m','2m','3m','5m','15m','30m','1h']
MONTH_INTERVALS = ['1h', '4h', '1d', '1wk']
YEAR_INTERVALS = ['1d','1wk','1mo','3mo']

def searchSymbolOrSimilar(symbol):
    data = yf.Search(symbol, max_results=1, news_count=8)
    if not data.quotes:
        return None
    return data.quotes[0]['symbol']

def getHistoricalData(dat,range, interval):
    if range in DAY_RANGES and interval not in DAY_INTERVALS:
        interval = '1m'
    elif range in MONTH_RANGES and interval not in MONTH_INTERVALS:
        interval = '1d'
    elif range in YEAR_RANGES and interval not in YEAR_INTERVALS:
        interval = '1d'
    elif range == 'max' and interval != '1mo':
        interval = '1mo'
    try:
        data = dat.history(range,interval,prepost=False)
    except Exception as e:
        raise e
    data = data.drop(columns=["Dividends","Stock Splits"])
    data = data.reset_index()
    # sometimes datasets use the label Datetime instead of Date
    data = data.rename(columns={"Datetime": "Date"})
    data["Date"] = data["Date"].astype(str)
    data = data.round(2)
    return data.to_dict(orient='records')



        

