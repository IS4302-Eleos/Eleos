# Eleos

## Folder structure
```
.
├── .github/workflows       
│   ├── backend.yml         # Backend testing workflow
│   ├── frontend.yml        # Frontend testing workflow
│   └── blockchain.yml      # Smart contract testing workflow
├── backend                 # Koa/Mongose.js source files
│   ├── test                # Mocha/Chai test files
│   └── ...                 
├── frontend                # Nuxt.js/Vue.js source files
│   ├── test                # Jest test files
│   └── ...                 
├── blockchain              # Solidity source files
│   ├── test                # Truffle test files
│   └── ...                 
├── README.md
├── .gitignore
└── ...   
```

## Development / Testing

### Software Requirements

1) [Ubuntu](https://ubuntubudgie.org/) as deployment/development environment
2) Node 16+ as our poison
3) npm as our seasonings to our poison
4) Ganache UI (Optional)
5) [Docker](https://docs.docker.com/engine/install/ubuntu/)

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
    cd /path/to/eleos/<backend|frontend|blockchain>
    ```

3) Install `npm` packages:
    ```bash
    npm install
    ```

### Developing/Testing

__Note: Same steps can be taken for `backend` / `frontend` / `blockchain`__

1) Create a new branch (preferably with a descriptive name)
2) Checkout to the new branch 
3) Setup the necessary services (e.g `ganache`, `mongodb`):
    ```bash
    # If you have ganache UI installed, configure the RPC server to listen on 127.0.0.1:8545.
    # But if you do not have ganache GUI installed,
    docker run --detach \
        --publish 8545:8545 
        --name ganache trufflesuite/ganache-cli
    ```

    ```bash
    docker run --detach \
        --publish 27017:27017 
        -e MONGO_INITDB_ROOT_USERNAME=test 
        -e MONGO_INITDB_ROOT_PASSWORD=test 
        --name mongo mongo
    ```

4) Change your current working directory to `/path/to/<backend|frontend|blockchain>/` and write your code in it.
   ```bash
   cd /path/to/eleos/<backend|frontend|blockchain>/
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

### Deployment (TODO)