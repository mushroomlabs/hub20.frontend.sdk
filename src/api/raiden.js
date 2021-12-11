import client from './client'

export default {
  _client: client,
  getRaidenList() {
    return this._client.get('/raiden/nodes')
  },
  getRaiden(raidenId) {
    return this._client.get(`/raiden/nodes/${raidenId}`)
  },
  getRaidenChannels(raidenId) {
    return this._client.get(`/raiden/nodes/${raidenId}/channels`)
  }
}
