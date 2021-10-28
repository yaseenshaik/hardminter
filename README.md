# NFT create and deploy

### Tutorial

https://ethereum.org/en/developers/tutorials/how-to-write-and-deploy-an-nft

### Pre-requisites

- Node.js
- yarn pkg manager
- Alchemy account (to connect to the blockchain.)

### Install

- yarn install
- copy and save `.env` file

### Hardhat commands

To run hardhard

- locally: `hh:local`
- ropsten: `hh:ropsten`

Please replace `hh` commands below with the right command depending on the network you wish to work with.

**IMPORTANT** Please check `hardhat.config.js` when you deploy somewhere else than local.

### Deploy

**You don't have to this as the contract is already deployed to ropsten. https://ropsten.etherscan.io/address/0xA9317568b8917076575B55A16B7669b94b8F29ff**

You can deploy this to your local node

- Make sure your local node is running with `yarn node`
- Compile the .sol files with `yarn compile`. This will create an "artifacts" folder which is needed to deploy and later run functions
- Call the `scripts/deploy.js` script with hardhat. `yarn hh scripts/deploy.js`

### Mint NFTs

- `yarn hh scripts/min-nft.js`

### Get NFT owner (check after minting)

- `yarn hh scripts/get-owner.js`

### IMPORTANT

- the blockchain only stores the owner of the NFT and the location of the meta data URI.
- the token metadata called as `tokenURI` is a json file which is stored off chain.
- IPFS filesystem is the upcoming choice for the storage of the meta data json.
