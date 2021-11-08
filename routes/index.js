var express = require("express");
var router = express.Router();
var solc = require("solc");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { ethers } = require("hardhat");
const { instantiateContract } = require("../scripts/instantiateContract");
require("dotenv").config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(API_URL);

// localhost
const Web3 = require("web3");

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Hello World!");
});

router.post("/contract/deploy", async function (req, res, next) {
  const contractName = req.body.name;
  const contractSymbol = req.body.symbol;
  if (!contractName && !contractSymbol) {
    return res.status(500).send({
      message: "unauthorized",
    });
  }
  const solidityFile = `
    //Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

    contract ${contractName} is ERC721URIStorage, Ownable {
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds;

        constructor() public ERC721("${contractName}", "${contractSymbol}") {}

        function mintNFT(address recipient, string memory tokenURI)
            public
            onlyOwner
            returns (uint256)
        {
            _tokenIds.increment();

            uint256 newItemId = _tokenIds.current();
            _mint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURI);

            return newItemId;
        }
    }
  `;
  const fileName = path.resolve(
    __dirname,
    "../contracts",
    `${contractName}.sol`
  );

  try {
    await fs.writeFile(fileName, solidityFile);
    /* const source = await fs.readFile(fileName, 'UTF-8');
    var input = {
      language: 'Solidity',
      sources: {
        'MyNFT.sol': {
          content: source
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };
    console.log(JSON.parse(solc.compile(JSON.stringify(input)))); */
    await exec("yarn compile");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const MyNFT = await ethers.getContractFactory(contractName);

    // Start deployment, returning a promise that resolves to a contract object
    const myNFT = await MyNFT.deploy();
    console.log("Contract deployed to address:", myNFT.address);
    res.send("Hello World!");
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).send(err);
  }
});

router.post("/mint/token", async function (req, res, next) {
  const tokenURI = {
    description: "The world's most adorable and sensitive pup.",
    image:
      "https://gateway.pinata.cloud/ipfs/QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb",
    name: "Ramses",
  };
  const contract = require("../artifacts/contracts/MyTest.sol/MyTest.json");
  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  console.log("process.env.CONTRACT_ADDRESS: ", process.env.CONTRACT_ADDRESS);
  console.log("contractAddress: ", contractAddress);
  const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  const gas = await web3.eth.estimateGas({
    from: PUBLIC_KEY,
    nonce,
    to: contractAddress,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  });
  // console.log("est gas: ", gas);
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
            res.send(hash);
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
            return res.status(500).send(err);
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
      return res.status(500).send(err);
    });
});

router.get("/compile", async function (req, res) {
  try {
    const helloPath = path.resolve(__dirname, "../contracts", "MyTest.sol");
    const source = await fs.readFileSync(helloPath, "UTF-8");
    const output = instantiateContract(helloPath);
    console.log("output: ", output);
    // var input = {
    //   language: "Solidity",
    //   sources: {
    //     "MyTest.sol": {
    //       content: source,
    //     },
    //   },
    //   settings: {
    //     outputSelection: {
    //       "*": {
    //         "*": ["*"],
    //       },
    //     },
    //   },
    // };
    // console.log(solc.compile(source, 1));
    // console.log("compiling contract");
    // let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
    // console.log("Contract Compiled", compiledContract);
    res.json(output);
  } catch (err) {
    console.log("err: ", err);
  }
});

module.exports = router;
