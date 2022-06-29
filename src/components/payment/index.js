import * as requests from './requests'
import * as routing from './routing'
import * as tracking from './tracking'
import PaymentRoute from './routing/PaymentRoute'
import PaymentList from './tracking/PaymentList'
import Invoice from './requests'

let components = {
  Invoice,
  PaymentList,
  PaymentRoute,
  requests,
  routing,
  tracking,
}

export default components

export {Invoice, PaymentList, PaymentRoute, requests, routing, tracking}
