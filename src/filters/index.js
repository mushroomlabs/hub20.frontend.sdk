export const toWei = function (token, amount) {
  return Math.floor(amount * 10 ** token.decimals)
}

export const shortAddress = function(address) {
  const stringSize = address.length
  const prefix = address.substr(0, 8)
  const suffix = address.substr(stringSize - 4, stringSize)
  return `${prefix}...${suffix}`
}

export const formattedAmount = function (amount, token, maxDigits) {

  const tokenSymbol = token && token.symbol || ''

  if (amount == 0) {
    return `0 ${tokenSymbol}`.trim()
  }

  let maximumSignificantDigits = maxDigits || token.decimals
  let formatter = new Intl.NumberFormat([], {maximumSignificantDigits})
  let formattedAmount = formatter.format(amount)
  return `${formattedAmount} ${tokenSymbol}`.trim()
}

export const formattedCurrency = function (amount, currencyCode) {
  if (!currencyCode) {
    return null
  }
  return new Intl.NumberFormat([], {style: 'currency', currency: currencyCode}).format(amount)
}

export const humanizeReference = function (referenceType, transactionType) {
  const credits = {
    transfer: 'Transfer Received',
    transferexecution: 'Transfer Received',
    paymentconfirmation: 'Payment Received',
  }

  const debits = {
    transfer: 'Transfer Submitted',
    transferexecution: 'Transfer Sent',
    paymentconfirmation: 'Payment Sent',
  }

  if (transactionType == 'credit') {
    return credits[referenceType]
  }

  if (transactionType == 'debit') {
    return debits[referenceType]
  }

  return 'N/A'
}

export default {toWei, shortAddress, formattedAmount, formattedCurrency, humanizeReference}
