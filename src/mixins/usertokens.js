import {mapActions, mapGetters, mapState} from 'vuex'

import {convertToToken} from '../api/tokens.js'

export const UserTokenMixin = {
  computed: {
    ...mapState('tokens', ['userTokens']),
    ...mapGetters('tokens', ['userTokenListsByUrl', 'userTokensByUrl', 'tokensByUrl']),
    userTokenOptions() {
      return Object.values(this.userTokensByUrl).map(token => ({
        value: token.url,
        text: `${token.name} / ${token.symbol} / ${token.address}`,
      }))
    },
    userTokenListOptions() {
      return Object.values(this.userTokenListsByUrl).map(tokenList => ({
        value: tokenList.url,
        text: tokenList.name,
      }))
    },
  },
  methods: {
    ...mapActions('tokens', [
      'fetchUserTokens',
      'fetchUserToken',
      'fetchUserTokenLists',
      'fetchToken',
      'trackToken',
      'untrackToken',
    ]),
    isUserToken(token) {
      return this.token && this.userTokens.map(userToken => userToken.token).includes(token.url)
    },
    asToken(userToken) {
      return convertToToken(userToken)
    }
  },
}

export default UserTokenMixin
