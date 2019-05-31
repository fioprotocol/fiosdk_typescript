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

    fiosdk = new FIOSDK.FIOSDK("5KBX1dwHME4VyuUss2sYM25D5ZTDvyYrbEz37UJqwAVAsR4tGuY",
    "EOS7isxEua78KPVbGzKemH4nj2bWE52gqj8Hkac3tc7jKNvpfWzYS",
    "http://34.220.57.45:8889/v1/",fetchJson,fetchJson);  
    Transactions.Transactions.FioProvider = new MockFioProvider.MockFioProvider()
});



test('getActor, should return a string "actor"', () => {
    fiosdk.getFioPublicAddress().then(res => expect(res).toBe("actor"));
});

test('signing, should be an array', () => {
    var arr = Array();
    arr['hex'] = "hexhexhex";
    arr['signature'] = "signature";
    Transactions.Transactions.ReactNativeFio.getSignedTransaction(1, 2, 3, 4, 5, 6, 7).then(res => expect(res).toEqual(arr))
})

test('Availabilitycheck, available', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.nameAvailable));

    function callback(data) {
        expect(data).toBe(false)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/avail_check')
        done();
    }
    var name = "" + Date.now()
    name = name.substr(-12);
    name = name + ".brd"
    fiosdk.availabilityCheck(name).then(res => {
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
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/get_fio_balance')
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
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/get_fio_names')
        done();
    }
    fiosdk.getNames("name.brd").then(res => {
        console.log("GetNames response: %j", res)
        callback(res);
    }).catch(error => {
        console.error(error)
    })
})

test('PendingFioRequest', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.pendingRequest));

    function callback(data) {
        expect(data).toBe(86)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/get_pending_fio_requests')
        done();
    }
    fiosdk.getpendingFioRequests("name.brd").then(res => {
        callback(res.requests[0].fio_request_id);
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
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/pub_address_lookup')
        done();
    }
    fiosdk.publicAddressLookUp("77081021.brd", "LTC").then(res => {
        callback(res.public_address);
    }).catch(error => {
        console.error(error)
    })
})

test('SentFioRequest', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.sentRequests));

    function callback(data) {
        expect(data).toBe(89)
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('http://34.220.57.45:8889/v1/chain/get_sent_fio_requests')
        done();
    }
    fiosdk.getSentFioRequests("77632281.brd").then(res => {
        callback(res.requests[0].fio_request_id);
    }).catch(error => {
        console.error(error)
    })
})

test('AddPublicAddress', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.addPublicAddress));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b"))
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/add_pub_address')
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
    fetch.mockResponse(JSON.stringify(serverMocks.recordSend));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b"))
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/record_send')
        done();
    }
    var rocordSend = {
        payer_fio_address: "aaa",
        payee_fio_address: "vvv",
        payer_public_address: "xxx",
        payee_public_address: "eee",
        amount: "1",
        token_code: "ETH",
        chaincode: "1",
        status: "SENT",
        obt_id: "1",
        metadata: "metadata",
        fio_request_id: "1",
        actor: "asddasd"
    }
    fiosdk.recordSend(rocordSend).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RegisterName', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.registerName));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a"))
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/register_fio_name')
        done();
    }
    var name = "" + Date.now()
    name = name.substr(-12);
    name = name + ".brd"
    fiosdk.registerName(name).then(res => {
        callback(res.transaction_id);
    }).catch(error => {
        console.error(error)
    })
})

test('RejectFundsRequest', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.rejectFundRequest));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("437e1fb2e717d25289c61258794abc475200a70a2133a036255ee43f570ffa7c"))
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/reject_funds_request')
        done();
    }

    fiosdk.rejectFundsRequest(93).then(res => {
        callback(res.processed.id);
    }).catch(error => {
        console.error(error)
    })
})

test.only('RequestNewFunds', done => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(serverMocks.chain))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.block))
    fetch.mockResponseOnce(JSON.stringify(serverMocks.requestNewFunds));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b"))
        expect(fetch.mock.calls.length).toEqual(3)
        expect(fetch.mock.calls[2][0]).toEqual('http://34.220.57.45:8889/v1/chain/new_funds_request')
        done();
    }

    fiosdk.requestFunds("77632281.brd", "77081021.brd", "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        "ETH", 100.00, "{\"memo\": \"Invoice1234\"}").then(res => {
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
        expect(fetch.mock.calls[2][0]).toEqual('http://34.220.57.45:8889/v1/chain/transfer_tokens_pub_key')
        done();
    }
    fiosdk.transferTokens("EOS8PRe4WRZJj5mkem6qVGKyvNFgPsNnjNN6kPhh6EaCpzCVin5Jj", "1.0",1).then(res => {
        callback(res.processed.action_traces[0].receipt.response);
    }).catch(error => {
        console.error(error)
    })
})

test('createKeys', async function () {
    const privatekeys = await FIOSDK.FIOSDK.createPrivateKeyPair()
    const publickeys = FIOSDK.FIOSDK.derivedPublicKey(privatekeys.fioOwnerKey, privatekeys.fioKey)
    console.log("%j",privatekeys)
    console.log("%j",publickeys)
})


test('Derived public key', async function () {
    const privatekeys = {fioOwnerKey: "5JmN1Nbr2nwhZm9C2Kj6WYRJTFmfYt51zumhrLBY2UdsCvUWYwU",fioKey:"5JmN1Nbr2nwhZm9C2Kj6WYRJTFmfYt51zumhrLBY2UdsCvUWYwU"}
    const publickeys = FIOSDK.FIOSDK.derivedPublicKey(privatekeys.fioOwnerKey, privatekeys.fioKey)
    console.log("%j",publickeys)
})
const rawAbi = {"account_name":"testeostoken","code_hash":"0000000000000000000000000000000000000000000000000000000000000000","abi_hash":"0000000000000000000000000000000000000000000000000000000000000000","abi":"DmVvc2lvOjphYmkvMS4wAQxhY2NvdW50X25hbWUEbmFtZQUIdHJhbnNmZXIABARmcm9tDGFjY291bnRfbmFtZQJ0bwxhY2NvdW50X25hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcGY3JlYXRlAAIGaXNzdWVyDGFjY291bnRfbmFtZQ5tYXhpbXVtX3N1cHBseQVhc3NldAVpc3N1ZQADAnRvDGFjY291bnRfbmFtZQhxdWFudGl0eQVhc3NldARtZW1vBnN0cmluZwdhY2NvdW50AAEHYmFsYW5jZQVhc3NldA5jdXJyZW5jeV9zdGF0cwADBnN1cHBseQVhc3NldAptYXhfc3VwcGx5BWFzc2V0Bmlzc3VlcgxhY2NvdW50X25hbWUDAAAAVy08zc0IdHJhbnNmZXLnBSMjIFRyYW5zZmVyIFRlcm1zICYgQ29uZGl0aW9ucwoKSSwge3tmcm9tfX0sIGNlcnRpZnkgdGhlIGZvbGxvd2luZyB0byBiZSB0cnVlIHRvIHRoZSBiZXN0IG9mIG15IGtub3dsZWRnZToKCjEuIEkgY2VydGlmeSB0aGF0IHt7cXVhbnRpdHl9fSBpcyBub3QgdGhlIHByb2NlZWRzIG9mIGZyYXVkdWxlbnQgb3IgdmlvbGVudCBhY3Rpdml0aWVzLgoyLiBJIGNlcnRpZnkgdGhhdCwgdG8gdGhlIGJlc3Qgb2YgbXkga25vd2xlZGdlLCB7e3RvfX0gaXMgbm90IHN1cHBvcnRpbmcgaW5pdGlhdGlvbiBvZiB2aW9sZW5jZSBhZ2FpbnN0IG90aGVycy4KMy4gSSBoYXZlIGRpc2Nsb3NlZCBhbnkgY29udHJhY3R1YWwgdGVybXMgJiBjb25kaXRpb25zIHdpdGggcmVzcGVjdCB0byB7e3F1YW50aXR5fX0gdG8ge3t0b319LgoKSSB1bmRlcnN0YW5kIHRoYXQgZnVuZHMgdHJhbnNmZXJzIGFyZSBub3QgcmV2ZXJzaWJsZSBhZnRlciB0aGUge3t0cmFuc2FjdGlvbi5kZWxheX19IHNlY29uZHMgb3Igb3RoZXIgZGVsYXkgYXMgY29uZmlndXJlZCBieSB7e2Zyb219fSdzIHBlcm1pc3Npb25zLgoKSWYgdGhpcyBhY3Rpb24gZmFpbHMgdG8gYmUgaXJyZXZlcnNpYmx5IGNvbmZpcm1lZCBhZnRlciByZWNlaXZpbmcgZ29vZHMgb3Igc2VydmljZXMgZnJvbSAne3t0b319JywgSSBhZ3JlZSB0byBlaXRoZXIgcmV0dXJuIHRoZSBnb29kcyBvciBzZXJ2aWNlcyBvciByZXNlbmQge3txdWFudGl0eX19IGluIGEgdGltZWx5IG1hbm5lci4KAAAAAAClMXYFaXNzdWUAAAAAAKhs1EUGY3JlYXRlAAIAAAA4T00RMgNpNjQBCGN1cnJlbmN5AQZ1aW50NjQHYWNjb3VudAAAAAAAkE3GA2k2NAEIY3VycmVuY3kBBnVpbnQ2NA5jdXJyZW5jeV9zdGF0cwAAAA==="};

/*const transaction = {
    expiration: '2018-09-04T18:42:49',
    ref_block_num: 38096,
    ref_block_prefix: 505360011,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [] as any,
    actions: [
        {
            account: 'testeostoken',
            name: 'transfer',
            authorization: [
                {
                    actor: 'thegazelle',
                    permission: 'active',
                },
            ],
            data: {
                from: 'thegazelle',
                to: 'remasteryoda',
                quantity: '1.0000 EOS',
                memo: 'For a secure future.',
            },
        }
    ],
    transaction_extensions: [] as any,
};*/

//const preparedTransactionResult = {"signatures":["SIG_K1_Jxz8NJNoatNQ4HtP5y6SuKZyknjsnRpmzLvW9V6dZRZfS4QhM7dYnQSjteo736T7MoEdiVn99raVU8AbrEsU8U3g4QkKeg"],"compression":0,"packed_context_free_data":"","packed_trx":"29d28e5bd0948b2e1f1e00000000013015a4195395b1ca000000572d3ccdcd0100808a517dc354cb00000000a8ed32323500808a517dc354cb6012f557656ca4ba102700000000000004454f530000000014466f72206120736563757265206675747572652e00"};


/*test('signing,', async function (){

}*/