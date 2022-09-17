<h1>Building a gui for balanceofsatoshis, work in progress</h1>

[![npm version](https://badge.fury.io/js/lndboss.svg)](https://badge.fury.io/js/lndboss)

#### For questions or support, please reach out on telegram.
https://t.me/lndboss

## Supported commands

```shell
# See an accounting formatted list of various types of transactions
bos accounting "category"

# See total balance, including pending funds, excluding future commit fees
bos balance

# Call ln-service raw APIs
bos call "method"

# Get the number of days the node cert remains valid
bos cert-validity-days

# Receive on-chain funds via a regular address
bos chain-deposit

# See the current fee estimates confirmation targets
bos chainfees

# Show chain fees paid
bos chart-chain-fees

# Show routing fees earned
bos chart-fees-earned

# Show routing fees paid
bos chart-fees-paid

# Show a chart of payments received
bos chart-payments-received

# See details on how closed channels resolved on-chain
bos closed

# Query the node to find something like a payment, channel or node
bos find "query"

# Output a summarized version of peers forwarded towards
bos forwards

# Look up the channels and fee rates of a node by its public key
bos graph "pubkey"

# Collection of lnurl features
bos lnurl "function"

# Pay a payment request (invoice), probing first
bos pay "payment_request"

# Show channel-connected peers
bos peers

# Output the price of BTC
bos price

# Test if funds can be sent to a destination
bos probe "payment_request/public_key"

# Rebalance funds between peers
bos rebalance

# Reconnect to offline peers
bos reconnect

# Send funds using keysend or lnurl/lightning address and an optional message to a node
bos send

# Tags can be used in other commands via tag and avoid options
bos tags
```

## Yarn global install instructions (Requires NodeJs and Yarn)

### For Linux:
Download Node.js
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
```
Install it:
```
sudo apt-get install -y nodejs
```

### For Mac or Windows download and install from:
https://nodejs.dev/


Setup Node.js to install packages without using sudo (optional)
```
mkdir ~/.npm-global

npm config set prefix '~/.npm-global'

nano ~/.profile

# Add a new line to the end:

PATH="$HOME/.npm-global/bin:$PATH"

# Save
ctrl + x
y

# Update shell
. ~/.profile
```

### After installing Node.js, you can install yarn.
```
npm install --global yarn
```

### Install LndBoss
```
yarn global add lndboss
```

### Run the app
```
# Assuming default yarn global install path

yarn --cwd ~/.config/yarn/global/node_modules/lndboss start:prod
```

### Sample systemd instructions to run the app in the background
```shell
#Systemd unit for LndBoss App
#/etc/systemd/system/lndboss.service
[Unit]
Description=lndboss
Wants=lnd.service
After=lnd.service


[Service]
ExecStart=/home/ubuntu/.npm-global/bin/yarn --cwd /home/ubuntu/.config/yarn/global/node_modules/lndboss start:prod
User=ubuntu
Restart=always
TimeoutSec=120
RestartSec=30
StandardOutput=journal+console
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### To Update the app:
```
yarn global add lndboss
```

## Docker Instructions

Make a .bosgui directory and change directory
```
mkdir ~/.bosgui && cd ~/.bosgui
```

Make a docker-compose.yaml file
```
nano docker-compose.yaml
```

Paste the following contents
```
services:
services:
  lndboss:
    image: niteshbalusu/lndboss:latest
    volumes:
      - ~/.bosgui:/home/node/.bosgui
      - /path/to/your/lnd/directory:/home/node/.lnd
    ports:
      - "8055:8055"
```

Start the app
```
docker-compose up -d
```
On your browser go to http://localhost:8055

### Updating docker images for new releases
```
cd ~/.bosgui

docker-compose down

# If you want to clean up old images and save disk space (Caution: Run this in the right directory)
docker-compose down --rmi all --volumes

docker-compose pull

docker-compose up -d
```

<br></br>

## Docker Instructions (Umbrel version 0.5 and higher) 

Make a .bosgui directory and change directory
```
mkdir ~/.bosgui && cd ~/.bosgui
```

Make a docker-compose.yaml file
```
nano docker-compose.yaml
```

Paste the following contents
```
services:
  lndboss:
    image: niteshbalusu/lndboss:latest
    volumes:
      - ~/.bosgui:/home/node/.bosgui
      - ~/umbrel/app-data/lightning/data/lnd:/home/node/.lnd
    ports:
      - '8055:8055'
    environment:
      BOS_DATA_PATH: '/home/node/.bosgui'
      NODE_ENV: 'production'
      PORT: 8055
      BOS_DEFAULT_LND_SOCKET: 10.21.21.9:10009
networks:
  default:
    name: umbrel_main_network
    external: true
```

Start the app
```
docker-compose up -d
```
On your browser go to http://umbrel.local:8055

### Updating docker images for new releases
```
cd ~/.bosgui

docker-compose down

# If you want to clean up old images and save disk space (Caution: Run this in the right directory)
docker-compose down --rmi all --volumes

docker-compose pull

docker-compose up -d
```

## Docker Instructions (Umbrel lower than version 0.5) 

Make a .bosgui directory and change directory
```
mkdir ~/.bosgui && cd ~/.bosgui
```

Make a docker-compose.yaml file
```
nano docker-compose.yaml
```

Paste the following contents
```
services:
  lndboss:
    image: niteshbalusu/lndboss:latest
    volumes:
      - ~/.bosgui:/home/node/.bosgui
      - ~/umbrel/lnd:/home/node/.lnd
    ports:
      - '8055:8055'
    environment:
      BOS_DATA_PATH: '/home/node/.bosgui'
      NODE_ENV: 'production'
      PORT: 8055
      BOS_DEFAULT_LND_SOCKET: 10.21.21.9:10009
networks:
  default:
    name: umbrel_main_network
    external: true
```

Start the app
```
docker-compose up -d
```
On your browser go to http://umbrel.local:8055

### Updating docker images for new releases
```
cd ~/.bosgui

docker-compose down

# If you want to clean up old images and save disk space (Caution: Run this in the right directory)
docker-compose down --rmi all --volumes

docker-compose pull

docker-compose up -d
```

<br></br>
## To build from source, you will need Node.js 16 and yarn.

### For Linux:
Download Node.js
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
```
Install it:
```
sudo apt-get install -y nodejs
```

### For Mac or Windows
https://nodejs.dev/


Setup Node.js to install packages without using sudo (optional)
```
mkdir ~/.npm-global

npm config set prefix '~/.npm-global'

nano ~/.profile

# Add a new line to the end:

PATH="$HOME/.npm-global/bin:$PATH"

# Save
ctrl + x
y

# Update shell
. ~/.profile
```

### After installing Node.js, you can install yarn.
```
npm install --global yarn
```

## Build from source (Raspblitz and Raspibolt)

```
# Clone the repository
git clone https://github.com/niteshbalusu11/lndboss.git

# Change directory
cd lndboss

# Install dependencies
yarn install --network-timeout 1000000

# Build the app
yarn build:prod

# Run the app
yarn start:prod
```
App will run on http://localhost:8055. If you installed the app on your node machine and trying to access it on the browser on a different machine, then use the hostname of the machine the app is running on, example: http://raspberrypi.local:8055

Raspblitz/Raspibolt might have a firewall blocking from accessing your app in the browser. Add the port to the firewall rules.
```
sudo ufw allow 8055
```

### Autostart App using systemd (Build from source ONLY, does NOT work for docker)
- Running `which yarn` will return the path to yarn.
- Create a systemd file like this `sudo nano /etc/systemd/system/lndboss.service`.
- Replaces paths and User in the sample.
- In the sample file, `StandardOutput=journal+console` removing `+console` will reduce the amount of logs in `journalctl`.
- Add the service, enable the service using `sudo systemctl enable lndboss.service`.
- Start the service using `sudo systemctl start lndboss.service`.
- To stop the service, run `sudo systemctl stop lndboss.service`.

Here's a sample systemd config file.
```
#Systemd unit for LndBoss App
#/etc/systemd/system/lndboss.service
[Unit]
Description=lndboss
Wants=lnd.service
After=lnd.service


[Service]
WorkingDirectory=/home/ubuntu/utils/lndboss
ExecStart=/path/to/yarn --cwd /path/to/lndboss/ start:prod
User=ubuntu
Restart=always
TimeoutSec=120
RestartSec=30
StandardOutput=journal+console
StandardError=journal

[Install]
WantedBy=multi-user.target
```

<br></br>
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
App will run on http://localhost:8055. If you installed the app on your node machine and trying to access it on the browser on a different machine, then use the hostname of the machine the app is running on, example: http://raspberrypi.local:8055

## Authenticating

If your LND directory is one of the traditional locations of `~/.lnd` or one of the umbrel default locations, LndBoss will find it.

If not, you have 2 options to authenticate to LND:

### Option 1: (Using path to LND directory)

- From the home page, click on Menu on the top left corner, select Authenticate, and select the option `Path to LND directory`
-  Enter the full LND directory, example: `/home/ubuntu/nitesh/.lnd`. 
- Socket would be `localhost:10009`, if you're running lndboss on a different machine from your node, then you'll have to set it to `hostname:10009`, example: `raspberrypi.local:10009`
- Click `Authenticate`, your credentials will be verified and presented with a success/failure message.
- If it succeeds, you can start running commands.

<br></br>

### Option 2: (Using base64 credentials)

- From the home page, click on Menu on the top left corner, select Authenticate, and select the option `credentials`.
- You will need base64 encoded Macaroon, TLS Cert and Socket to authenticate to LND.
- Easiest way to obtain them is by running `bos credentials --cleartext --nospend` command on your node if you have [BalanceOfSatoshis](https://github.com/alexbosworth/balanceofsatoshis) installed.
- Socket would be `localhost:10009`, if you're running lndboss on a different machine from your node, then you'll have to set it to `hostname:10009`, example: `raspberrypi.local:10009`
- Click `Authenticate`, your credentials will be verified and presented with a success/failure message.
- If it succeeds, you can start running commands.

<br></br>

### DotEnv (.env) Settings
Some settings of lndboss can be controlled via a .env file.
- For docker setup, create a .env file in the .bosgui directory.
- If building from source, create a .env file in the root (lndboss folder) of the project OR in the .bosgui directory.
- Check out the file called .env.example for instructions on what settings can be controlled.

<br></br>

### Encryping Macaroon
If you authenticated using option 2 above, there is a way to encrypt your macaroon.

<b>For docker:</b>

- Inside the .env file set `ENCRYPTION_KEY="yourEncryptionKey"` (Check the .env.example file which shows an example)
- The key should be 32 characters long, humans are terrible at generating passwords and random strings, easiest way to generate an encryption key would be running `openssl rand -hex 32` on your terminal.
- A sample encryption key would look like this: `ENCRYPTION_KEY="b4970320a3601d19b876c18ce2eb895d687962d3f0b72e0d4de05ed74be34d9a"`

<b>For Build from source</b>

- Inside the .env file set `ENCRYPTION_KEY="yourEncryptionKey"` (Check the .env.example file which shows an example)
- The key should be 32 characters long, humans are terrible at generating passwords and random strings, easiest way to generate an encryption key would be running `openssl rand -hex 32` on your terminal.
- A sample encryption key would look like this: `ENCRYPTION_KEY="b4970320a3601d19b876c18ce2eb895d687962d3f0b72e0d4de05ed74be34d9a"`

## Demo

https://user-images.githubusercontent.com/84944042/172693877-a19c1ba3-0579-4537-8322-924fe1ab0f70.mp4

<br></br>
<br></br>
# Using LndBoss as a server

- LndBoss can be used as a server to interact with balanceofsatoshis commands from any client.
- Follow the ReadMe file to setup the application. The app starts on localhost:8055 by default and this can be used to perform any API calls.
- Base API URL:

```
# From same device:
http://localhost:8055/api/

# From a different device, use the hostname or IP address of the device the server is running on, example:

http://raspberrypi.local:8055/api/

http://192.168.11.11:8055/api/
```

## 1. Registering (POST Request):

- First step is to create a username and password, you can only register once, registering creates a new `.bosgui` directory in your home directory, can you view it by going to it like this: `cd ~/.bosgui` where the credentials are hashed and stored. If you ever forget your password, go into this directory and delete the file `auth.json` to register again.

###

```javascript
/** 
@PostRequest

@Url
http://localhost:8055/api/auth/register

@Body
{
  password: <Password String>
  username: <Username String>
}
@Headers
{
  'Content-Type': 'application/json'
}

@Response
{
  true
}
*/

try {
  const url = 'http://localhost:8055/api/auth/register';

  const response = await axios.post(url, {
    headers: { 'Content-Type': 'application/json' },
    password: 'somePassword',
    username: 'someUserName',
  });

  const result = await response.data;
} catch (error) {
  console.error(error);
}
```

## 2. Logging in (POST Request):

- To perform any API calls, you need an authentication token, the login API call returns a JWT Authentication token that is valid for 15 mins, which needs to be used to make any subsequent calls to the server.

```javascript
/** 
@PostRequest

@Url
http://localhost:8055/api/auth/login

Body:
{
  password: <Password String>
  username: <Username String>
}
Headers:
{
  'Content-Type': 'application/json'
}

@Response
{
  "accessToken": "eyJbGiOiJIUzI1qqNiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJzdwwiOiJ0Zcc0IiwiaWF0IjoxNjU4NjIzMjI3LCJleHAiOjE2NTg2yyY4Mjd9.5NdwdhU4NPsK98aRwUeNkoMqqqRtZoPFMcDhrXX6xnY"
}
*/

try {
  const url = 'http://localhost:8055/api/auth/login';

  const response = await axios.post(url, {
    headers: { 'Content-Type': 'application/json' },
    password: 'somePassword',
    username: 'someUserName',
  });

  const result = await response.data;
} catch (error) {
  console.error(error);
}
```

## Running commands:

- All commands take the following headers for authorization:

```javascript
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer authTokenFromLogin`,
},
```

- Every command except `Tags` and `Price` takes `node` query parameter as LndBoss supports multiple nodes, you can ignore the node flag if you're using a default node or pass the flag if you want to specify a saved node(s) as a `string` or `string[]` depending on the command, check `@Query` in the help for every command in this document to check what type the command accepts.

- In the query parameters or body of a request, in the below examples, if a query/body is enclosed in square brackets `[]` it is optional to pass, else it is required. Example, in the accounting command `[month]` is optional, `is_csv` is required.
  <br></br>

### Accounting (GET Request)

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/accounting

@Query
  {
    category: <Accounting Category String>
    is_csv: <Is CSV Output Boolean>
    is_fiat_disabled: <Is fiat disabled Boolean>
    [month]: <String>
    [rate_provider]: <Fiat rate providerString>
    [year]: <String>
    [node]: <Saved Node String>
  }

@Response
  {
    [rows]: [[<Column String>]]
    [rows_summary]: [[<Column String>]]
  }
*/

try {
  const url = 'http://localhost:8055/api/accounting';

  const query = {
    category: 'chain-fees',
    is_csv: false,
    is_fiat_disabled: true,
    month: '6',
    rate_provider: '',
    year: '2022',
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Balance (GET Request)

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/balance

@Query
  {
    [above]: <Number>
    [below]: <Number>
    [is_confirmed]: <Boolean>
    [is_detailed]: <Boolean>
    [is_offchain_only]: <Boolean>
    [is_onchain_only]: <Boolean>
  }

if (is_detailed === true)
@Returns
  {
    [offchain_balance]: <Total Value of Channel Balances String>
    [offchain_pending]: <Total Pending Local Balance String>
    [onchain_balance]: <Collective Value of UTXOs String>
    [onchain_vbytes]: <Estimated Size of Spending On Chain Funds Number>
  }

if (is_detailed === false)
@Returns
  {
    balance: <Tokens Number>
    channel_balance: <Channel Balance Minus Commit Fees Tokens Number>
  }
*/

try {
  const url = 'http://localhost:8055/api/balance';

  const query = {
    is_detailed: true,
    is_confirmed: true
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Cert-Validity-Days (GET Request)

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/cert-validity-days

@Query
  {
    [below]: <Number>
    [node]: <Saved Node String>
  }

@Response
  {
    days: <Number>
  }
*/

try {
  const url = 'http://localhost:8055/api/cert-validity-days';

  const query = {
    below: 1000,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### ChainDeposit

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chain-deposit

@Query
  {
    [amount]: <Amount Number>
    [format]: <Address format String>
    [node]: <Saved Node String>
  }

@Response
  {
    url: <Deposit Address URL string>
  }
*/

try {
  const url = 'http://localhost:8055/api/chain-deposit';

  const query = {
    amount: 1000,
    format: 'p2tr',
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Chainfees

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chainfees

@Query
  {
    [blocks]: <Number>
    [file]: <Boolean>
    [node]: <Saved Node String>
  }

@Response
  {
    current_block_hash: <Chain Tip Best Block Hash Hex String>
    fee_by_block_target: {
      $number: <Kvbyte Fee Rate Number>
    }
  }
*/

try {
  const url = 'http://localhost:8055/api/chainfees';

  const query = {
    blocks: 6,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### ChartChainFees

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chart-chain-fees

@Query
  {
    days: <Number>
    [end_date]: <End Date YYYY-MM-DD String>
    [nodes]: <Saved Nodes String Array>
    [start_date]: <Start Date YYYY-MM-DD String>
  }

@Response
  {
    data: [<Chain Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

try {
  const url = 'http://localhost:8055/api/chart-chain-fees';

  const query = {
    days: 10,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### ChartFeesEarned

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chart-fees-earned

@Query
  {
    [days]: <Fees Earned Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    [is_count]: <Return Only Count of Forwards Boolean>
    [is_forwarded]: <Return Only Forwards Boolean>
    [nodes]: <Saved Nodes String Array>
    [start_date]: <Start Date YYYY-MM-DD String>
    [via]: <Via Public Key Hex or Tag Id or Alias String>
  }

@Response
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

try {
  const url = 'http://localhost:8055/api/chart-fees-earned';

  const query = {
    days: 90,
    is_fowarded: true,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### ChartFeesPaid

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chart-fees-paid

@Query
  {
    [days]: <Fees Earned Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    [in]: <In Node Public Key or Alias String>
    [is_most_fees_table]: <Is Most Fees Table Bool>
    [is_most_forwarded_table]: <Is Most Forwarded Bool>
    [is_network]: <Show Only Non-Peers In Table Bool>
    [is_peer]: <Show Only Peers In Table Bool>
    [nodes]: <Saved Nodes String Array>
    [out]: <Out Node Public Key or Alias String>
    [start_date]: <Start Date YYYY-MM-DD String>
  }

@Response
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

try {
  const url = 'http://localhost:8055/api/chart-fees-paid';

  const query = {
    days: 90,
    in: 'yalls',
    is_peer: true,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### ChartPaymentsReceived

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/chart-payments-received

@Query
  {
    [days]: <Fees Earned Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    [nodes]: <Saved Nodes String Array>
    [start_date]: <Start Date YYYY-MM-DD String>
  }

@Response
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

try {
  const url = 'http://localhost:8055/api/chart-payments-received';

  const query = {
    days: 90,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Closed

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/closed

@Query
  {
    [limit]: <Limit Number>
    [node]: <Saved Node String>
  }

@Response
  {
    peer_public_key: <Peer Public Key Hex String>
    [peer_alias]: <Peer Alias Strring>
    [is_local_force_close]: <Channel Was Locally Force Closed Bool>
    [is_cooperative_close]: <Channel Was Cooperatively Closed Bool>
    [is_remote_force_close]: <Channel was Remotely Force Closed Bool>
    [peer_closed_channel]: <Peer Closed the Channel Bool>
    blocks_since_close: <Count of Blocks Since Close Number>
    capacity: <Channel Capacity Tokens Number>
    [channel_id]: <Channel Id String>
    channel_open: <Channel Funding Outpoint String>
    channel_close: <Channel Close Transaction Id Hex String>
    [channel_balance_spend]: <Channel Balance Spent In Tx Id Hex String>
    [channel_resolutions]: [{
      type: <Resolution Type String>
      value: <Value Number>
    }]
    [is_breach_close]: <Channel Was Breach Closed Bool>
    [closing_fee_paid]: <Closing Fees Paid Related To Channel Tokens Number>
  }
*/

try {
  const url = 'http://localhost:8055/api/closed';

  const query = {
    limit: 30,
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Find

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/find

@Query
  {
    query: <Query String>
    [node]: <Saved Node String>
  }

@Response
  {
    [chain_transaction]: {
      [chain_fee]: <Paid Transaction Fee Tokens Number>
      [received]: <Received Tokens Number>
      related_channels: [{
        action: <Channel Action String>
        [balance]: <Channel Balance Tokens Number>
        [capacity]: <Channel Capacity Value Number>
        [channel]: <Channel Standard Format Id String>
        [close_tx]: <Channel Closing Transaction Id Hex String>
        [open_tx]: <Channel Opening Transaction id Hex String>
        [timelock]: <Channel Funds Timelocked Until Height Number>
        with: <Channel Peer Public Key Hex String>
      }]
      [sent]: <Sent Tokens Number>
      [sent_to]: [<Sent to Address String>]
      [tx]: <Transaction Id Hex String>
    }
    [channels]: [<Channel Object>]
    [nodes]: [<Node Object>]
    [payment]: <Payment Object>
    [payment_failed]: <Payment Failed Object>
    [payment_pending]: <Payment Pending Bool>
  }
*/

try {
  const url = 'http://localhost:8055/api/find';

  const query = {
    query: 'bitrefill',
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Forwards

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/forwards

@Query
  {
    [days]: <Days Number>
    [from]: <Query Alias/Pubkey String>
    [node]: <Saved Node String>
    [sort]: <Sort By Field String>
    [to]: <Query Alias/Pubkey String>
  }

@Response
  {
    peers: [{
      alias: <Peer Alias String>
      earned_inbound_fees: <Earned Inbound Fee Tokens Number>
      earned_outbound_fees: <Earned Outbound Fee Tokens Number>
      last_inbound_at: <Last Inbound Forward At ISO 8601 Date String>
      last_outbound_at: <Last Forward At ISO 8601 Date String>
      liquidity_inbound: <Inbound Liquidity Big Tokens Number>
      outbound_liquidity: <Outbound Liquidity Big Tokens Number>
      public_key: <Public Key String>
    }]
  }
*/

try {
  const url = 'http://localhost:8055/api/forwards';

  const query = {
    days: 90,
    to: 'walletofsatoshi'
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Graph

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/graph

@Query
  {
    [filters]: [<Graph filters String Array>]
    Query: <Query Alias/Pubkey String>
    [node]: <Saved Node String>
    [sort]: <Sort By Field String>
  }

@Response
  {
    rows: [[<Table Cell String>]],
    summary: {
      id: <Node Public Key String>,
      node: <Node Alias String>,
      capacity: <Node Capacity String>,
      [is_accepting_large_channels]: <Accepting Large Channels Boolean>,
      [is_onion]: <Supports Onion Boolean>,
      [is_clearnet]: <Supports Clearnet Boolean>,
      [is_unconnectable]: <Unconnectable Boolean>,
      peer_count: <Peer Count Number>,
    }
  }
*/

try {
  const url = 'http://localhost:8055/api/graph';

  const query = {
    query: 'walletofsatoshi',
    filters: ['capacity>10000000', 'age<2000']
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Lnurl

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/lnurl

Supported functions: auth, channel, pay, withdraw

Function auth: Request authorization
@Query
  {
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    function: <Lnurl Function String>
    url: <Url String>
  }

@Response
  {
    is_authenticated: <Is Authenticated Bool>
  }

====================================================

Function channel: Request an incoming payment channel
@Query
  {
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    function: <Lnurl Function String>
    url: <Url String>
  }

@Response
  {
    is_authenticated: <Is Authenticated Bool>
  }

====================================================

Function pay: Pay to an lnurl/lightning address
@Query
  {
    amount: <Amount to Pay Number>
    [avoid]: [<Avoid Forwarding Through String>]
    function: <Lnurl Function String>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_paths]: <Max Paths to take Number>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    [out]: [<Pay Out Through Peer String Array>]
    url: <Lnurl/Lightning Address String>
  }

@Response
  {
    [fee]: <Fee Tokens To Destination Number>
    [id]: <Payment Hash Hex String>
    [latency_ms]: <Latency Milliseconds Number>
    [paid]: <Paid Tokens Number>
    [preimage]: <Payment HTLC Preimage Hex String>
    [relays]: [<Relaying Node Public Key Hex String]
    [success]: [<Standard Format Channel Id String>]
  }

====================================================

Function withdraw: Will create an invoice and send it to a service
@Query
  {
    amount: <Amount for withdraw Request Number>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    function: <Lnurl Function String>
    url: <Url String>
  }

@Response
  {
    withdrawal_request_sent: <Is Withdraw Request Sent Bool>
  }
*/

import { io } from 'socket.io-client';

try {
  const url = 'http://localhost:8055/api/lnurl';

  // Unique connection name for websocket connection.
  const dateString = Date.now().toString();

  // Supported functions: auth, channel, pay, withdraw

  // Query for auth function
  const query = {
    function: 'auth',
    message_id: dateString,
  };

  // Query for channel function
  const query = {
    function: 'channel',
    is_private: true,
    message_id: dateString,
  };

  // Query for pay function
  const query = {
    avoid: ['ban'],
    function: 'pay',
    max_fee: 20,
    max_paths: 2,
    message_id: dateString,
    out: ['02ce4aea072f54422d35eb8d82aebe966b033d4e98b470907f601a025c5c29a7dc'],
  };

  // Query for withdraw function
  const query = {
    amount: 100,
    function: 'withdraw',
    message_id: dateString,
  };


  // To get live logs while working with lnurl, you can start a websocket connection with the server and add an event listener.
  // Websocket url is the same as the server url http://localhost:8055
  // Messages from the server are passed to client using the dateString passed from above.
  const socket = io();

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

// Make sure to pass the same dateString from above
  socket.on(`${dateString}`, data => {
    console.log(data);
  });

  socket.on('error', err => {
    throw err;
  });

// End websocket code.

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Open

```javascript
/**
@PostRequest

@Url
http://localhost:8055/api/open

@Body
  {
    capacities: [<New Channel Capacity Tokens String>]
    cooperative_close_addresses: [<Cooperative Close Address>]
    gives: [<New Channel Give Tokens Number>]
    internal_fund_fee_rate: <Funding Fee Rate Number>,
    [is_avoiding_broadcast]: <Avoid Funding Transaction Broadcast Bool>
    opening_nodes: [<Open New Channel With Saved Node Name String>]
    public_keys: [<Public Key Hex String>]
    types: [<Channel Type String>]
  }

@Response
  {
    transaction_id: <Open Channels Transaction Id Hex String>
    transaction: <Open Channels Raw Transaction Id String>
  }
*/

try {
  const url = 'http://localhost:8055/api/open';

    const postBody = {
      ask: [],
      capacities: ['100000', '2000000'],
      cooperative_close_addresses: [],
      gives: [20000, 30000],
      internal_fund_fee_rate: 1,
      is_avoiding_broadcast: false,
      opening_nodes: [],
      public_keys: ['pubkey1', 'pubkey2'],
      set_fee_rates: [],
      types: ['public', 'private'],
    };


    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await axios.post(url, postBody, config);
} catch (error) {
  console.error(error);
}
```
<br></br>

### Pay

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/pay

@Query
  {
    amount: <Amount to Push Tokens String>
    avoid: [<Avoid Forwarding Through String>]
    [in_through]: <Pay In Through Peer String>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_paths]: <Max Paths to take Number>
    [message]: <Message to Include With Payment String>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    [out]: [<Pay Out Through Peer String Array>]
    request: <BOLT 11 Payment Request String>
  }

@Response
  {
    [fee]: <Fee Tokens To Destination Number>
    [id]: <Payment Hash Hex String>
    [latency_ms]: <Latency Milliseconds Number>
    [paid]: <Paid Tokens Number>
    [preimage]: <Payment HTLC Preimage Hex String>
    [relays]: [<Relaying Node Public Key Hex String]
    [success]: [<Standard Format Channel Id String>]
  }
*/

import { io } from 'socket.io-client';

try {
  const url = 'http://localhost:8055/api/pay';

  // Unique connection name for websocket connection.
  const dateString = Date.now().toString();

  const query = {
    avoid: ['ban'],
    in_through: '02ce4aea072f54422d35eb8d82aebe966b033d4e98b470907f601a025c5c29a7dc',
    max_fee: 20,
    message_id: dateString,
    out: ['02ce4aea072f54422d35eb8d82aebe966b033d4e98b470907f601a025c5c29a7dc'],
    request: 'lnbcrt500n1p30ust0pp5n07x3ckwhxunpxy4gp2azckwqk8tlaqgl3hu036u5qa77dfj2f6sdqqcqzpgxqyz5vqsp54eg7zhnnrcnkhr848asghvuu349k00a5cltx56ctnt7a80jcjgxq9qyyssqsms9wv8d9244l03wasz40mfaw3xgfxjth4c02mk958gjj0yzm6cx6mne28auz3vk0kypqwnsp37pde958wxu7vrqmmpxp9f3td64jnqp0q0gas',
  };

  // To get live logs while paying an invoice, you can start a websocket connection with the server and add an event listener.
  // Websocket url is the same as the server url http://localhost:8055
  // Messages from the server are passed to client using the dateString passed from above.
  const socket = io();

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

// Make sure to pass the same dateString from above
  socket.on(`${dateString}`, data => {
    console.log(data);
  });

  socket.on('error', err => {
    throw err;
  });

// End websocket code.

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Peers

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/peers

@Query
  {
    [earnings_days]: <Routing Fee Earnings Days Number>
    [filters]: [<Formula Expression String>]
    [idle_days]: <Not Active For Days Number>
    [is_active]: <Active Channels Only Bool>
    [is_offline]: <Offline Channels Only Bool>
    [is_private]: <Private Channels Only Bool>
    [is_public]: <Public Channels Only Bool>
    [is_table]: <Peers As Table Bool>
    [omit]: [<Omit Peer With Public Key Hex String>]
    [sort_by]: <Sort Results By Attribute String>
    [tags]: [<Tag Identifier String>]
  }

@Response
  {
    [fee]: <Total Fee Tokens To Destination Number>
    [latency_ms]: <Latency Milliseconds Number>
    [relays]: [[<Relaying Public Key Hex String>]]
    [routes_maximum]: <Maximum Sendable Tokens on Paths Number>
  }
*/

try {
  const url = 'http://localhost:8055/api/peers';

  const query = {
    earnings_days: 10,
    filters: ['capacity>10*m', 'disk_usage_mb > 9'],
    is_public: true,
    omit: ['02b3a846aaaea071639703900bbe72fec3fd2f9badc59ce80b089c6b7f7f4841f7'],
    tags: ['inPeers']
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```
<br></br>

### Price (GET Request)

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/price

@Query
  {
    [from]: <Price provider String (coinbase, coindesk(default), coingecko)>
    [node]: <Saved Node String>
    symbols: [<Fiat Symbol String>] Defaults to USD
  }

@Response
  {
    tickers: [{
      date: <Rate Updated At ISO 8601 Date String>
      rate: <Exchange Rate in Cents Number>
      ticker: <Ticker Symbol String>
    }]
  }
*/

try {
  const url = 'http://localhost:8055/api/price';

  const query = {
    symbols: ['USD', 'GBP'],
  };

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Probe

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/probe

@Query
  {
    [avoid]: <Avoid String Array>
    [destination]: <Destination pubkey/Payment Request string>
    [find_max]: <Boolean>
    [in_through]: <Pay In Through Public Key Hex String>
    [max_paths]: <Maximum Probe Paths Number>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    out: [<Out Through Peer With Public Key Hex String Array>]
    [tokens]: <Tokens Amount String>
  }

@Response
  {
    [fee]: <Total Fee Tokens To Destination Number>
    [latency_ms]: <Latency Milliseconds Number>
    [relays]: [[<Relaying Public Key Hex String>]]
    [routes_maximum]: <Maximum Sendable Tokens on Paths Number>
  }
*/

import { io } from 'socket.io-client';

try {
  const url = 'http://localhost:8055/api/probe';

  // Unique connection name for websocket connection.
  const dateString = Date.now().toString();

  const query = {
    avoid: ['ban'],
    destination: '02dc8800af7b6f18b7eefbfb3112b99f2c0f0196475f99b8210b73ecd0c638f0e3',
    in_through: '02ce4aea072f54422d35eb8d82aebe966b033d4e98b470907f601a025c5c29a7dc',
    max_paths: 1,
    message_id: dateString,
    tokens: '100',
  };

  // To get live logs while probing, you can start a websocket connection with the server and add an event listener.
  // Websocket url is the same as the server url http://localhost:8055
  // Messages from the server are passed to client using the dateString passed from above.
  const socket = io();

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

// Make sure to pass the same dateString from above
  socket.on(`${dateString}`, data => {
    console.log(data);
  });

  socket.on('error', err => {
    throw err;
  });

// End websocket code.

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Rebalance

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/rebalance

@Query
  {
    [avoid]: [<Avoid Forwarding Through Node With Public Key Hex String>]
    [in_filters]: [<Inbound Filter Formula String>]
    [in_outbound]: <Inbound Target Outbound Liquidity Tokens Number>
    [in_through]: <Pay In Through Peer String>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [max_rebalance]: <Maximum Amount to Rebalance Tokens String>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    [out_filters]: [<Outbound Filter Formula String>]
    [out_inbound]: <Outbound Target Inbound Liquidity Tokens Number>
    [out_through]: <Pay Out Through Peer String>
    [timeout_minutes]: <Deadline To Stop Rebalance Minutes Number>
  }

@Response
  {
    rebalance: [
      {
        [increased_inbound_on]: <Number>,
        [liquidity_inbound]: <Number>,
        [liquidity_inbound_opening]: <Number>,
        [liquidity_inbound_pending]: <Number>,
        [liquidity_outbound]: <Number>,
        [liquidity_outbound_opening]: <Number>,
        [liquidity_outbound_pending]: <Number>,
      },
      {
        [decreased_inbound_on]: <Number>,
        [liquidity_inbound]: <Number>,
        [liquidity_inbound_opening]: <Number>,
        [liquidity_inbound_pending]: <Number>,
        [liquidity_outbound]: <Number>,
        [liquidity_outbound_opening]: <Number>,
        [liquidity_outbound_pending]: <Number>,
      },
      {
        [rebalanced]: <Number>,
        [rebalance_fees_spent]: <Number>,
        [rebalance_fee_rate]: <Number>,
      },
    ],
  }
*/

import { io } from 'socket.io-client';

try {
  const url = 'http://localhost:8055/api/rebalance';

  // Unique connection name for websocket connection.
  const dateString = Date.now().toString();

  const query = {
    avoid: ['ban'],
    out_through: 'acinq',
    in_through: 'yalls',
    message_id: dateString,
    max_fee: 1000,
    max_fee_rate: 500,
    max_rebalance: '2000000'
  };

  // To get live logs while rebalancing, you can start a websocket connection with the server and add an event listener.
  // Websocket url is the same as the server url http://localhost:8055
  // Messages from the server are passed to client using the dateString passed from above.
  const socket = io();

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

// Make sure to pass the same dateString from above
  socket.on(`${dateString}`, data => {
    console.log(data);
  });

  socket.on('error', err => {
    throw err;
  });

// End websocket code.

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

### Reconnect

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/reconnect

@Query
  {
    [node]: <Saved Node String>
  }

@Response
  {
    offline: [{
      alias: <Node Alias String>
      public_key: <Node Identity Public Key Hex String
    ]}
    reconnected: [{
      alias: <Node Alias String>
      public_key: <Node Identity Public Key Hex String
    }]
  }
*/

try {
  const url = 'http://localhost:8055/api/reconnect';

  const query = {};

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>


### Send

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/send

@Query
  {
    amount: <Amount to Push Tokens String>
    avoid: [<Avoid Forwarding Through String>]
    destination: <Destination Public Key Hex String>
    [in_through]: <Pay In Through Peer String>
    [is_dry_run]: <Do Not Push Payment Bool>
    [is_omitting_message_from]: <Do Not Include From Key In Message Bool>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [message]: <Message to Include With Payment String>
    message_id: <DateTime stamp string>
    [node]: <Saved Node String>
    [out_through]: <Pay Out Through Peer String>
  }

@Response
  {
    [fee]: <Fee Tokens To Destination Number>
    [id]: <Payment Hash Hex String>
    [latency_ms]: <Latency Milliseconds Number>
    [route_maximum]: <Maximum Sendable Tokens On Successful Probe Path Number>
    [paid]: <Paid Tokens Number>
    [preimage]: <Payment HTLC Preimage Hex String>
    [relays]: [<Relaying Node Public Key Hex String]
    [success]: [<Standard Format Channel Id String>]
  }
*/

import { io } from 'socket.io-client';

try {
  const url = 'http://localhost:8055/api/send';

  // Unique connection name for websocket connection.
  const dateString = Date.now().toString();

  const query = {
    avoid: ['ban'],
    destination: '02dc8800af7b6f18b7eefbfb3112b99f2c0f0196475f99b8210b73ecd0c638f0e3',
    in_through: '02ce4aea072f54422d35eb8d82aebe966b033d4e98b470907f601a025c5c29a7dc',
    max_fee: 20,
    message_id: dateString,
    tokens: '100',
  };

  // To get live logs while pushing a payment, you can start a websocket connection with the server and add an event listener.
  // Websocket url is the same as the server url http://localhost:8055
  // Messages from the server are passed to client using the dateString passed from above.
  const socket = io();

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

// Make sure to pass the same dateString from above
  socket.on(`${dateString}`, data => {
    console.log(data);
  });

  socket.on('error', err => {
    throw err;
  });

// End websocket code.

  const response = await axios.get(url, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
} catch (error) {
  console.error(error);
}
```

<br></br>

