# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.1](https://github.com/datalens-tech/datalens-ui/compare/v0.2.0...v0.2.1) (2026-01-20)


### Bug Fixes

* Follow router rules in collection breadcrumbs ([42089bd](https://github.com/datalens-tech/datalens-ui/commit/42089bdcd6a1e03d65270a7ff311ab0a388d993e))

## 0.2.0 (2026-01-20)


### ⚠ BREAKING CHANGES

* Rebasing to v0.3715.0 tag from upstream
* Structure of library build - preprocessed source code is kept to be processed in the target app as source code

### Features

* add flag ignoreWorkbookEntries for  NavigationMinimal ([#46](https://github.com/datalens-tech/datalens-ui/issues/46)) ([932f8f2](https://github.com/datalens-tech/datalens-ui/commit/932f8f2435dcce67ece334f20dac4cdf4edf4dd6))
* Added plugins configuration to make it possible to override sdk ([cfcb5a3](https://github.com/datalens-tech/datalens-ui/commit/cfcb5a3915057b8390b9459dd4f8a9bb633460e5))
* Implemented capabilities-based access control system ([e9a933e](https://github.com/datalens-tech/datalens-ui/commit/e9a933ece1e4138c5cf127842afa59e650c3b714))
* **ql:** add support filling colors with multiple values ([#536](https://github.com/datalens-tech/datalens-ui/issues/536)) ([f11841b](https://github.com/datalens-tech/datalens-ui/commit/f11841bd67a90b7d1e583ece8d20fe31c953d992))
* Rebasing to v0.3715.0 tag from upstream ([72c018b](https://github.com/datalens-tech/datalens-ui/commit/72c018b264c2378044ffbf395f8098e651c6cfef))
* remove useless deps ([#15](https://github.com/datalens-tech/datalens-ui/issues/15)) ([ec415ae](https://github.com/datalens-tech/datalens-ui/commit/ec415aefb79b1c6c6c969482f60f3bf6587d339e))
* Structure of library build - preprocessed source code is kept to be processed in the target app as source code ([ebb71e8](https://github.com/datalens-tech/datalens-ui/commit/ebb71e893a6ae67f6af53e47c9369da547ca50b5))
* up dashkit ([#20](https://github.com/datalens-tech/datalens-ui/issues/20)) ([4065b6c](https://github.com/datalens-tech/datalens-ui/commit/4065b6c91d17f5d605d7f6e3393ff3d81583726a))


### Bug Fixes

* @gravity-ui/react-table-data upgraded to v2.2.1 with fixes to its styles ([58c9152](https://github.com/datalens-tech/datalens-ui/commit/58c9152e566f1bda960cf5a67da3a6a71b36e55e))
* a table in QL crashes with an error when there is no data ([#1649](https://github.com/datalens-tech/datalens-ui/issues/1649)) ([190ac94](https://github.com/datalens-tech/datalens-ui/commit/190ac94441a937dbcb7d8b8978b53d7bae38cdae))
* Added missing translation files ([c5e177e](https://github.com/datalens-tech/datalens-ui/commit/c5e177e1c5082ef78aff61b6a5625580cd260921))
* bar does not respond to parameter changes ([#2067](https://github.com/datalens-tech/datalens-ui/issues/2067)) ([4a15305](https://github.com/datalens-tech/datalens-ui/commit/4a15305e7f14205a752f9d68707de3bf0f4f7b7c))
* Breadcrumbs links follows router rules ([a335029](https://github.com/datalens-tech/datalens-ui/commit/a3350297f8e48ef05ff7aa7590d1f87fd2a08c8e))
* column width is incorrectly calculated for cells with a possible… ([#1660](https://github.com/datalens-tech/datalens-ui/issues/1660)) ([9358c19](https://github.com/datalens-tech/datalens-ui/commit/9358c192113c2f0c2c7904bfdd1cd3690b9800d1))
* **connections:** google logout fixes ([#16](https://github.com/datalens-tech/datalens-ui/issues/16)) ([ab90db6](https://github.com/datalens-tech/datalens-ui/commit/ab90db66647104ea436644202e8cb63f13a1266e))
* continuous axis mode for date is not available ([#380](https://github.com/datalens-tech/datalens-ui/issues/380)) ([a4403d9](https://github.com/datalens-tech/datalens-ui/commit/a4403d918da5ec9a3b104e77e5a280e08f7b3215))
* Creating history object in non-browser environment ([65ca922](https://github.com/datalens-tech/datalens-ui/commit/65ca922ef3e60bf7f662af5d7edd8c7098aa3638))
* Disrupted import cycles (excluding import type cycles) ([7b89205](https://github.com/datalens-tech/datalens-ui/commit/7b892050dd8e225f5a6c6bf7e5d5fea6700f0eb1))
* Externalize @datalens-tech/* deps and adding them to final package.json ([58d5db0](https://github.com/datalens-tech/datalens-ui/commit/58d5db0c01ecb04e4e14c2130ed80fc44b5d4357))
* Extracted DatasetPageContext component to break dependencies graph cycle ([376f417](https://github.com/datalens-tech/datalens-ui/commit/376f4176f027de013240e2d5596f8460b9fb99e3))
* Extracted modules from src/ui/units/wizard/actions/visualization to break dependencies graph cycles ([336fb34](https://github.com/datalens-tech/datalens-ui/commit/336fb343667f839768514cb4fd39ed740ff6271e))
* Extracted modules to break dependencies graph cycles ([94dc4dd](https://github.com/datalens-tech/datalens-ui/commit/94dc4ddd4cdba0201141ff558d1139537950d012))
* Extracted modules to break dependencies graph cycles ([5add7e0](https://github.com/datalens-tech/datalens-ui/commit/5add7e0a9db1d586ad0c22a5e8d6327847e0bd83))
* Extracted new module 'save' to break dependencies graph cycle ([9a53fef](https://github.com/datalens-tech/datalens-ui/commit/9a53fefda633ba2c806b913cef6f9c9061e70d93))
* Filtering is triggered only when a point or line is clicked ([#515](https://github.com/datalens-tech/datalens-ui/issues/515)) ([b635ccb](https://github.com/datalens-tech/datalens-ui/commit/b635ccb51a01335bc6c57f5276d17a444dfaa677))
* fix typo, add comma ([#35](https://github.com/datalens-tech/datalens-ui/issues/35)) ([844c2a1](https://github.com/datalens-tech/datalens-ui/commit/844c2a12b3fc745b2ce456f6fe6e0944f7446a7c))
* gravity-ui CSS ([fc52948](https://github.com/datalens-tech/datalens-ui/commit/fc52948ad8e6c7aa24dff5c318b5b45e04662731))
* import paths corrections for disrupting dependencies graph cycles ([3ba1f49](https://github.com/datalens-tech/datalens-ui/commit/3ba1f49b7c4a79a4ccaf5bcaa0370ed9fdc3d577))
* import paths corrections for disrupting dependencies graph cycles ([752e881](https://github.com/datalens-tech/datalens-ui/commit/752e88149ba39db7368677e6d6edc07dc7230759))
* import paths corrections for disrupting dependencies graph cycles ([df2a1e2](https://github.com/datalens-tech/datalens-ui/commit/df2a1e22ecc8d072ba6a4492613c21e76f791037))
* import paths corrections for disrupting dependencies graph cycles ([f05dc48](https://github.com/datalens-tech/datalens-ui/commit/f05dc48238d1019417e96c2b477157ab9092ef9e))
* import paths corrections for disrupting dependencies graph cycles ([07f0b53](https://github.com/datalens-tech/datalens-ui/commit/07f0b539e121d65f528a01bd67175178c7572a52))
* import paths corrections for disrupting dependencies graph cycles + extracting selectors into separated modules for the same reason ([07fc0fb](https://github.com/datalens-tech/datalens-ui/commit/07fc0fb28deb9897769f7a9a0ab1e8a41861f0ce))
* import paths to errors' predicates to break dependencies graph cycle ([f4bd9eb](https://github.com/datalens-tech/datalens-ui/commit/f4bd9eb3e241de84d8e4ccfc04a65c8caeb49ea9))
* **line-mappers:** fix checking property on lines object ([#639](https://github.com/datalens-tech/datalens-ui/issues/639)) ([a2be027](https://github.com/datalens-tech/datalens-ui/commit/a2be0278a50b5932560a77af7f4faaa27337a493))
* Missing configuration argument ([b0172ad](https://github.com/datalens-tech/datalens-ui/commit/b0172ada02442bd5d5cc384162f7e2978badf43e))
* Missing index.js ([e8fffc0](https://github.com/datalens-tech/datalens-ui/commit/e8fffc00382726be0a29f4601f1d6f3ded554123))
* Moved dataset table sort methods, predicates and getters to separated modules to break dependencies graph cycles ([3692c0f](https://github.com/datalens-tech/datalens-ui/commit/3692c0fb427c0fab81d768d3660cac5b147df601))
* Moved getCookie and getCSRFToken to separated modules to break dependencies graph cycle ([1eda88c](https://github.com/datalens-tech/datalens-ui/commit/1eda88ca0c0c6a6bca41b1180be03aff4ebe69c1))
* Moved prepareDataset methods to the usage location to break dependencies graph cycle ([090987d](https://github.com/datalens-tech/datalens-ui/commit/090987df5b8bbf12359960ee810da3e0ab9af9da))
* pagination control is not displayed in tables with hierarchies ([#1468](https://github.com/datalens-tech/datalens-ui/issues/1468)) ([93208f9](https://github.com/datalens-tech/datalens-ui/commit/93208f9c5e1f940780278519d14dc0719c1588d4))
* refactoring goto with retry for tests ([#13](https://github.com/datalens-tech/datalens-ui/issues/13)) ([2b26e0f](https://github.com/datalens-tech/datalens-ui/commit/2b26e0f8f4596f24a20e5962eea1a31d57ab0f4a))
* remove site verification ([#12](https://github.com/datalens-tech/datalens-ui/issues/12)) ([fd2a4dd](https://github.com/datalens-tech/datalens-ui/commit/fd2a4ddcb97c61c5bac3359f231b4c1d7d839f5e))
* require => esm import ([8778dfc](https://github.com/datalens-tech/datalens-ui/commit/8778dfc2393060482a2c5d7b3b2405b4feb9182d))
* set the intensityOfMidpoint depending on the gradient settings ([#25](https://github.com/datalens-tech/datalens-ui/issues/25)) ([8540f5a](https://github.com/datalens-tech/datalens-ui/commit/8540f5ad650adf98d67e242a715fb4a3c61cc6f2))
* Showing/hiding workbook title edit button & actions menu according to the capability flag 'accessible-workbook-editing' ([e4821ef](https://github.com/datalens-tech/datalens-ui/commit/e4821efd7f5364f7d9f49de886cb0cf5f4bac3f5))
* sorting is not applied in line type layer(combined chart) ([#2350](https://github.com/datalens-tech/datalens-ui/issues/2350)) ([e14925d](https://github.com/datalens-tech/datalens-ui/commit/e14925d8b24770f9c8d315567de3ef557d39ec59))
* SQL query is not displayed when the dialog is opened ([#2695](https://github.com/datalens-tech/datalens-ui/issues/2695)) ([ff313bc](https://github.com/datalens-tech/datalens-ui/commit/ff313bce8942f61de4563f780d573193d94833b7))
* Static import paths for dynamic libs ([f6b7d2e](https://github.com/datalens-tech/datalens-ui/commit/f6b7d2ed41754a99889b4234367b7012981ea700))
* SVG icons loading ([2beb81a](https://github.com/datalens-tech/datalens-ui/commit/2beb81ad757d7f3c894dde7facb3f91b5acd4118))
* the parameter editing menu flies to the upper-left corner ([#2696](https://github.com/datalens-tech/datalens-ui/issues/2696)) ([d660213](https://github.com/datalens-tech/datalens-ui/commit/d6602132cb4286959b2b3a03531a49095f55dacb))
* Using history object for creating hrefs for breadcrumbs ([0edf2b3](https://github.com/datalens-tech/datalens-ui/commit/0edf2b340bc999a67f56f305d4eb26ce6051a677))
* values are clipped in selectors ([#2693](https://github.com/datalens-tech/datalens-ui/issues/2693)) ([92383b4](https://github.com/datalens-tech/datalens-ui/commit/92383b494e1112696eb14309a4459246f5812e9e))
* Warning in console: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()? ([0780b01](https://github.com/datalens-tech/datalens-ui/commit/0780b0176ec3b102113a32fd6de00698da7f7927))
* wizard app styles ([#19](https://github.com/datalens-tech/datalens-ui/issues/19)) ([668ed1d](https://github.com/datalens-tech/datalens-ui/commit/668ed1d19b72a7666fd0c4b76bbf28681c66bab0))

### [0.1.3](https://github.com/datalens-tech/datalens-ui/compare/v0.1.2...v0.1.3) (2026-01-18)


### Bug Fixes

* @gravity-ui/react-table-data upgraded to v2.2.1 with fixes to its styles ([938f8f7](https://github.com/datalens-tech/datalens-ui/commit/938f8f7b728621edcda14b5a42e6a60057e9d482))

### [0.1.2](https://github.com/datalens-tech/datalens-ui/compare/v0.1.1...v0.1.2) (2026-01-17)


### Bug Fixes

* Using history object for creating hrefs for breadcrumbs ([fbabcbd](https://github.com/datalens-tech/datalens-ui/commit/fbabcbd63e399e7d38e70546f0063fb47cbf5273))

### [0.1.1](https://github.com/datalens-tech/datalens-ui/compare/v0.1.0...v0.1.1) (2026-01-17)


### Bug Fixes

* SVG icons loading ([6cda9a8](https://github.com/datalens-tech/datalens-ui/commit/6cda9a83cc5505560512656f44101d4673ecb8ad))

## [0.1.0](https://github.com/datalens-tech/datalens-ui/compare/v0.0.1...v0.1.0) (2026-01-17)


### ⚠ BREAKING CHANGES

* Structure of library build - preprocessed source code is kept to be processed in the target app as source code

### Features

* Structure of library build - preprocessed source code is kept to be processed in the target app as source code ([7720e99](https://github.com/datalens-tech/datalens-ui/commit/7720e994895aea98d65e6aa3d2c9bd6df7e459ba))


### Bug Fixes

* Added missing translation files ([580e94a](https://github.com/datalens-tech/datalens-ui/commit/580e94a67a2c711487f5d1e08aef82fc1af9fa84))
* Breadcrumbs links follows router rules ([3cd3449](https://github.com/datalens-tech/datalens-ui/commit/3cd344917fdaed8f8bbbfee06236399c587eee2a))
* Disrupted import cycles (excluding import type cycles) ([1a36664](https://github.com/datalens-tech/datalens-ui/commit/1a36664d08cd71226560cd7ebb0615309c356f1c))
* Extracted DatasetPageContext component to break dependencies graph cycle ([df3a3c6](https://github.com/datalens-tech/datalens-ui/commit/df3a3c6173cae4497c71b22d15d4b95c586b23ed))
* Extracted modules from src/ui/units/wizard/actions/visualization to break dependencies graph cycles ([e31189e](https://github.com/datalens-tech/datalens-ui/commit/e31189e02f2da2f04c4d72ccaf2cf87937685c24))
* Extracted modules to break dependencies graph cycles ([2fcf30b](https://github.com/datalens-tech/datalens-ui/commit/2fcf30b0a1f6f8cda93b2149216395f4f5838df0))
* Extracted modules to break dependencies graph cycles ([0a0db31](https://github.com/datalens-tech/datalens-ui/commit/0a0db318817ae232b094a4d140ef922d060a84e0))
* Extracted new module 'save' to break dependencies graph cycle ([9c4ccdd](https://github.com/datalens-tech/datalens-ui/commit/9c4ccdd15da6a9bba3d11179f57b7c863dbcb4e0))
* gravity-ui CSS ([e3b06c2](https://github.com/datalens-tech/datalens-ui/commit/e3b06c21cd9898e9e7973ad2bf80c013720337c5))
* import paths corrections for disrupting dependencies graph cycles ([17dd5e1](https://github.com/datalens-tech/datalens-ui/commit/17dd5e18620a24f2276782829324368cbee56167))
* import paths corrections for disrupting dependencies graph cycles ([794a8c6](https://github.com/datalens-tech/datalens-ui/commit/794a8c63ccbaa5172ca3083e525b3b300f39f500))
* import paths corrections for disrupting dependencies graph cycles ([f704f92](https://github.com/datalens-tech/datalens-ui/commit/f704f924e7189c8d3dec323fd2ef0e91455cef7b))
* import paths corrections for disrupting dependencies graph cycles ([08fdaa0](https://github.com/datalens-tech/datalens-ui/commit/08fdaa03dcb93541d01df3135ca3d44d620b907a))
* import paths corrections for disrupting dependencies graph cycles ([25fa3c6](https://github.com/datalens-tech/datalens-ui/commit/25fa3c6298777d53415cf3538b96d1acd6d20ee5))
* import paths corrections for disrupting dependencies graph cycles + extracting selectors into separated modules for the same reason ([f40ebc6](https://github.com/datalens-tech/datalens-ui/commit/f40ebc6616b5483abec5b35b93123e3f78a13894))
* import paths to errors' predicates to break dependencies graph cycle ([8e98bb7](https://github.com/datalens-tech/datalens-ui/commit/8e98bb77896d6698e6ffef4fd7c3956f7318e9a9))
* Missing configuration argument ([db5b4ad](https://github.com/datalens-tech/datalens-ui/commit/db5b4ade6287907a7f2cc567d1021801b81f5332))
* Moved dataset table sort methods, predicates and getters to separated modules to break dependencies graph cycles ([85abfde](https://github.com/datalens-tech/datalens-ui/commit/85abfde8db8fcb131360db22d38c36ae1bec4f39))
* Moved getCookie and getCSRFToken to separated modules to break dependencies graph cycle ([b217b47](https://github.com/datalens-tech/datalens-ui/commit/b217b470a81915eea059301ea943927a0c7877e9))
* Moved prepareDataset methods to the usage location to break dependencies graph cycle ([e5b0522](https://github.com/datalens-tech/datalens-ui/commit/e5b052212fafcceef2cd20b65afc6457cd8fcffc))
* require => esm import ([92dcc9d](https://github.com/datalens-tech/datalens-ui/commit/92dcc9d3d13c94afbe939cb6135532b5df00b93f))
* Static import paths for dynamic libs ([52828cc](https://github.com/datalens-tech/datalens-ui/commit/52828cc932af49fac476bf5ccb7bba19d1ccae68))

### [0.0.1](https://github.com/datalens-tech/datalens-ui/compare/v0.0.0...v0.0.1) (2026-01-14)


### Bug Fixes

* Externalize @datalens-tech/* deps and adding them to final package.json ([248c656](https://github.com/datalens-tech/datalens-ui/commit/248c6562302b9d07726ccda60c560d1ba131e765))
