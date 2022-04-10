# Eleos

- [Eleos](#eleos)
  - [Project structure](#project-structure)
  - [Deployment](#deployment)
    - [Software Requirements](#software-requirements)
    - [Project Setup](#project-setup)
    - [Summary of settings](#summary-of-settings)
    - [Workflow](#workflow)
  - [Development / Testing](#development--testing)
    - [Software Requirements](#software-requirements-1)
    - [Summary of settings](#summary-of-settings-1)
    - [Project Setup](#project-setup-1)
    - [Workflow](#workflow-1)
  - [Accessing Ethereum Network Data on Frontend](#accessing-ethereum-network-data-on-frontend)
    - [Setting Up Metamask](#setting-up-metamask)

## Project structure
```
.
├── docker-compose.yml      # For production deployment
├── docker-compose-dev.yml  # For development deployment
|
├── .github/workflows       
│   ├── backend.yml         # Backend testing workflow
│   ├── frontend.yml        # Frontend testing workflow
│   └── blockchain.yml      # Smart contract testing workflow
|
├── backend                 
│   ├── campaignListener  
│   |   ├── listener.js
│   |   └── ...  
│   ├── test                # Mocha/Chai test files
│   ├── src                 # Koa/Mongoose.js source files
│   ├── index.js            # Main
│   └── ...                 
|
├── frontend                
│   ├── test                # Jest test files
│   └── ...                 # Nuxt.js/Vue.js source files
|
├── blockchain              
│   ├── contracts           # Solidity source files
│   ├── test                # Truffle test files
│   └── ...  
|
├── scripts              
│   ├── start-eleos.sh           # Startup script
│   ├── stop-eleos.sh            # Shutdown script
│   └── get-ganache-accounts.sh  # Script to get generated wallet accounts 
|           
├── README.md
├── .gitignore
├── .dockerignore
└── ...   
```

## Deployment

### Software Requirements

1) [Ubuntu](https://ubuntubudgie.org/) as deployment/development environment
2) [Docker](https://docs.docker.com/engine/install/ubuntu/)
3) [Docker Compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)
4) Internet Access

### Project Setup

1) Clone the repository
    ```bash
    git clone https://github.com/IS4302-Eleos/Eleos.git
    ```
2) Change current working directory to root of the repository:
    ```bash
    cd /path/to/Eleos/
    ```

### Summary of settings

1) Frontend running on `127.0.0.1:80`
2) Backend running on `127.0.0.1:8080`
3) Ganache running on `127.0.0.1:8545`

### Workflow

1) Startup Eleos
    ```bash
    scripts/start-eleos.sh
    ```
    __Note: The first starup could take quite some time as this script involves building of the necessary Docker images__

2) Get list of wallet addresses and private keys
    ```bash
    scripts/get-ganache-accounts.sh 
    ```

3) Interact with the application at `http://localhost:80`

4) Shutdown Eleos gracefully
    ```bash
    scripts/stop-eleos.sh
    ```

## Development / Testing

### Software Requirements

1) [Ubuntu](https://ubuntubudgie.org/) as deployment/development environment
2) Node 16+ as our poison
3) npm as our seasonings to our poison
4) Ganache UI (Optional)
5) [Docker](https://docs.docker.com/engine/install/ubuntu/)
6) Internet Access

### Summary of settings

1) Ganache running on `127.0.0.1:8545`
2) MongoDB running on `127.0.0.1:27017`
3) Koa running on `127.0.0.1:3000`
4) MongoDB credentials are `test:test`

### Project Setup

__Note: Same steps can be taken for `backend` / `frontend` / `blockchain`__

1) Clone the repository
    ```bash
    git clone https://github.com/IS4302-Eleos/Eleos.git
    ```
2) Change current working directory to respective directory:
    ```bash
    cd /path/to/Eleos/<backend|frontend|blockchain>
    ```

3) Install `npm` packages:
    ```bash
    npm install
    ```

### Workflow

__Note: Same steps can be taken for `backend` / `frontend` / `blockchain`__

1) Create a new branch (preferably with a descriptive name)
2) Checkout to the new branch 
3) Setup the necessary services (e.g `ganache`, `mongodb`):
    ```bash
    # If you have ganache UI installed, configure the RPC server to listen on 127.0.0.1:8545.
    # But if you do not have ganache GUI installed,
    docker run --detach \
        --publish 8545:8545 \
        --name ganache \
        trufflesuite/ganache-cli \
        -d \
        --db /app \
        -i eleos \
        --accounts 20 \
        --deterministic \
        --mnemonic="grit portion captain traffic same bacon donate captain brown success impulse security"
    ```

    ```bash
    docker run --detach \
        --publish 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=test \
        -e MONGO_INITDB_ROOT_PASSWORD=test \
        --name mongo mongo
    ```

4) Change your current working directory to `/path/to/Eleos/<backend|frontend|blockchain>/` and write your code in it.
   ```bash
   cd /path/to/Eleos/<backend|frontend|blockchain>/
   ```
5) Write your test code in `./test/`
6) Run your test code.
    ```bash
    npm test
    ```
7) Identify codestyle violations in your code.
    ```bash
    npm run lint    # Reports violations
    npm run lintfix # Automatically fix violations but up to certain extent
    ```
8) Commit and push your code to your remote branch.
9) Create pull request and merge after PR reviews.


## Accessing Ethereum Network Data on Frontend

We use [MetaMask](https://metamask.io) as our Ethereum gateway and wallet management during our development. If you wish to use a different extension, do ensure that it supports [Ethers.js](https://docs.ethers.io/v5/).

### Setting Up Metamask

1. Install [Metamask](https://metamask.io/download/) and set up a wallet account.
2. Enable test networks in Metamask under `Settings > Advanced > Show Test Networks`.
3. Add the network you plan to use in MetmMask under `Settings > Networks > Add Network`.
      - If you are planning to run Eleos locally with default settings, you may skip this step as `localhost:8545` will be added by default for you.
      - The default chain ID is `1337`, you may change it in the Ganache docker environment settings. If you do change it, please rebuild the frontend with the environment variable `CHAIN_ID=0x??` where `0x??` is the hexadecimal representation of the chain ID you chose.
4. Switch your network in MetaMask to your newly added network.
5. Import or create the necessary accounts.
      - `scripts/get-ganache-accounts.sh` will provide accounts that contains 100 ETH each in your local Ganache network.
6. Go to the frontend webpage (http://localhost/ for production, http://localhost:3000/ for development).

