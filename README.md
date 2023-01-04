<h1>A GUI For BalanceOfSatoshis</h1>

[![npm version](https://badge.fury.io/js/lndboss.svg)](https://badge.fury.io/js/lndboss)
[![docker pulls](https://img.shields.io/docker/pulls/niteshbalusu/lndboss?style=flat-round)](https://hub.docker.com/r/niteshbalusu/lndboss)

#### For questions or support, please reach out on telegram.
https://t.me/lndboss

## Supported commands

```shell
# See an accounting formatted list of various types of transactions
accounting "category"

# See total balance, including pending funds, excluding future commit fees
balance

# Call ln-service raw APIs
call "method"

# Get the number of days the node cert remains valid
cert-validity-days

# Receive on-chain funds via a regular address
chain-deposit

# See the current fee estimates confirmation targets
chainfees

# Show chain fees paid
chart-chain-fees

# Show routing fees earned
chart-fees-earned

# Show routing fees paid
chart-fees-paid

# Show a chart of payments received
chart-payments-received

# Remove old failed payment data for probes and other failed payments
clean-failed-payments

# See details on how closed channels resolved on-chain
closed

# Create a group channel request
create-group-channel

# View outbound fee rates and update outbound fee rates to peers
fees

# Query the node to find something like a payment, channel or node
find "query"

# Output a summarized version of peers forwarded towards
forwards

# Look up the channels and fee rates of a node by its public key
graph "pubkey"

# Create an invoice and get a BOLT 11 payment request
invoice "amount"

# Joins a group channel request
join-group-channel "invite_code"

# Collection of lnurl features
lnurl "function"

# Batch open channels, zero conf supported
open "pubkeys"

# Pay a payment request (invoice), probing first
pay "payment_request"

# Show channel-connected peers
peers

# Output the price of BTC
price

# Test if funds can be sent to a destination
probe "payment_request/public_key"

# Rebalance funds between peers
rebalance

# Reconnect to offline peers
reconnect

# Send funds using keysend or lnurl/lightning address and an optional message to a node
send

# Tags can be used in other commands via tag and avoid options
tags

# Show list of utxos
utxos
```

### LndBoss is now available for one click install in AppStores of:

- Citadel
- Embassy
- Umbrel

<br />
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

- From the dashboard page, click on Connect To Lnd on the left app drawer, select Authenticate, and select the option `Path to LND directory`
-  Enter the full LND directory, example: `/home/ubuntu/nitesh/.lnd`. 
- Socket would be `localhost:10009`, if you're running lndboss on a different machine from your node, then you'll have to set it to `hostname:10009`, example: `raspberrypi.local:10009`
- Click `Authenticate`, your credentials will be verified and presented with a success/failure message.
- If it succeeds, you can start running commands.

<br></br>

### Option 2: (Using base64 credentials)

- From the dashboard page, click on Connect To Lnd on the left app drawer, select Authenticate, and select the option `credentials`.
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