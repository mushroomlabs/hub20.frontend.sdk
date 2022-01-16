import Vue from 'vue'

import client from '../api/tokens'

export const TOKEN_FETCH_COLLECTION = 'TOKEN_FETCH_COLLECTION'
export const TOKEN_FETCH_SINGLE = 'TOKEN_FETCH_SINGLE'
export const TOKEN_FETCH_FAILURE = 'TOKEN_FETCH_FAILURE'
export const TOKEN_UPDATE_TRANSFER_COST = 'TOKEN_UPDATE_TRANSFER_COST'

export const TOKEN_NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETHEREUM_NETWORKS = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
}

// This token list is used mostly for testing purposes. We need a set
// of tokens that which have a known address in the mainnet and that
// can be determined by their symbol
export const BASE_TOKEN_LIST = {
  ABT: '0xb98d4c97425d9908e66e53a6fdf673acca0be986',
  ABYSS: '0x0E8d6b471e332F140e7d9dbB99E5E3822F728DA6',
  ADX: '0x4470BB87d77b963A013DB939BE332f927f2b992e',
  AION: '0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
  APPC: '0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db',
  AST: '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
  BAM: '0x22b3faaa8df978f6bafe18aade18dc2e3dfa0e0c',
  BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  BBO: '0x84f7c44b6fed1080f647e354d552595be2cc602f',
  BIX: '0xb3104b4B9Da82025E8b9F8Fb28b3553ce2f67069',
  BLZ: '0x5732046a883704404f284ce41ffadd5b007fd668',
  BNT: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
  BQX: '0x5af2be193a6abca9c8817001f45744777db30756',
  CDT: '0x177d39AC676ED1C67A2b268AD7F1E58826E5B0af',
  CHAT: '0x442bc47357919446eabc18c7211e57a13d983469',
  CND: '0xd4c435f5b09f855c3317c8524cb1f586e42795fa',
  CNN: '0x8713d26637CF49e1b6B4a7Ce57106AaBc9325343',
  COFI: '0x3136ef851592acf49ca4c825131e364170fa32b3',
  CVC: '0x41e5560054824ea6b0732e656e3ad64e20e94e45',
  DAI: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  DCC: '0xFFa93Aacf49297D51E211817452839052FDFB961',
  DTH: '0x5adc961D6AC3f7062D2eA45FEFB8D8167d44b190',
  DGX: '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf',
  DTA: '0x69b148395ce0015c13e36bffbad63f49ef874e03',
  EDU: '0xf263292e14d9d8ecd55b58dad1f1df825a874b7c',
  EKO: '0xa6a840E50bCaa50dA017b91A0D86B8b2d41156EE',
  ELEC: '0xd49ff13661451313ca1553fd6954bd1d9b6e02b9',
  ELF: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
  ENG: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
  ENJ: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  EQUAD: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  EURS: '0xdB25f211AB05b1c97D595516F45794528a807ad8',
  GEN: '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf',
  GNO: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
  GTO: '0xc5bbae50781be1669306b9e001eff57a2957b09d',
  IOST: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
  INF: '0x00E150D741Eda1d49d341189CAE4c08a73a49C95',
  KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  LBA: '0xfe5f141bf94fe84bc28ded0ab966c16b17490657',
  LEND: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
  LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
  LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  MAS: '0x23Ccc43365D9dD3882eab88F43d515208f832430',
  MCO: '0xB63B606Ac810a52cCa15e44bB630fd42D8d1d83d',
  MDS: '0x66186008C1050627F979d464eABb258860563dbE',
  MLN: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
  MOC: '0x865ec58b06bf6305b886793aa20a2da31d034e68',
  MOT: '0x263c618480dbe35c300d8d5ecda19bbb986acaed',
  MTL: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
  MYB: '0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc',
  NPXS: '0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3',
  OCN: '0x4092678e4E78230F46A1534C0fbc8fA39780892B',
  OMG: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
  OST: '0x2C4e8f2D746113d0696cE89B35F0d8bF88E0AEcA',
  PAL: '0xfedae5642668f8636a11987ff386bfd215f942ee',
  PAX: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
  PAY: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280',
  POE: '0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195',
  POLY: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
  POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
  PRO: '0x226bb599a12C826476e3A771454697EA52E9E220',
  RCN: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
  RDN: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
  REN: '0x408e41876cccdc0f92210600ef50372656052a38',
  REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  REQ: '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
  RLC: '0x607F4C5BB672230e8672085532f7e901544a7375',
  SALT: '0x4156d3342d5c385a87d264f90653733592000581',
  SNT: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
  SPN: '0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a',
  SSP: '0x624d520BAB2E4aD83935Fa503fB130614374E850',
  STORM: '0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433',
  SUB: '0x12480e24eb5bec1a9d4369cab6a80cad3c0a377a',
  SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  TOMO: '0x8b353021189375591723E7384262F45709A3C3dC',
  TTC: '0x9389434852b94bbaD4c8AfEd5B7BDBc5Ff0c2275',
  TUSD: '0x8dd5fbce2f6a956c3022ba3663759011dd51e73e',
  UPP: '0xc86d054809623432210c107af2e3f619dcfbf652',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  WABI: '0x286BDA1413a2Df81731D4930ce2F862a35A609fE',
  WAX: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  WINGS: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
  ZRX: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
}

const initialState = () => ({
  tokens: [],
  transferCosts: {},
  errors: [],
  initialized: false,
})

const getters = {
  tokensByUrl: state =>
    state.tokens.reduce((acc, token) => Object.assign({[token.url]: token}, acc), {}),
  nativeTokens: state => state.tokens.filter(token => token.address == TOKEN_NULL_ADDRESS),
  nativeTokensByChain: (_, getters) =>
    getters.nativeTokens.reduce(
      (acc, token) => Object.assign({[token.network_id]: token}, acc),
      {}
    ),
  nativeToken: (_, getters) => chainId => getters.nativeTokensByChain[chainId],
}

const actions = {
  fetchTokens({commit}, filterOptions) {
    return client
      .getList(filterOptions)
      .then(({data}) => commit(TOKEN_FETCH_COLLECTION, data))
      .catch(error => commit(TOKEN_FETCH_FAILURE, error))
  },
  fetchToken({commit, getters}, tokenUrl) {
    if (!getters.tokensByUrl[tokenUrl]) {
      return client.getToken(tokenUrl).then(({data}) => commit(TOKEN_FETCH_SINGLE, data))
    }
  },
  fetchTransferCostEstimate({commit}, token) {
    return client
      .getTransferCostEstimate(token)
      .then(({data}) => commit(TOKEN_UPDATE_TRANSFER_COST, {token, weiAmount: data}))
  },
}

const mutations = {
  [TOKEN_FETCH_FAILURE](state, error) {
    state.errors.push(error)
  },
  [TOKEN_FETCH_COLLECTION](state, data) {
    state.tokens.concat(data)
    Vue.set(state, 'tokens', [...state.tokens])
  },
  [TOKEN_FETCH_SINGLE](state, data) {
    state.tokens.push(data)
  },
  [TOKEN_UPDATE_TRANSFER_COST](state, {token, weiAmount}) {
    Vue.set(state.transferCosts, token.url, weiAmount)
  },
}

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
}
