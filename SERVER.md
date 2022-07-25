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

- To perform any API calls, you need an authentication token, the login API call returns a JWT Authentication token that is valid for 15 mins, which needs to be used make calls any other calls to the server.

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

- All commands take the following headers for authentication:

```javascript
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer authTokenFromLogin`,
},
```

- Every command except `Tags` takes `node` query parameter as LndBoss supports multiple nodes, if you have a default node setup, you can pass a blank string or blank string array based on command you're trying to call.

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
    is_csv: <Boolean>
    is_fiat_disabled: <Boolean>
    [month]: <String>
    [rate_provider]: <String>
    [year]: <String>
    node: <String>
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
    node: '',
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

### Cert-Validity-Days (GET Request)

```javascript
/**
@GetRequest

@Url
http://localhost:8055/api/cert-validity-days

@Query
  {
    [below]: <Number>
    node: <String>
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
    node: '',
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
    [amount]: <Number>
    [format]: <String>
    node: <String>
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
    node: '',
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
    node: <String>
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
    [nodes]: <Nodes String Array>
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
    nodes: [],
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
