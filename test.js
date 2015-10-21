var test = require('tape')
var rpcCommonBlockchain = require('rpc-common-blockchain')

var RpcClient = require('bitcoind-rpc')
var env = require('node-env-file')
env('./.env', { raise: false })

var rpcuser = process.env.rpcuser
var rpcpassword = process.env.rpcpassword

var config = {
  protocol: 'http',
  user: rpcuser,
  pass: rpcpassword,
  host: '127.0.0.1',
  port: '18332'
}

var rpc = new RpcClient(config)

var commonBlockchain = rpcCommonBlockchain({
  rpc: rpc
})

var blockcastStateEngine = require('./')({
  commonBlockchain: commonBlockchain
})

test('scanFrom', function (t) {
  t.plan(15)
  blockcastStateEngine.scanFrom({
    blockHeight: 572949, // scan the four blocks from 572949 to 572952
    toBlockHeight: 572952,
    onBlock: function (err, blockInfo) {
      if (err) { } // TODO
      t.ok(blockInfo.blockId, 'onBlock: ' + blockInfo.blockId) // so should be four of these onBlock calls in total
    },
    onFound: function (err, blockInfo) {
      if (err) { } // TODO
      t.equal(blockInfo.blockId, '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', 'onFound: has blockId')
      t.equal(blockInfo.blockcasts.length, 4, 'onFound: has 4 blockcasts')
    }
  }, function (err, blockcasts) {
    if (err) { } // TODO
    console.log(blockcasts[0])
    t.equal(blockcasts.length, 4, 'has 4 blockcasts')
    t.equal(blockcasts[0].data, 'fTmp34KdrUApes4Ro4NpSUpR4gItC0', 'has matching short data')
    t.equal(blockcasts[0].blockId, '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', 'is right block')
    t.equal(blockcasts[0].index, 1, 'is right transaction index in block')
    t.equal(JSON.parse(blockcasts[1].data).sha1, 'dd09da17ec523e92e38b5f141d9625a5e77bb9fa', 'has matching openpublish transfer with sha1')
    t.equal(blockcasts[2].data, 'OTZuBEL5LZqH4iHwCUBLlQypgTM4d5zaXTax8A4O0xtcqffoKTWNvxCyTg8FF0lJXsik1Fa9sTIrNk2FkC7bzfcql7RQeyGMOtH6eQ4C3mmU0WvRBVbnBDRqTgXwrdeFMnqIqPTG0NrOhhR96eWXfoxKozQ84b073xTEOQHBW7', 'has matching long data')
    t.equal(blockcasts[2].blockId, '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', 'is right block')
    t.equal(blockcasts[2].index, 169, 'is right transaction index in block')
    t.equal(JSON.parse(blockcasts[3].data).ipfs, 'QmcJf1w9bVpquGdzCp86pX4K21Zcn7bJBUtrBP1cr2NFuR', 'has matching openpublish register with ipfs')
  })
})

test('getBlock', function (t) {
  blockcastStateEngine.getBlock('0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', function (err, blockInfo) {
    if (err) { } // TODO
    var blockcasts = blockInfo.blockcasts
    t.equal(blockcasts.length, 4, 'has 4 blockcasts')
    t.equal(blockcasts[0].data, 'fTmp34KdrUApes4Ro4NpSUpR4gItC0', 'has matching short data')
    t.equal(blockcasts[0].blockId, '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', 'is right block')
    t.equal(blockcasts[0].index, 1, 'is right transaction index in block')
    t.equal(JSON.parse(blockcasts[1].data).sha1, 'dd09da17ec523e92e38b5f141d9625a5e77bb9fa', 'has matching openpublish transfer with sha1')
    t.equal(blockcasts[2].data, 'OTZuBEL5LZqH4iHwCUBLlQypgTM4d5zaXTax8A4O0xtcqffoKTWNvxCyTg8FF0lJXsik1Fa9sTIrNk2FkC7bzfcql7RQeyGMOtH6eQ4C3mmU0WvRBVbnBDRqTgXwrdeFMnqIqPTG0NrOhhR96eWXfoxKozQ84b073xTEOQHBW7', 'has matching long data')
    t.equal(blockcasts[2].blockId, '0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578', 'is right block')
    t.equal(blockcasts[2].index, 169, 'is right transaction index in block')
    t.equal(JSON.parse(blockcasts[3].data).ipfs, 'QmcJf1w9bVpquGdzCp86pX4K21Zcn7bJBUtrBP1cr2NFuR', 'has matching openpublish register with ipfs')
    t.end()
  })
})
