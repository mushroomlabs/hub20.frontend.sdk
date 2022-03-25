# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2022-03-25

### Changed

 - Simple patch version bump

## [0.4.1] - 2022-03-06

### Added

 - Support for channel withdrawal requests on raiden module
 - add methods to token store/api modules to manage native tokens

### Changed

 - Update raiden module to reflect changes in REST API related to operation orders
 - Accounting module does not include information about wallet balances
 - Separated endpoints/vuex store actions transfers. Now there are
   transfers (internal movements) and withdrawals (payouts to
   addresses/accounts outside of Hub)

### Removed
 - Users can not submit their own token entries.
