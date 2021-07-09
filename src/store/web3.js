import {ethers} from 'ethers'

export const WEB3_CONNECT_BEGIN = 'WEB3_CONNECT_BEGIN'
export const WEB3_CONNECT_FAILURE = 'WEB3_CONNECT_FAILURE'
export const WEB3_TRANSFER_FAILURE = 'WEB3_TRANSFER_FAILURE'
export const WEB3_ADD_TRANSACTION = 'WEB3_ADD_TRANSACTION'
export const WEB3_SET_ACCOUNT = 'WEB3_SET_ACCOUNT'
export const WEB3_RESET_ACCOUNT = 'WEB3_RESET_ACCOUNT'

const EIP20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]

const initialState = () => ({
  selectedAccount: null,
  transactions: [],
  error: null,
})

const getters = {
  hasWeb3: () => Boolean(typeof window.ethereum !== 'undefined'),
  isMetamask: (_, getters) => getters.hasWeb3 && window.ethereum.isMetamask,
}

const actions = {
  setAccount({commit}, account) {
    commit(WEB3_SET_ACCOUNT, account)
  },
  makeTransfer({dispatch}, {token, amount, recipientAddress}) {
    if (parseInt(token.address)) {
      return dispatch('sendErc20', {token, recipientAddress, amount})
    } else {
      return dispatch('sendEther', {recipientAddress, amount})
    }
  },
  sendEther({commit, state}, {amount, recipientAddress}) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const params = [
      {
        from: state.selectedAccount,
        to: recipientAddress,
        value: ethers.utils.parseUnits(amount.toFixed(18), 'ether').toHexString(),
      },
    ]
    return provider
      .send('eth_sendTransaction', params)
      .then(tx => commit(WEB3_ADD_TRANSACTION, tx))
  },
  sendErc20({commit}, {token, amount, recipientAddress}) {
    const weiAmount = ethers.utils.parseUnits(amount.toFixed(token.decimals), token.decimals)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc20Contract = new ethers.Contract(token.address, EIP20_ABI, provider)
    const erc20WithSigner = erc20Contract.connect(signer)
    return erc20WithSigner
      .transfer(recipientAddress, weiAmount)
      .then(tx => commit(WEB3_ADD_TRANSACTION, tx))
  },
}

const mutations = {
  [WEB3_SET_ACCOUNT](state, account) {
    state.selectedAccount = account
  },
  [WEB3_RESET_ACCOUNT](state) {
    state.selectedAccount = null
  },
  [WEB3_CONNECT_BEGIN](state, accountAddress) {
    state.selectedAddress = accountAddress
    state.error = null
  },
  [WEB3_CONNECT_FAILURE](state, error) {
    state.selectedAddress = null
    state.error = error
  },
  [WEB3_TRANSFER_FAILURE](state, error) {
    state.error = error
  },
  [WEB3_ADD_TRANSACTION](state, transactionHash) {
    state.transactions.push(transactionHash)
  },
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations,
}
