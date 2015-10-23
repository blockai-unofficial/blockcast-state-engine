var async = require('async')
var blockcast = require('blockcast')

module.exports = function (options) {
  var commonBlockchain = options.commonBlockchain

  var getBlock = function (options, callback) {
    var blockId = options.blockId
    var blockcasts = []
    commonBlockchain.Blocks.Get([blockId], function (err, blocks) {
      if (err) { } // TOD
      var block = blocks[0]
      var transactions = block.transactions
      async.each(transactions, function (tx, next) {
        var scanBlockcast = function () {
          blockcast.scanSingle({
            tx: tx,
            commonBlockchain: commonBlockchain
          }, function (err, data, addresses) {
            if (!err && data && addresses) {
              blockcasts.push({
                index: transactions.indexOf(tx),
                blockId: blockId,
                tx: tx,
                data: data,
                addresses: addresses
              })
            }
            try {
              next()
            } catch (e) {}
          })
        }
        if (options.onTransaction) {
          options.onTransaction(tx, function () {
            scanBlockcast()
          })
        } else {
          scanBlockcast()
        }
      }, function (err) {
        if (!err) {
          callback(false, {
            block: block,
            blockId: blockId,
            blockcasts: blockcasts
          })
        }
      })
    })
  }

  var scanFrom = function (options, callback) {
    var currentHeight = options.blockHeight
    var blockcasts = []
    var onBlockId = function (blockId) {
      getBlock({blockId: blockId, onTransaction: options.onTransaction}, function (err, blockInfo) {
        blockInfo.block.blockHeight = currentHeight
        blockInfo.blockHeight = currentHeight
        if (options.onBlock) {
          options.onBlock(err, blockInfo)
        }
        if (blockInfo.blockcasts.length > 0) {
          if (options.onFound) {
            options.onFound(err, blockInfo)
          }
        }
        blockcasts = blockcasts.concat(blockInfo.blockcasts)
        var nextblockhash = blockInfo.block.nextblockhash
        if (options.toBlockHeight) {
          if (currentHeight + 1 > options.toBlockHeight) {
            return callback(false, blockcasts)
          }
        }
        if (nextblockhash) {
          ++currentHeight
          onBlockId(nextblockhash)
        } else {
          if (callback) {
            return callback(false, blockcasts)
          }
        }
      })
    }
    if (!currentHeight && options.blockId) {
      onBlockId(options.blockId)
    } else {
      commonBlockchain.Blocks.GetBlockHash(currentHeight, function (err, blockId) {
        if (err) { } // TODO
        onBlockId(blockId)
      })
    }
  }

  return {
    scanFrom: scanFrom,
    getBlock: getBlock
  }
}
