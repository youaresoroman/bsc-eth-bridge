# ETH - BSC bridge message signer

## Node dependencies

- ethereum-input-data-decoder
- express
- web3
- axios

## Web3 Instance and signing

Ethereum provider must be set, Infura API and BSC public RPC used in this example (global constant "InfuraAPI" and "BSCHttpAPI")

Private key must be securely saved (global constants "privateKey\*")

## Instruction to deploy to AWS

Soon...

## Instruction to deploy to Deta

Full istructions how to use deta at https://docs.deta.sh/docs/home/
In this variant you have to take care of privateKey because it is not cyphered!!!

### After configuring CLI

#### Stage 1

Make a new project

```bash
deta new --node eth-bsc-bridge
cd eth-bsc-bridge
npm i
```

#### Stage 2

Copy index_node.js and package.json to project root then run following command

```bash
npm i
```

#### Stage 3

Deploy project to Deta

```bash
deta deploy
```

## Functions

### External

```javascript
await getTransactionSign(
  transactionHash,
  abiMethodToCheck,
  contractToCheck,
  contractABI,
  privateKey,
  httpAPIURL
)
  .then((result) => {
    // Signed message
  })
  .catch((error) => {
    // Error message
  });
```

#### getTransactionSign

---

Checks transaction data to meet defined conditions then signs arbitrary data

##### Parameters

1. `String` - The transaction hash.
2. `String` - The ABI method to check.
3. `String` - The contract address to check.
4. `Object` - The ABI object.
5. `String` - Private key used to sign message.
6. `String` - The RPC service URL.

##### Returns

`Promise` returns `Object`: The signature object

- `message` - `String`: The the given message.
- `messageHash` - `String`: The hash of the given message.
- `r` - `String`: First 32 bytes of the signature
- `s` - `String`: Next 32 bytes of the signature
- `v` - `String`: Recovery value + 27

### Internal

#### getTransactionByHash

---

##### Parameters

1. `String` - The transaction hash.
2. `String` - The RPC service URL.

##### Returns

`Promise` returns `Object` - A transaction object its hash `transactionHash`:

- `hash` 32 Bytes - `String`: Hash of the transaction.
- `nonce` - `Number`: The number of transactions made by the sender prior to this one.
- `blockHash` 32 Bytes - `String`: Hash of the block where this transaction was in. `null` when its pending.
- `blockNumber` - `Number`: Block number where this transaction was in. `null` when its pending.
- `transactionIndex` - `Number`: Integer of the transactions index position in the block. `null` when its pending.
- `from` - `String`: Address of the sender.
- `to` - `String`: Address of the receiver. `null` when its a contract creation transaction.
- `value` - `String`: Value transferred in :ref:`wei <what-is-wei>`.
- `gasPrice` - `String`: Gas price provided by the sender in :ref:`wei <what-is-wei>`.
- `gas` - `Number`: Gas provided by the sender.
- `input` - `String`: The data sent along with the transaction.

#### decodeTransactionInput

---

##### Parameters

1. `String` - The transaction input.
2. `Object` - The ABI object.

##### Returns

`Object` - A result transaction input decoding :

- `method` - `String`: The the given message.
- `types` - `Object`: tuples are represented as a string containing types contained in the tuple.
- `inputs` - `Object`: tuples are represented as an array containing values contained in the tuple
- `names` - `Object`: tuples are represented as an array with 2 items. Item 1 is the name of the tuple, item 2 is an array containing the names of the values contained in the tuple.

#### checkIfTransactionNotRejected

---

##### Parameters

1. `String` - The transaction hash.
2. `String` - The RPC service URL.

##### Returns

`Promise` returns `boolean` - A result of checking transaction hash `transactionHash`

#### getActualETHBlockNumber

---

##### Parameters

1. `String` - The RPC service URL.

##### Returns

`Promise` returns `number` - latest block number

#### checkIfValidContract

---

##### Parameters

1. `String` - The contract address from transaction.
2. `String` - The contract address.

##### Returns

`Promise` resolve if address is ok, reject if address is not.

#### checkIfTransactionValidated

---

##### Parameters

1. `number` - The transaction block number.
2. `String` - The RPC service URL.
3. `number` - ( Optional ) The minimum amount of transaction to check

##### Returns

`Promise` returns `boolean` - A result of checking minimum amount of confirmations

#### signMessage

---

Signs arbitrary data

##### Parameters

1. `number` - The transaction amount.
2. `String` - The transaction block number.
3. `String` - The transaction adress amount send from.
4. `String` - Private key used to sign message

##### Returns

`Object`: The signature object

- `message` - `String`: The the given message.
- `messageHash` - `String`: The hash of the given message.
- `r` - `String`: First 32 bytes of the signature
- `s` - `String`: Next 32 bytes of the signature
- `v` - `String`: Recovery value + 27
