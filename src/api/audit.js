import client from './client'

export default {
  _client: client,
  getAccountingReport() {
    return this._client.get('/accounting/reporting')
  },
  getWalletBalances(chainId) {
    return this._client.get(`/accounting/wallets`)
  }
}
