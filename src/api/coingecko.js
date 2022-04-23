import axios from 'axios'

export const API_ROOT_URL = 'https://api.coingecko.com/api/v3'
export const client = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getPlatforms() {
    return client.get(`${API_ROOT_URL}/asset_platforms`)
  },
  getTokenRates(tokenList, platformId, currencyCode) {
    const url = `${API_ROOT_URL}/simple/token_price/${platformId}`
    const params = {
      contract_addresses: tokenList.map(token => token.address).join(','),
      vs_currencies: currencyCode
    }
    return client.get(url, {params})
  },
}
