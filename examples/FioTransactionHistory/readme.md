# Processesing transactions from FIO History v1 Node

The following presents an example of how to process transactions from a FIO History v1 Node. As a result you would have a list of transactions that could be displayed on your client side.

A list of API nodes running FIO History v1 can be found at `https://github.com/fioprotocol/fio.mainnet`

## Get last transaction

You want to process transactions from newest to oldest transaction. So, first you need to find the most recent action sequence id so you can paginate from the newest transaction.

The following returns transactions for a FIO account:
```
https://fio.greymass.com/v1/history/get_actions
{
  account_name: 'your_account_name',
  pos: -1,
  offset: -1
}
```
where `pos` is the starting action sequence number and `offset` is the number of transactions you want receive.

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

Check response and save `lastSeqNumber`:
```
  asHistoryResponse(res)
  if (res.actions.length) {
     lastActionSeqNumber = res.actions[0].account_action_seq
  }
```
If there are no actions in the response, exit the algorithm.

## Loop through the results
It is recommended to save previously processed transactions in a local file or database. To keep track of previously processed transactions, save the `highestTxHeight` - the highest block height of the most recently processed transaction. This is used to avoid processing transactions which have previously been processed.

Iterate through the transactions in `while` loop, decreasing `pos` value and using a negative `offset`.
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

In the request params, set the offset to `-offset + 1` because history node returns an additional amount of items along with first one. So if you set the offset param to `20` you will receive 21 items.

The next step is to process each action object. Process the actions starting with the last item since FIO v1 History returns actions sorted from oldest to newest.
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

## Process transactions

To process transactions, first check if `block_num` is higher than `highestTxHeight`. Next, check the type(name) of the transactions. The types we are interested in are `trnsfiopubky` and `transfer`.

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

The `trnsfiopubky` transactions show tokens transferred using the `transfer_tokens_pub_key` endpoint. For a single transfer, you will see several transactions with same `trx_id`. In addition, there will also be one `transfer` transaction for the fee which has the same `trx_id`. So, in most cases for each FIO transfer you will see one `transfer` and three `trnsfiopubky` transactions.

To capture the FIO transfer transaction, you will need to process data from `trnsfiopubky` and update the transaction data with the fee amount from the `transfer` transaction.

An example of processing a `trnsfiopubky` transaction:
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

Here is an example for `transfer` transaction:
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

### Saving highestTxHeight

If you processed new transactions you need to update highestTxHeight:
```
if (newHighestTxHeight > highestTxHeight) {
  highestTxHeight = newHighestTxHeight
  // then you should save highestTxHeight globally
}
```


## Using different History nodes
If you want to use a pool of history node api urls and switch the api url if one of the nodes is not responding, you should start the algorithm from the beginning, because each history node could have their own sequence numbers.
