var test = require('tape');
var rpcCommonBlockchain = require('../rpc-common-blockchain');

var RpcClient = require('bitcoind-rpc');
var bitcoin = require('bitcoinjs-lib');
var env = require('node-env-file');
env('./.env', { raise: false });

var rpcuser = process.env.rpcuser;
var rpcpassword = process.env.rpcpassword;
 
var config = {
  protocol: 'http',
  user: rpcuser,
  pass: rpcpassword,
  host: '127.0.0.1',
  port: '18332',
};

var rpc = new RpcClient(config);

var commonBlockchain = rpcCommonBlockchain({
  rpc: rpc
});

var blockcastStateEngine = require("./")({
  commonBlockchain: commonBlockchain
});

test("scanFrom", function(t) {
  blockcastStateEngine.scanFrom({
    blockHeight: 572949,
    toBlockHeight: 572953,
  }, function(err, blockcasts) {
    t.equal(blockcasts.length, 4, "has 4 blockcasts");
    t.equal(blockcasts[0].data, 'fTmp34KdrUApes4Ro4NpSUpR4gItC0', "has matching short data");
    t.equal(JSON.parse(blockcasts[1].data).sha1, "dd09da17ec523e92e38b5f141d9625a5e77bb9fa", "has matching openpublish transfer with sha1");
    t.equal(blockcasts[2].data, 'OTZuBEL5LZqH4iHwCUBLlQypgTM4d5zaXTax8A4O0xtcqffoKTWNvxCyTg8FF0lJXsik1Fa9sTIrNk2FkC7bzfcql7RQeyGMOtH6eQ4C3mmU0WvRBVbnBDRqTgXwrdeFMnqIqPTG0NrOhhR96eWXfoxKozQ84b073xTEOQHBW7', "has matching long data");
    t.equal(JSON.parse(blockcasts[3].data).ipfs, "QmcJf1w9bVpquGdzCp86pX4K21Zcn7bJBUtrBP1cr2NFuR", "has matching openpublish register with ipfs");
    t.end();
  });
});

test("getBlock", function(t) {
  blockcastStateEngine.getBlock("0000000000003585e8d4a23ec784dc845f28cc8bc0950fc68a6bc5863a10f578", function(err, blockInfo) {
    var blockcasts = blockInfo.blockcasts;
    t.equal(blockcasts.length, 4, "has 4 blockcasts");
    t.equal(blockcasts[0].data, 'fTmp34KdrUApes4Ro4NpSUpR4gItC0', "has matching short data");
    t.equal(JSON.parse(blockcasts[1].data).sha1, "dd09da17ec523e92e38b5f141d9625a5e77bb9fa", "has matching openpublish transfer with sha1");
    t.equal(blockcasts[2].data, 'OTZuBEL5LZqH4iHwCUBLlQypgTM4d5zaXTax8A4O0xtcqffoKTWNvxCyTg8FF0lJXsik1Fa9sTIrNk2FkC7bzfcql7RQeyGMOtH6eQ4C3mmU0WvRBVbnBDRqTgXwrdeFMnqIqPTG0NrOhhR96eWXfoxKozQ84b073xTEOQHBW7', "has matching long data");
    t.equal(JSON.parse(blockcasts[3].data).ipfs, "QmcJf1w9bVpquGdzCp86pX4K21Zcn7bJBUtrBP1cr2NFuR", "has matching openpublish register with ipfs");
    t.end();
  });
});