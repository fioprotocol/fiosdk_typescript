import { FIOSDK } from '@fioprotocol/fiosdk'
import { bns } from 'biggystring'
import { asArray, asNumber, asObject, asOptional, asString } from 'cleaners'

const fetch = require('node-fetch')

export const asFioHistoryNodeAction = asObject({
  account_action_seq: asNumber,
  block_num: asNumber,
  block_time: asString,
  action_trace: asObject({
    receiver: asString,
    act: asObject({
      account: asString,
      name: asString,
      data: asObject({
        payee_public_key: asOptional(asString),
        amount: asOptional(asNumber),
        max_fee: asOptional(asNumber),
        actor: asOptional(asString),
        tpid: asOptional(asString),
        quantity: asOptional(asString),
        memo: asOptional(asString),
        to: asOptional(asString),
        from: asOptional(asString)
      }),
      hex_data: asString
    }),
    trx_id: asString,
    block_num: asNumber,
    block_time: asString,
    producer_block_id: asString
  })
})

export const asHistoryResponse = asObject({
  actions: asArray(asFioHistoryNodeAction)
})

const HISTORY_NODE_OFFSET = 20
const fioPublicKey = 'FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P'
const fetchCors = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

async function getHighestTxHeight() {
  // db query to get last highestTxHeight
}
async function saveHighestTxHeight(highestTxHeight) {
  // db query to update highestTxHeight
}
async function findTransaction(trxId) {
  // db query to get transaction
}
async function saveTransaction(trx) {
  // db query to add/update transaction
}
function getDenomInfo(currencyCode) {
  // { multiplier: string }
}

async function requestHistory(params: {
  account_name: string,
  pos: number,
  offset: number
}) {
  const result = await fetchCors(
    'https://fio.greymass.com/v1/history/get_actions',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  )
  return result.json()
}

async function checkTransactions() {
  const highestTxHeight = await getHighestTxHeight()
  let newHighestTxHeight = highestTxHeight
  let lastActionSeqNumber = 0

  const fioSDK = new FIOSDK('', '', '', fetchCors, undefined, '')
  // You can use any method you like to get actor value from public key
  const actor = fioSDK.transactions.getActor(fioPublicKey)

  try {
    const lastActionObject = await requestHistory({
      account_name: actor,
      pos: -1,
      offset: -1
    })

    asHistoryResponse(lastActionObject)
    if (lastActionObject.actions.length) {
      lastActionSeqNumber = lastActionObject.actions[0].account_action_seq
    } else {
      // if no transactions at all
      return true
    }
  } catch (e) {
    // handle error
    return false
  }

  let pos = lastActionSeqNumber
  let finish = false

  while (!finish) {
    if (pos < 0) {
      break
    }
    let actionsObject
    try {
      actionsObject = await requestHistory({
        account_name: actor,
        pos,
        offset: -HISTORY_NODE_OFFSET + 1
      })

      let actions = []

      if (actionsObject.actions && actionsObject.actions.length > 0) {
        actions = actionsObject.actions
      } else {
        break
      }

      for (let i = actions.length - 1; i > -1; i--) {
        const action = actions[i]
        asFioHistoryNodeAction(action)
        const blockNum = processTransaction(action, actor)

        if (blockNum > newHighestTxHeight) {
          newHighestTxHeight = blockNum
        } else if (
          (blockNum === newHighestTxHeight && i === HISTORY_NODE_OFFSET - 1) ||
          blockNum < highestTxHeight
        ) {
          finish = true
          break
        }
      }

      if (!actions.length || actions.length < HISTORY_NODE_OFFSET) {
        break
      }
      pos -= HISTORY_NODE_OFFSET
    } catch (e) {
      // handle error
      return false
    }
  }
  if (newHighestTxHeight > highestTxHeight) {
    await saveHighestTxHeight(newHighestTxHeight)
  }
  return true
}

async function processTransaction(
  action,
  actor: string,
  highestTxHeight: number
): number {
  const {
    act: { name: trxName, data }
  } = action.action_trace

  const currencyCode = 'FIO'
  let nativeAmount
  let actorSender
  let fee = '0'
  let otherParams: {
    isTransferProcessed?: boolean,
    isFeeProcessed?: boolean
  } = {}

  if (action.block_num <= highestTxHeight) {
    return action.block_num
  }
  if (trxName !== 'trnsfiopubky' && trxName !== 'transfer') {
    return action.block_num
  }

  // Transfer funds transaction
  if (trxName === 'trnsfiopubky') {
    // Get sent/received amount
    nativeAmount = data.amount.toString()
    // Set actor which sent tokens
    actorSender = data.actor
    // Check if transaction is sent or received
    if (data.payee_public_key === fioPublicKey) {
      // Check if sending to myself
      if (actorSender === actor) {
        nativeAmount = '0'
      }
    } else {
      nativeAmount = `-${nativeAmount}`
    }

    const existingTrx = findTransaction(action.action_trace.trx_id)
    // Check if fee transaction have already processed and update fee for existing transaction
    if (existingTrx) {
      // Copy existed params
      otherParams = { ...existingTrx.otherParams }
      // We should add fee only for sent transactions, not received. If amount is positive or 0 we skip this transactions because it already in the db.
      if (bns.gte(nativeAmount, '0')) {
        return action.block_num
      }
      // Check if `trnsfiopubky` transaction is processed
      if (otherParams.isTransferProcessed) {
        return action.block_num
      }
      // Check if fee (transfer) transaction is processed.
      if (otherParams.isFeeProcessed) {
        // Update amount and set fee to transaction. It would depend how you save transactions, in current example we save amount in transaction with fee calculated.
        nativeAmount = bns.sub(nativeAmount, existingTrx.fee)
        fee = existingTrx.fee
      } else {
        // Edge case
        console.log(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set'
        )
      }
    }
    // Set flag informing that `trnsfiopubky` transaction is processed
    otherParams.isTransferProcessed = true

    const resTransaction = {
      txid: action.action_trace.trx_id,
      date: Date.parse(action.block_time) / 1000,
      currencyCode,
      blockHeight: action.block_num > 0 ? action.block_num : 0,
      nativeAmount,
      fee,
      otherParams
    }
    await saveTransaction(resTransaction)
  }

  if (trxName === 'transfer') {
    // For this tansaction type we have `quantity` in data object and value is such string - `2.000000000 FIO`
    const [amount] = data.quantity.split(' ')
    const exchangeAmount = amount.toString()
    // Get multiplier for FIO to calculate native amount
    const denom = getDenomInfo(this.currencyInfo, currencyCode)
    if (!denom) {
      this.log(`Received unsupported currencyCode: ${currencyCode}`)
      return 0
    }
    // Calculate native amount
    const fioAmount = bns.mul(exchangeAmount, denom.multiplier)

    // Check if fee paid or received
    if (data.to === actor) {
      nativeAmount = `${fioAmount}`
    } else {
      // In this example we set native amount as (amount + fee)
      nativeAmount = `-${fioAmount}`
      fee = fioAmount
    }

    const existingTrx = findTransaction(action.action_trace.trx_id)
    // Check if `transfer` (fee) transaction have already added and update fee for existing transaction
    if (existingTrx) {
      // Copy existed params
      otherParams = { ...existingTrx.otherParams }
      // We should add fee only for sent transactions, not received. If amount is positive or 0 we skip this transactions because it already in the db.
      if (bns.gte(existingTrx.nativeAmount, '0')) {
        return action.block_num
      }
      // Check if `transfer` have already processed
      if (otherParams.isFeeProcessed) {
        return action.block_num
      }
      // Check if `trnsfiopubky` have already processed
      if (otherParams.isTransferProcessed) {
        // Update native amount
        nativeAmount = bns.sub(existingTrx.nativeAmount, fee)
      } else {
        console.log(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set'
        )
      }
    }

    // Set flag informing that `transfer` transaction is processed
    otherParams.isFeeProcessed = true

    const resTransaction = {
      txid: action.action_trace.trx_id,
      date: Date.parse(action.block_time) / 1000,
      currencyCode,
      blockHeight: action.block_num > 0 ? action.block_num : 0,
      nativeAmount,
      fee,
      otherParams
    }
    await saveTransaction(resTransaction)
  }

  return action.block_num
}

checkTransactions()
