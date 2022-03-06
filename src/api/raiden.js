import client from './client'

export default {
  _client: client,
  getRaidenList() {
    return this._client.get('/networks/raiden/nodes')
  },
  getRaiden(raidenId) {
    return this._client.get(`/networks/raiden/nodes/${raidenId}`)
  },
  getRaidenChannels(raidenId) {
    return this._client.get(`/networks/raiden/nodes/${raidenId}/channels`)
  },
  getRaidenStatus(raidenId) {
    return this._client.get(`/networks/raiden/nodes/${raidenId}/status`)
  },
  getTokenNetworkList() {
    return this._client.get('/networks/raiden/token_networks')
  },
  getServiceDepositRequests(raidenId) {
    return this._client.get(`/networks/raiden/nodes/${raidenId}/deposits`)
  },
  createServiceDepositRequest(raidenId, amount) {
    return this._client.post(`/networks/raiden/nodes/${raidenId}/deposits`, {amount})
  },
  createChannelDepositRequest(raidenId, channelId, amount) {
    return this._client.post(`/networks/raiden/nodes/${raidenId}/channels/${channelId}/deposits`, {amount})
  },
  createChannelWithdrawalRequest(raidenId, channelId, amount) {
    return this._client.post(`/networks/raiden/nodes/${raidenId}/channels/${channelId}/withdrawals`, {amount})
  },
}
