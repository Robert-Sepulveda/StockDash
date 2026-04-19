export async function fetchStock(symbol,range) {
  const response = await fetch(`http://127.0.0.1:8080/api/historical/${symbol}?range=${range}`)
  console.log(response)
  return response.json()
}