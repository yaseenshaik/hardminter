/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
    solidity: "0.8.0",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        ropsten: {
            url: API_URL,
            accounts: [`${PRIVATE_KEY}`],
            // gas: 6612388, // Gas limit used for deploys
            // gasPrice: 2700000000000,
        },
    },
};