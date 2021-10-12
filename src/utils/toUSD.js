export default function toUSD({ amount, currency }) {
  // Average rates year 2020 taken from https://www.exchangerates.org.uk/
  // Example: https://www.exchangerates.org.uk/NOK-USD-spot-exchange-rates-history-2020.html
  const rates = {
    EUR: 1.142,
    AUD: 0.69,
    NOK: 0.106,
    CAD: 0.746,
    GBP: 1.283,
    DKK: 0.153,
    SEK: 0.109,
  }

  return amount * rates[currency]
}
