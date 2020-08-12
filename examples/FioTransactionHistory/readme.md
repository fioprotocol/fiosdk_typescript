# FIO History Node v1 process transactions

Here you can find the algorithm explanation for the transactions processing from the FIO History Node v1. As a result you would have a list of transactions that could be displayed on your client side.

In this guide we use js snippets in examples.

## Get last transaction

The idea to process transactions from newest to oldest, so firstly we need to know the last sequence id to be able to paginate from the newest transaction.

We can do it using such params for the `https://fio.greymass.com/v1/history/get_actions` endpoint:
```
{
  account_name: 'yout_account_name',
  pos: -1,
  offset: -1
}
```
where `pos` is the sequence number from which you would start and `offset` is additional amount of transactions you want receive.

Here are the validations for the response and action object
```
import { asArray, asNumber, asObject, asOptional, asString } from 'cleaners'

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
```

We need to check response and save `lastSeqNumber`:
```
  asHistoryResponse(res)
  if (res.actions.length) {
     lastActionSeqNumber = res.actions[0].account_action_seq
  }
```
If we do not have any actions in response, we can exit the algorithm

## Loop through the results
We need to save globally the `highestTxHeight` - the highest block height of processed transaction. We use it to not process transactions which have been already processed.

Also, we might have all processed transactions saved somewhere in a database.

You might go through the transactions in `while` loop decreasing `pos` value and have negative `offset`.
For example:
```
const offset = 20
let pos = lastActionSeqNumber
let finish = false

while (!finish) {
  if (pos < 0) {
    break
  }

  try {
    const res = await this.requestHistory(
      {
        account_name: 'your_account_name',
        pos,
        offset: -offset + 1
      }
    )

    // process transactions
    //

    if (!actions.length || actions.length < offset) {
      break // or finish = true
    }
    pos -= offset
  } catch (e) {
    //
  }
}
```

In request params we set offset to `-offset + 1` because history node would respond with an additional amount of items along with first one. So if you set offset param to `20`
you would receive 21 items.

In the response you can find action objects and process each. We need to go from last item in actions because history node respond with items sorted from oldest to newest.
```
const newHighestTxHeight = highestTxHeight
const { actions } = res

for (let i = actions.length - 1; i > -1; i--) {
  const action = actions[i]

  // validation
  asFioHistoryNodeAction(action)

  // process transaction
  //

  const blockNum = action.block_num
  if (blockNum > newHighestTxHeight) {
    newHighestTxHeight = blockNum
  } else if (
    (blockNum === newHighestTxHeight && i === offset - 1) || blockNum < highestTxHeight
  ) {
    finish = true
    break
  }
}
```

## Process transaction

Firstly, we can check if `block_num` is higher than `highestTxHeight`.
Then we can check type(name) of the transactions. The types we are interested in are `trnsfiopubky` and `transfer`.

```
processTransaction(action: FioHistoryNodeAction, actor: string): number {
  const {
    act: { name: trxName, data }
  } = action.action_trace

  if (action.block_num <= highestTxHeight) {
    return action.block_num
  }
  if (trxName !== 'trnsfiopubky' && trxName !== 'transfer') {
    return action.block_num
  }

  // ...
}
```

The `trnsfiopubky` transactions show tokens movement after user sent tokens using `transfer_tokens_pub_key` endpoint. For single sent you can see several transactions with same `trx_id`. Also, such sent creates one `transfer` transaction for the fee which also has that `trx_id`. So in most cases for such sent you would see one `transfer` and three `trnsfiopubky` transactions.
To create one in the end we need to skip `trnsfiopubky` that already processed and update with fee amount from `transfer` transaction.

Here what we need to do when processing `trnsfiopubky` transaction:
```
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

// Transfer funds transaction
if (trxName === 'trnsfiopubky') {
  // Get sent/received amount
  nativeAmount = data.amount.toString()
  // Set actor which sent tokens
  actorSender = data.actor
  // Check if transaction is sent or received
  if (data.payee_public_key === ownerPublicKey) {
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
  saveTransaction(resTransaction)
}
```
where
* `bns` - floating-point big number library using only strings as inputs and outputs (npm `biggystring`)
* `actor` - actor value for current public key
* `ownerPublicKey` - public key processing transactions
* `findTransaction` - method that search for existing processed transaction from db by `trx_id`
* `saveTransaction` - method that add/update transaction to the db

Here is an example for `transfer` transaction
```
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
  saveTransaction(resTransaction)
}
```
where
* `bns` - floating-point big number library using only strings as inputs and outputs (npm `biggystring`)
* `actor` - actor value for current public key
* `getDenomInfo` - method that should return denomination info for provided currency code (`FIO`)
* `findTransaction` - method that search for existing processed transaction from db by `trx_id`
* `saveTransaction` - method that add/update transaction to the db

### Before finish

If we processed new transactions we need to update highestTxHeight:
```
if (newHighestTxHeight > highestTxHeight) {
  highestTxHeight = newHighestTxHeight
  // then you should save highestTxHeight globally
}
```


## Using several api urls
If you want to use pool of history node api urls, and switch/change api url if one of them is not responding, you should start the algorithm from the beginning, because each history node could have their own sequence numbers.
