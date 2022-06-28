import * as requests from './requests'
import Invoice from './requests'
import * as routing from './routing'
import PaymentRoute from './routing/PaymentRoute'

let components = {
  requests,
  routing,
  Invoice,
  PaymentRoute,
}

export default components

export {Invoice, PaymentRoute, requests, routing}
