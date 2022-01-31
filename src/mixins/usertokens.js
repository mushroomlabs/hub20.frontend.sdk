import {mapActions, mapGetters, mapState} from 'vuex'

import {convertToToken} from '../api/tokens'

import {NULL_ADDRESS} from './tokens'

export const UserTokenMixin = {
  computed: {
    ...mapState('tokens', ['userTokens', 'userTokenLists']),
    ...mapGetters('tokens', ['userTokenListsByUrl', 'userTokensByUrl', 'tokensByUrl']),
    userTokenOptions() {
      return Object.values(this.userTokensByUrl).map(userToken => {
        const address = (userToken.address == NULL_ADDRESS) ? 'Native token' : userToken.address

        return {
          value: userToken.token,
          text: `${userToken.name} (${userToken.symbol}) - ${address} @ chain #${userToken.chain_id}`,
        }
      })
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
