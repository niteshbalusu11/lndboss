# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.16.4](https://github.com/niteshbalusu11/lndboss/compare/v1.16.3...v1.16.4) (2022-08-05)

### [1.16.3](https://github.com/niteshbalusu11/lndboss/compare/v1.16.2...v1.16.3) (2022-08-04)

- Fix Dockerfile node version

## [1.16.0](https://github.com/niteshbalusu11/lndboss/compare/v1.15.9...v1.16.0) (2022-08-04)

- Reduce docker image size by 50%
- Add support for graph command server side
- Consolidate several commands modules into one single module

### [1.15.9](https://github.com/niteshbalusu11/lndboss/compare/v1.15.8...v1.15.9) (2022-08-01)

- Fix docker build issues

### [1.15.8](https://github.com/niteshbalusu11/lndboss/compare/v1.15.7...v1.15.8) (2022-08-01)

- Bug fixes with yarn global install

### [1.15.6](https://github.com/niteshbalusu11/lndboss/compare/v1.15.5...v1.15.6) (2022-08-01)

- Add support to publish to npm

### [1.15.2](https://github.com/niteshbalusu11/lndboss/compare/v1.15.1...v1.15.2) (2022-07-29)

- Add ability to set default socket via BOS_DEFAULT_LND_SOCKET env variable.

### [1.15.1](https://github.com/niteshbalusu11/lndboss/compare/v1.15.0...v1.15.1) (2022-07-29)

- Improved retry for amboss health check

## [1.15.0](https://github.com/niteshbalusu11/lndboss/compare/v1.14.2...v1.15.0) (2022-07-28)

- Added support for bos peers command.
- Added support for bos reconnect command.

### [1.14.2](https://github.com/niteshbalusu11/lndboss/compare/v1.14.1...v1.14.2) (2022-07-26)

- Saved node flag is now optional in all API calls.

## [1.14.0](https://github.com/niteshbalusu11/lndboss/compare/v1.13.0...v1.14.0) (2022-07-26)

- Added support for bos probe command
- Bug fixes for bos send command
- Clean JSX Code for Pages

## [1.13.0](https://github.com/niteshbalusu11/lndboss/compare/v1.12.1...v1.13.0) (2022-07-20)

- Added support for bos send command
- Added support bos amboss health check retry on failure

### [1.12.1](https://github.com/niteshbalusu11/lndboss/compare/v1.12.0...v1.12.1) (2022-07-08)

- Update umbrel config

## [1.12.0](https://github.com/niteshbalusu11/lndboss/compare/v1.11.0...v1.12.0) (2022-07-08)

- Added support for bos rebalance command
- Added support for scheduled rebalances
- Added support for sending health check updates to Amboss
- Redirects to login page if session expires
- Fixed a bug where some commands were finding tags in the wrong directory
- Docker image is 3 times smaller
- Improved logging

## [1.11.0](https://github.com/niteshbalusu11/lndboss/compare/v1.10.0...v1.11.0) (2022-06-25)

- Added support for bos chainfees command
- Added support for bos price command
- Fixed bug where switch fields were too long in width for selection

## [1.10.0](https://github.com/niteshbalusu11/lndboss/compare/v1.9.1...v1.10.0) (2022-06-24)

- Added support for bos forwards command
- Added support for bos find command
- Added support for encrypting macaroon if credentials authentication is used
- Docker images are slimmer

### [1.9.1](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.9.0...v1.9.1) (2022-06-22)

- Added support for table output for closed command

## [1.9.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.8.0...v1.9.0) (2022-06-22)

- Support for bos closed command
- Add taproot format support for chain-deposit
- Fixed docker release issues
- Fix for replacing bcrypt library

## [1.8.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.7.0...v1.8.0) (2022-06-20)

- Support for auto pulling credentials from lnd directory if found
- Support for running app in a docker container

## [1.7.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.6.0...v1.7.0) (2022-06-20)

- Added support for setting path to LND directory
- Added loading dialog when waiting for response from server
- Updated test cases

## [1.6.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.5.0...v1.6.0) (2022-06-18)

- Added support for accounting command
- Changed homepage theme colors
- Fixed react bug where react children don't have a unique key

## [1.5.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.4.0...v1.5.0) (2022-06-15)

- Added cert-validity-days command

## [1.4.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.3.0...v1.4.0) (2022-06-15)

- All API Errors are logged to the console
- Custom alerts for success and failures

## [1.3.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.2.1...v1.3.0) (2022-06-14)

- API to insert credentials is now secure

### [1.2.1](https://github.com/niteshbalusu11/nextronbosgui/compare/v1.2.0...v1.2.1) (2022-06-14)

- Fix a bug where adding credentials was failing

## [1.2.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v2.0.0...v1.2.0) (2022-06-14)

- Added Authentication using JWT Tokens
- Updated all test cases to support Authentication
- All API Routes of NestJS are now protected

## [1.1.0](https://github.com/niteshbalusu11/nextronbosgui/compare/v2.0.0...v1.1.0) (2022-06-14)

### 1.0.1 (2022-06-11)
