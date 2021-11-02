require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const hre = require("hardhat");
async function main() {
    const NFT = await hre.ethers.getContractFactory("MyNFT");
    const CONTRACT_ADDRESS = contractAddress;
    const contract = NFT.attach(CONTRACT_ADDRESS);
    const owner = await contract.ownerOf(1);
    console.log("Owner:", owner);
    const uri = await contract.tokenURI(1);
    console.log("URI: ", uri);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });