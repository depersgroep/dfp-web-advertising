# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

####[Added] for new features.
####[Changed] for changes in existing functionality.
####[Deprecated] for once-stable features removed in upcoming releases.
####[Removed] for deprecated features removed in this release.
####[Fixed] for any bug fixes.
####[Security] to invite users to upgrade in case of vulnerabilities.

## [4.0.1] - 2018-06-04
### Fixed
- Auto convert boolean nonPersonalizedAds to tinyint

## [4.0.0] - 2018-05-23
### Added
- Added nonPersonalizedAds service (GDPR)
- Added targeted global-targeting parameter

## [3.3.2] - 2018-04-17
### Added
- Added possibility to change the threshold (window.lazyloadthreshold).

## [3.3.1] - 2018-04-11
### Fixed
- multislot issue where domId was passed as an element instead of string
### Added
- More tests and improved console info in the manual-test-page

## [3.3.0] - 2018-03-20
### Added
- Added functionality to refresh existing ads
- Added lazyloading helper
- Documented script

### Deprecated
- Removing dfp.loadLazySlot, is replaced by lazyload (check async-helpers)

## [3.2.3] - 2018-03-07
### Added
- Added new ESLint rules

## [3.2.2] - 2018-02-01
### Fixed
- Fixed distribution files to show correct versioning

## [3.2.1] - 2018-01-18
### Fixed
- Set load marker within Googletag command

## [3.2.0] - 2018-01-18
### Changed
- Performance marks are now always added

## [3.1.1] - 2017-12-18
### Fixed
- Fixed distribution files to show correct versioning

## [3.1.0] - 2017-12-7
### Added
- Added PPID configuration

## [3.0.0] - 2017-07-11
### Added
- The DFP script can now be loaded asynchronously

## [2.5.1] - 2017-06-07
### Added
- Added README.md & CHANGELOG.md to npm module

## [2.5.0] - 2017-06-01
### Added
- Added performance marks when using collectUserTimings=true, can be retrieved using performance.getEntriesByType('mark')

## [2.4.1] - 2017-05-23
### Changed
- Refactored code
- Modified test running, no need to inject the testing api > will be removed on build.

## [2.4.0] - 2017-04-05
### Added
- Exposed the script version on the dfp object and when using taginfo=console or taginfo=true

## [2.3.1] - 2017-03-20
### Fixed
- Removed 'orientation' callback from dfp object

## [2.3.0] - 2017-03-09
### Added
- Added script to fetch Krux values from either localstorage or cookies
### Changed
- Publish scripts to on-premise NPM

## [2.2.1] - 2017-02-27
### Fixed
- The previous version of the script had a leading slash in front of the networkId in the name and id attribute on the dfp-iframe

## [2.2.0] - 2017-02-14
### Changed
- Dynamic callback definition: make all functions in callback object available on the window.dfp object except: init, loadSlot and loadLazySlot

## [2.1.1] - 2017-02-14
### Fixed
- When passing an empty array as targeting parameter it won't be printed to console or alert when using the taginfo urlParameter

## [2.1.0] - 2017-02-03
### Added
- Added 3 new functions which are used inside of creatives: showNative, onInreadOpened, onInreadClosed

## [2.0.0] - 2017-01-27
### Changed
- Script doesn't validate targeting parameters. Any key is possible (except adops and screen)
- Moved 'pos' as property of the slot-configuration to the above mentioned "custom targeting"
### Added
- Possible to add custom targeting to slots
- Added Karma coverage to project to see test coverage

## [1.3.2] - 2017-01-24
### Fixed
- Bugfix: Extra typeof check added to the _isValidBreakpoint method.
- Bugfix: Fix GPT TypeError when screenwidth is lower than defined breakpoints. (#LAT-93)

## [1.3.1] - 2016-12-26
### Fixed
- Bugfix: boolean and number values weren't send to DFP

## [1.3.0] - 2016-12-26
### Added
- Added new targeting parameter: postalCode (pc)

## [1.2.0] - 2016-12-26
### Added
- Added 3 new functions which are used inside of creatives: showHPTO, resizeCreative, hideCreative

## [1.1.1] - 2016-12-22
### Fixed
- useShortTargetNames based on options parameter, not based on url extension (.be/.nl), because this doesn't work locally or on staging environments (.net)

## [1.1.0] - 2016-12-22
### Changed
- Extended loadSlot method : now able to handle DOM-element or ID as first parameter
- Replaced isValidSetup with validateSetup method

## [1.0.0] - 2016-12-20
This is a complete rewrite of the previous async script but these are some of the major changes
### Added
- Added explicit breakpoints
### Changed
- Tag has been split up into networkId and adUnit
- Split up callbacks into 'renderEnded', 'resize' and 'orientationChange'
- Loading slots inline instead of loading on pageload = speed improvement
