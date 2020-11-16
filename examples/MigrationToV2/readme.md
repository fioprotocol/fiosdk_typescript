# Migration to version 2.0.0

The main change in FIOSDK v2 is removing of `genericAction` method and most of the specific methods.
Now for all `create trx` methods lib has `pushTransaction` method. Also there is main method for getting some information - `get`

## Constructor
To create FIOSDK object you must specify:
- privateKey: `string`
- publicKey: `string`
- apiUrls: `string[]`
- fetchjson: `FetchJson`

Also there are several optional params:
- technologyProviderId: `string` = ''
- returnPreparedTrx: `boolean` = false
- registerMockUrl: `string` = ''

So now FIOSDK has `apiUrls` instead of `baseUrl` and expects array of API nodes. Now you can specify a list of API nodes and all api calls FIOSDK makes would be automatically resent if api node have slow response or network error. The order does not matter, every execution would take random.
Also `registerMockUrl` moved to the last position.

## Methods
### Get
To get some data from chain you should use `get` method now. You should provide `endpoint` and `data` params. Endpoint values and data params you could check on API doc page (//we should add the link here I think//). FIOSDK has some values of endpoints - `lib/entities/EndPoint.js`. Also, that method has additional optional `options` param.
```
endpoint: string,
data: any,
options: {
  decrypt?: {
    key: string,
    contentType: string
  }
} = {}
```
Here are some examples how you should update your usage of `genericAction` for such cases. 

\#1 Get Fio Domains

Before:
```javascript
  const result = await fioSdk.genericAction('getFioDomains', { fioPublicKey: publicKey })
```
After:
```javascript
  const result = await fioSdk.get(EndPoint.getDomains, { fio_public_key: fioSdk.publicKey })
```

\#2 Get Pending FIO Requests / Sent FIO Requests / OBT Data

Before:
```javascript
  const result = await fioSdk.genericAction('getPendingFioRequests', {})
  const result = await fioSdk2.genericAction('getSentFioRequests', { limit: 10, offset: 20 })
  const result = await fioSdk2.genericAction('getObtData', {})
```
After:
```javascript
  const result = await fioSdk.get(EndPoint.pendingFioRequests, {
    fio_public_key: fioSdk.publicKey
  }, {
    decrypt: {
      key: 'requests',
      contentType: Constants.CipherContentTypes.new_funds_content
    }
  })
  const result = await fioSdk.get(EndPoint.sentFioRequests, {
    fio_public_key: fioSdk.publicKey,
    limit: 10,
    offset: 20
  }, {
    decrypt: {
      key: 'requests',
      contentType: Constants.CipherContentTypes.new_funds_content
    }
  })
  const result = await fioSdk.get(
    EndPoint.getObtData, {
      fio_public_key: fioSdk.publicKey
    }, {
      decrypt: {
        key: 'obt_data_records',
        contentType: Constants.CipherContentTypes.record_obt_data_content
      }
    }
  )
```
where `key` in `decrypt` is prop name in response for such api call.

Also, there are some generic methods:
- getAbi
- isAvailable
- getFioBalance
- getFioNames
- getPublicAddress
- getFee

### Push trx
To add some data to chain you should use `pushTransaction` method. You must provide action name and data. 
Actions values and data params you could check on API doc page (//we should add the link here I think//). FIOSDK has some values of actions in `actionNames` - `lib/utils/constants.js`.
Also, it has optional `options` param.
```
action: string,
data: any,
options: {
  account?: string,
  additionalReturnKeys?: { [key: string]: string[] },
  returnPreparedTrx?: boolean
} = {}
```

Here some examples how to update you code

\#1 Transfer Tokens

Before:
```javascript
  const result = await fioSdk.genericAction('transferTokens', {
    payeeFioPublicKey: 'FIO88neEop1f5tM6GCepcAdxLpfETqBxsUhPESbUdfZu3joB4M6HB',
    amount: 1450000000,
    maxFee: 800 * FIOSDK.SUFUnit,
  })
```
After:
```javascript
const result = await fioSdk.pushTransaction(Constants.actionNames.trnsfiopubky, {
    payee_public_key: 'FIO88neEop1f5tM6GCepcAdxLpfETqBxsUhPESbUdfZu3joB4M6HB',
    amount: '1450000000',
    max_fee: 800 * FIOSDK.SUFUnit,
  }, {
    additionalReturnKeys: {
      transaction_id: ['transaction_id'],
      block_num: ['processed', 'block_num']
    },
    account: Constants.abiAccounts.fio_token
})
```
where `additionalReturnKeys` - object with props you want see in the result. Values of keys are arrays with path in the full response of the api call.
`account` - is account name from which action would be executed. By default, it is 'fio.address'. You can check proper account names in api docs.

\#2 Send FIO Request

Before:
```javascript
  const result = await fioSdk.genericAction('requestFunds', {
    payerFioAddress: 'testFioAddressName@fiotestnet',
    payeeFioAddress: 'testFioAddressName2@fiotestnet',
    payeePublicAddress: 'FIO88neEop1f5tM6GCepcAdxLpfETqBxsUhPESbUdfZu3joB4M6HB',
    amount: 20 * FIOSDK.SUFUnit,
    chainCode: 'FIO',
    tokenCode: 'FIO',
    maxFee: 800 * FIOSDK.SUFUnit,
  })
```
After:
```javascript
  const payerFioPublicKey = 'FIO7DaqRKziahVEALTZYyp2sAHf1wsCH4eqdAsUGh7y8ZMByG4feD'
  const content = {
    payer_fio_public_key: payerFioPublicKey,
    payee_public_address: fioSdk.publicKey,
    amount: `${20 * FIOSDK.SUFUnit}`,
    chain_code: 'FIO',
    token_code: 'FIO',
    memo: '',
    hash: '',
    offline_url: '',
  }
  const trx = new SignedTransaction()
  const result = await fioSdk.pushTransaction(Constants.actionNames.newfundsreq, {
    payer_fio_address: 'testFioAddressName@fiotestnet',
    payee_fio_address: 'testFioAddressName2@fiotestnet',
    max_fee: 800 * FIOSDK.SUFUnit,
    content: trx.getCipherContent(Constants.CipherContentTypes.new_funds_content, content, fioSdk.privateKey, payerFioPublicKey)
  }, {
    account: Constants.abiAccounts.fio_reqobt
  })
```

## Copyright
fname lname
FIO Foundation, Copyright(c) 2020
