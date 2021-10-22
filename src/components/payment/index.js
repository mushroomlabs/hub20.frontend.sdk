import * as requests from './requests'
import {PaymentRequest as Invoice} from './requests'
import * as routing from './routing'

let components = {
  requests,
  routing,
  Invoice
}

export default components

export {Invoice, requests, routing}
