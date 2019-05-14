const FIOSDK = require('../lib/FIOSDK');
const Transactions = require('../lib/transactions/Transactions');
const ReactNativeFio = require('./ReactNativeFioMock');
const serverMocks = require('./serverMockResponses');
global.fetch = require('jest-fetch-mock')

FIOSDK.FIOSDK.ReactNativeFio = new ReactNativeFio.ReactNativeFio();
fiosdk = new FIOSDK.FIOSDK("5KBX1dwHME4VyuUss2sYM25D5ZTDvyYrbEz37UJqwAVAsR4tGuY",
    "EOS7isxEua78KPVbGzKemH4nj2bWE52gqj8Hkac3tc7jKNvpfWzYS",
    "http://34.220.57.45:8889/v1/");

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

test('RequestNewFunds', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.requestNewFunds));

    function callback(data) {
        expect(data).toEqual(expect.stringContaining("c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b"))
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/new_funds_request')
        done();
    }

    fiosdk.requestNewFunds("77632281.brd", "77081021.brd", "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        "ETH", 100.00, "{\"memo\": \"Invoice1234\"}").then(res => {
        callback(res.processed.id);
    }).catch(error => {
        console.error(error)
    })
})

test('TransferToken', done => {
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(serverMocks.transferToken));

    function callback(data) {
        expect(data).toBe("{\"status\": \"OK\",\"fee_collected\": 0}")
        expect(fetch.mock.calls.length).toEqual(4)
        expect(fetch.mock.calls[3][0]).toEqual('http://34.220.57.45:8889/v1/chain/transfer_tokens_pub_key')
        expect(fetch.mock.calls[0][1].body).toEqual("{\"action\":\"transferfio\",\"json\":{\"payee_public_key\":\"actor\",\"amount\":\"1.0\",\"max_fee\":0,\"actor\":\"actor\"}}")
        done();
    }
    fiosdk.transferTokens("EOS8PRe4WRZJj5mkem6qVGKyvNFgPsNnjNN6kPhh6EaCpzCVin5Jj", "1.0").then(res => {
        callback(res.processed.action_traces[0].receipt.response);
    }).catch(error => {
        console.error(error)
    })
})