<h1>Building a gui for balanceofsatoshis, work in progress</h1>

## To build from source, you will need Node.js 16 and yarn.

You can install Node.js from here:
https://nodejs.dev/download

```
# After installing Node.js, you can install yarn
npm install --global yarn
```

## Build from source

```
# Clone the repository
git clone https://github.com/niteshbalusu11/lndboss.git

# Change directory
cd lndboss

# Install dependencies
yarn

# Build the app
yarn build

# Run the app
yarn start
```

## Development

```
# Clone the repository
git clone https://github.com/niteshbalusu11/lndboss.git

# Change directory
cd lndboss

# Install dependencies
yarn

# Start dev server
yarn dev
```

## Authenticating

- You will need base64 encoded Macaroon, TLS Cert and Socket to authenticate to LND.
- Easiest way to obtain them is by running `bos credentials --cleartext --nospend` command on your node if you have [BalanceOfSatoshis](https://github.com/alexbosworth/balanceofsatoshis) installed.
- Click Login inside the app and enter the values and click `Authenticate`, you will be prompted with a success dialog if connection is established.
- After that simply go to the homepage and you should be able to start running commands.
