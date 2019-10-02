const FIOSDK = require('../lib/FIOSDK');
const Transactions = require('../lib/transactions/Transactions');
const MockFioProvider = require('./MockFioProvider');
const serverMocks = require('./serverMockResponses');
fetch = require('jest-fetch-mock')
const encoding = require ('text-encoding');
global.TextDecoder = encoding.TextDecoder
global.TextEncoder = encoding.TextEncoder

 async function fetchJson(url,options){
    res = await fetch(url,options)
    reply =  await res.json()
    //console.log(reply)
    return reply    
}

fiosdk = ''
 beforeEach(async () => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.abi1))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.abi2))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.abi3))

    fiosdk = new FIOSDK.FIOSDK("5JCf4cYbp7G8ZH3tETvig7KNoXkygiPWYerY1U23CT1wZrGXg7v",
    "FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP",
    "http://dev4.fio.dev:8889/v1/",fetchJson,fetchJson);  
    Transactions.Transactions.FioProvider = new MockFioProvider.MockFioProvider()
});


test('signing, should be an array', () => {
    var arr = Array();
    arr['hex'] = "hexhexhex";
    arr['signature'] = "signature";
    Transactions.Transactions.FioProvider.prepareTransaction(1, 2, 3, 4, 5, 6, 7).then(res => expect(res).toEqual(arr))
})

test('Availabilitycheck, available', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.nameAvailable));

    function callback(data) {
        expect(data).toBe(false)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/avail_check')
        done();
    }
    var name = "" + Date.now()
    name = name.substr(-12);
    name = name + ".brd"
    fiosdk.isAvailable(name).then(res => {
        callback(res.is_registered);
    }).catch(error => {
        console.error(error)
    })
})

test('GetFioBalance', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.FioBalance));

    function callback(data) {
        expect(data.balance).toBe("1000.0000")
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/get_fio_balance')
        done();
    }
    fiosdk.getFioBalance("name.brd").then(res => {
        callback(res);
    }).catch(error => {
        console.error(error)
    })
})

test('GetNames', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.FioNames));

    function callback(data) {
        expect(data.fio_domains[0].expiration).toBe("15734567")
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/get_fio_names')
        done();
    }
    fiosdk.getFioNames("name.brd").then(res => {
        callback(res);
    }).catch(error => {
        console.error(error)
    })
})

test('PendingFioRequest', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.pendingRequest));

    function callback(data) {
        expect(data.fio_request_id).toBe(22)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/get_pending_fio_requests')
        expect(data.content).toEqual({ payee_public_address: 'FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA',
        amount: '8',
        token_code: 'FIO',
        memo: 'memo please coins',
        hash: null,
        offline_url: null })
        done();
    }
    fiosdk.getPendingFioRequests("name.brd").then(res => {
        callback(res[0]);
    }).catch(error => {
        console.error(error)
    })
})

test('PublicAddresssLookUp', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.publicAddressLookUp));

    function callback(data) {
        expect(data).toBe("77081021.brdLTCADDRESS")
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/pub_address_lookup')
        done();
    }
    fiosdk.getPublicAddress("77081021.brd", "LTC").then(res => {
        callback(res.public_address);
    }).catch(error => {
        console.error(error)
    })
})

test('SentFioRequest', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.sentRequests));

    function callback(data) {
        expect(data.fio_request_id).toBe(13)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/get_sent_fio_requests')
        expect(data.content).toEqual(serverMocks.sentRequestsDecoded)
        done();
    }
    fiosdk.getSentFioRequests("77632281.brd").then(res => {
        callback(res[0]);
    }).catch(error => {
        console.error(error)
    })
})

test('AddPublicAddress', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.addPublicAddress));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/add_pub_address')
        done();
    }
    fiosdk.addPublicAddress("78177992.brd", "ETH", "78177992.brd").then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RecordSend', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.recordSend));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/record_send')
        done();
    }
    fioRequestId= string = '1'
    payerFIOAddress = "test1:edge"
    payeeFIOAddress = "test2:edge"
    payerPublicAddress = "FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP"
    payeePublicAddress = "FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA"
    amount = 1
    tokenCode = "ETH"
    status = "sent_to_blockchain"
    obtID = "1"
    memo = "memo"
    maxFee= "1"
    walletFioAddress="aaAAAaa"
    fiosdk.recordSend(fioRequestId,payerFIOAddress,payeeFIOAddress,payerPublicAddress,payeePublicAddress,amount,tokenCode,status,
        obtID, maxFee,walletFioAddress,'FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA',memo).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RegisterName', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.registerName));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/register_fio_address')
        done();
    }
    var name = "" + Date.now()
    name = name.substr(-12);
    name = name + ":brd"
    fiosdk.registerFioAddress(name,30000000000).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RegisterDomain', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.registerName));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/register_fio_domain')
        done();
    }
    var name = "" + Date.now()
    name = name.substr(-12);
    name = name + ":brd"
    fiosdk.registerFioDomain(name,30000000000).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RenewFioDomainName', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.renewFioDomainName));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/renew_fio_domain')
        done();
    }
    var name = "test-" + Date.now()
    name = name.substr(-7);
    name = name + ":brd"
    fiosdk.renewFioDomain(name,40000000000).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RejectFundsRequest', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponse(JSON.stringify(serverMocks.rejectFundRequest));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("437e1fb2e717d25289c61258794abc475200a70a2133a036255ee43f570ffa7c"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/reject_funds_request')
        done();
    }

    fiosdk.rejectFundsRequest(93).then(res => {
        callback(res.processed.id);
    }).catch(error => {
        console.error(error)
    })
})

test('RequestNewFunds', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.requestNewFunds));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/new_funds_request')
        done();
    }

    fiosdk.requestFunds("test1:edge", "test2:edge", "FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP",
        100.00,"FIO", "memo",3000,'FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA').then(res => {
        callback(res.processed.id);
    }).catch(error => {
        console.error(error)
    })
});

 test('TransferToken', async done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.transferToken));
    //Transactions.fetchJson = fetchJson

    function callback(data) {
        expect(data).toBe("{\"status\": \"OK\",\"fee_collected\": 0}")
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/transfer_tokens_pub_key')
        done();
    }
    fiosdk.transferTokens("EOS8PRe4WRZJj5mkem6qVGKyvNFgPsNnjNN6kPhh6EaCpzCVin5Jj", "1.0",1).then(res => {
        callback(res.processed.action_traces[0].receipt.response);
    }).catch(error => {
        console.error(error)
    })
})

test('createKeys', async function () {
    const entropy = Buffer.from('abcdefghijklmnopqrstuv0123456789');
    const privatekeys = await FIOSDK.FIOSDK.createPrivateKey(entropy)
    const publickeys = FIOSDK.FIOSDK.derivedPublicKey(privatekeys.fioKey)
    expect(privatekeys).toEqual( {"fioKey":"5KK4HrU3fVnes3RMhJ88NZbKENV62pcYu9KXn4HUfmrfg5McjSh",
    "mnemonic":"gesture basic suit skull grid reflect pizza estate hockey hidden orange thought blame defy spike put coral maze mimic half fat breeze thought chuckle"})
    expect(publickeys).toEqual( {"publicKey":"FIO5B3dgJnz5H73kFyxaKpgbL4mGeNjBFBEQ3AxBBC8ncL8Xcde3A"})
})


test('Derived public key', async function () {
    const privatekeys = {fioKey:"5KK4HrU3fVnes3RMhJ88NZbKENV62pcYu9KXn4HUfmrfg5McjSh"}
    const publickeys = FIOSDK.FIOSDK.derivedPublicKey(privatekeys.fioKey)
    expect(publickeys).toEqual( {"publicKey":"FIO5B3dgJnz5H73kFyxaKpgbL4mGeNjBFBEQ3AxBBC8ncL8Xcde3A"})
})

test('GenericAction', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.FioNames));

    function callback(data) {
        expect(data.fio_domains[0].expiration).toBe("15734567")
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://dev4.fio.dev:8889/v1/chain/get_fio_names')
        done();
    }
    params = {
        fioPublicKey: 'name.brd'
    }

    fiosdk.genericAction('getFioNames',params).then(res => {
        callback(res);
    }).catch(error => {
        console.error(error)
    })
})