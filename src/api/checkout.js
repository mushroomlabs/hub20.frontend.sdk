import client from './client'

export default {
  _client: client,
  create({storeData, token, tokenAmount, externalIdentifier}) {
    const payload = {
      store: storeData.id,
      token: token.url,
      amount: tokenAmount,
      external_identifier: externalIdentifier
    }
    return this._client.post('/checkout', payload)
  }
}
