const express = require('express');
const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');
const app = express();
const axios = require("axios");

const privateKeyETH = "";
const privateKeyBSC = "";
const InfuraHttpAPI = "";
const BSCHttpAPI = "";
const contractToCheckETH = "0xcb4ba158e227692e6775e623baac7707cb284aff";
const contractToCheckBSC = "0x626785bcfaa5248cd6cc200d1371d000075dbf3d";

const web3 = new Web3(InfuraHttpAPI);
var BN = web3.utils.BN;

const burnABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_maxSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_tzHash",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      }
    ],
    "name": "rescueEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_receiverAddress",
        "type": "address"
      }
    ],
    "name": "rescueTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_claimer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes",
        "name": "_ethTransactionHash",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TransferedFromETH",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferToETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_tzHash",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getMessageHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "isMinted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const swapABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenContractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "FreezedOnETH",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_claimer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes",
        "name": "_bscTransactionHash",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "UnfreezedOnETH",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_tzHash",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getMessageHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "isMinted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      }
    ],
    "name": "rescueEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_receiverAddress",
        "type": "address"
      }
    ],
    "name": "rescueTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sumFreezed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "swapToBSC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenConractAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_tzHash",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "unfreezeTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const signMessage = (amount, hash, fromAddress, privateKey) => {
  const dataToSign = web3.utils.soliditySha3(
    amount,
    hash,
    fromAddress
  );
  const sign = web3.eth.accounts.sign(dataToSign, privateKey);

  return sign;
}

const decodeTransactionInput = (input, abi) => {
  const decoder = new InputDataDecoder(abi);
  const decoded = decoder.decodeData(input);
  return decoded
}

const getTransactionByHash = async (hash, apiURL) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .post(apiURL, {
        id: 0,
        jsonrpc: "2.0",
        method: "eth_getTransactionByHash",
        params: [hash],
      })
      .then((data) => data.data)
      .then(({ result }) => resolve(result))
      .catch(() => reject({ error: "Error get transaction by hash" }))
  });
}

const checkIfTransactionNotRejected = (hash, apiURL) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .post(apiURL, {
        id: 0,
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [hash],
      })
      .then((data) => data.data)
      .then(({ result }) => resolve(result.status))
      .catch(() => reject({ error: "Error get transaction receipt by hash" }))
  });
}

const checkIfValidContract = (contract, contractToCheck) => {
  return new Promise(async (resolve, reject) => {
    if (contract.toLowerCase() === contractToCheck.toLowerCase()) {
      resolve()
    } else {
      reject()
    }
  });
}

const getActualETHBlockNumber = async (apiURL) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .post(apiURL, {
        id: 0,
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
      })
      .then((data) => data.data)
      .then(({ result }) => resolve(parseInt(result, 16)))
      .catch(() => reject({ error: "Error get block number" }))
  });
}

const checkIfTransactionValidated = async (transactionBlockNumber, apiURL, minimunAmountOfConfirmations = 10) => {
  return new Promise(async (resolve, reject) => {
    await getActualETHBlockNumber(apiURL)
      .then(actualTransactionBlockNumber => resolve(actualTransactionBlockNumber - transactionBlockNumber > minimunAmountOfConfirmations))
      .catch((error) => reject(error));
  })
}

const getTransactionSign = async (hash, methodToCheck, contractToCheck, abi, privateKey, apiURL) => {
  return new Promise(async (resolve, reject) => {
    await getTransactionByHash(hash, apiURL)
      .then(async (transactionData) => {
        console.log(transactionData)
        await checkIfValidContract(transactionData.to, contractToCheck)
          .then(async () => {
            await checkIfTransactionNotRejected(hash, apiURL)
              .then(async (status) => {
                if (status) {
                  const decoded = decodeTransactionInput(transactionData.input, abi);
                  const isValidTrasnfer = decoded.method == methodToCheck;

                  if (isValidTrasnfer) {
                    const transactionBlockNumber = parseInt(transactionData.blockNumber, 16);
                    const transactionFromAddress = transactionData.from;
                    const transactionHash = transactionData.hash;
                    const transactionAmount = new BN(decoded.inputs[0]);

                    await checkIfTransactionValidated(transactionBlockNumber, apiURL)
                      .then(isTransactionValidated => {
                        if (isTransactionValidated) {
                          resolve(signMessage(
                            transactionAmount.toString(),
                            transactionHash,
                            transactionFromAddress,
                            privateKey));
                        } else {
                          reject({ error: "Transaction not confirmed yet" });
                        }
                      })
                      .catch((error) => reject(error));
                  } else {
                    reject({ error: "Transaction not valid" });
                  }
                } else {
                  reject({ error: "Transaction failed" })
                }
              })
              .catch(error => reject(error))
          })
          .catch(() => {
            reject({ error: "Contract address not valid" })
          })
      })
      .catch((error) => reject(error));
  });
}

app.get('/toBSC/:hash', async (req, res) => {
  await getTransactionSign(req.params.hash, "swapToBSC", contractToCheckETH, swapABI, privateKeyETH, InfuraHttpAPI)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    })
})

app.get('/toETH/:hash', async (req, res) => {
  await getTransactionSign(req.params.hash, "burn", contractToCheckBSC, burnABI, privateKeyBSC, BSCHttpAPI)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    })
})

// FOR NODE ENVIRONMENT
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})
module.exports = app
