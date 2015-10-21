# blockcast-state-engine

Scan the Bitcoin blockchain for an ordered list of Blockcast data.

```npm install blockcast-state-engine```

```js
var RpcClient = require('bitcoind-rpc')
var rpcCommonBlockchain = require('rpc-common-blockchain')

var config = {
  protocol: 'http',
  user: 'rpcuser',
  pass: 'rpcpassword',
  host: '127.0.0.1',
  port: '18332'
}

var rpc = new RpcClient(config)

var commonBlockchain = rpcCommonBlockchain({
  rpc: rpc
})

var blockcastStateEngine = require('blockcast-state-engine')({
  commonBlockchain: commonBlockchain
})

blockcastStateEngine.scanFrom({
  blockHeight: 572949, // scan the four blocks from 572949 to 572952
  toBlockHeight: 572952,
  onBlock: function (err, blockInfo) {}, // callback on every block, contains full blockHex
  onFound: function (err, blockInfo) {}  // callback on every block found with blockcasts, includes list of blockcasts
}, function (err, blockcasts) {
  console.log(blockcast[0])
  { 
    index: 1, // the index of the transaction in the block
    blockId: '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578',
    tx: {}, // detailed information about the primary transaction
    data: 'fTmp34KdrUApes4Ro4NpSUpR4gItC0', // the data the was embedded
    addresses: [ 'msLoJikUfxbc2U5UhRSjc2svusBSqMdqxZ' ] 
  }
})
```
