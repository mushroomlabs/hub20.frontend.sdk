import client from './client'

export default {
  _client: client,
  getCredits() {
    return this._client.get('/my/credits')
  },
  getDebits() {
    return this._client.get('/my/debits')
  },
  getBalances() {
    return this._client.get('/my/balances')
  },
  getAccountDetails() {
    return this._client.get('/my/profile')
  },
  updateAccountDetails(data) {
    return this._client.patch('/my/profile', data)
  }
}
