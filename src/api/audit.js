import client from './client'

export default {
  _client: client,
  getAccountingReport() {
    return this._client.get('/accounting/report')
  },
  getWalletBalances() {
    return this._client.get('/accounting/wallets')
  },
  getWalletBalance(walletAddress) {
    return this._client.get(`/accounting/wallets/${walletAddress}`)
  }
}
