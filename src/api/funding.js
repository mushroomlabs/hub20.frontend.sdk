import client from './client'

export default {
  _client: client,
  createDeposit(token) {
    return this._client.post('/my/deposits', {
      token: token.url,
    })
  },
  getDeposits(params) {
    return this._client.get('/my/deposits', {params})
  },
  getDeposit(depositId) {
    return this._client.get(`/my/deposits/${depositId}`)
  },
  getDepositRoutes(deposit) {
    return this._client.get(`/my/deposits/${deposit.id}/routes`)
  },
  createRoute(deposit, network) {
    return this._client
      .post(`/my/deposits/${deposit.id}/routes`, {
        network: network.url,
      })
      .then(({data}) => this._client.get(data.url))
  },
  createPaymentOrder(token, amount) {
    return this._client.post('/payment/orders', {
      amount: amount,
      token: token.address,
    })
  },
  getPaymentOrder(orderId) {
    return this._client.get(`/payment/orders/${orderId}`)
  },
  cancelPaymentOrder(orderId) {
    return this._client.delete(`/payment/orders/${orderId}`)
  },
  getTransfers() {
    return this._client.get('/my/transfers')
  },
  getTransfer(transferId) {
    return this._client.get(`/my/transfers/${transferId}`)
  },
  scheduleTransfer(token, amount, network, options) {
    const url = `/networks/${network.id}/transfers`
    let payload = {
      amount: amount,
      token: token.url,
      ...options,
    }
    return this._client
      .post(url, payload)
      .then(({data}) => this._client.get(data.url))
  }
}
