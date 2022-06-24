<h1>Building a gui for balanceofsatoshis, work in progress</h1>

## Supported commands

```shell
# See an accounting formatted list of various types of transactions
bos accounting "category"

# See total balance, including pending funds, excluding future commit fees
bos balance

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

# Tags can be used in other commands via tag and avoid options
bos tags
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
    extra_hosts:
      - 'umbrel.local:10.21.21.9'
networks:
  default:
    external: true
    name: umbrel_main_network
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
    extra_hosts:
      - 'umbrel.local:10.21.21.9'
networks:
  default:
    external: true
    name: umbrel_main_network
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

### After installing Node.js, you can install yarn, (use sudo if permission is denied)
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
yarn build

# Run the app
yarn start:prod
```
App will run on http://localhost:8055. If you installed the app on your node machine and trying to access it on the browser on a different machine, then use the hostname of the machine the app is running on, example: http://raspberrypi.local:8055

Raspblitz/Raspibolt might have a firewall blocking from accessing your app in the browser. Add the port to the firewall rules.
```
sudo ufw allow 8055
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

### Encryping Macaroon
If you authenticated using option 2 above, there is a way to encrypt your macaroon.

<b>For docker:</b>

- Create a .env file in any location of your choice
- Inside the .env file set `ENCRYPTION_KEY="yourEncryptionKey"`
- The key should be 32 characters long, humans are terrible at generating passwords and random strings, easiest way to generate an encryption key would be running `openssl rand -hex 32` on your terminal.
- A sample encryption key would look like this: `ENCRYPTION_KEY="b4970320a3601d19b876c18ce2eb895d687962d3f0b72e0d4de05ed74be34d9a"`
- Inside the docker-compose file add the path to the .env file under the volumes section:
```
volumes:
  - ~/.bosgui:/home/node/.bosgui
  - /path/to/Lnd:/home/node/.lnd
  - type: bind
    source: /path/to/.env
    target: /lndboss/.env
```

<b>For Build from source</b>

- Create a .env file in the root of the project folder (lndboss folder)
- Inside the .env file set `ENCRYPTION_KEY="yourEncryptionKey"`
- The key should be 32 characters long, humans are terrible at generating passwords and random strings, easiest way to generate an encryption key would be running `openssl rand -hex 32` on your terminal.
- A sample encryption key would look like this: `ENCRYPTION_KEY="b4970320a3601d19b876c18ce2eb895d687962d3f0b72e0d4de05ed74be34d9a"`

## Demo

https://user-images.githubusercontent.com/84944042/172693877-a19c1ba3-0579-4537-8322-924fe1ab0f70.mp4



