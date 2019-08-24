const serverMocks = {
    block: { "timestamp": "2019-04-30T17:51:35.000", "producer": "eosio", "confirmed": 0, "previous": "002734fc36072c6666579227d4e1536d80b874c29dee31c6f5175d23a509f755", "transaction_mroot": "0000000000000000000000000000000000000000000000000000000000000000", "action_mroot": "f60c55bb7f5fdf265ea8e0467ecc53ffd9cc418cec3181e694dedf1f80525aa5", "schedule_version": 0, "new_producers": null, "header_extensions": [], "producer_signature": "SIG_K1_K6AsK9RmBc4JghoZXPhXxuEmTvTPXANSMe5T3pdKa5iQWSTomB7YJtpTDLhZ7gRgDjuBoiujAYTGiL47ucxKMVFMVzErYz", "transactions": [], "block_extensions": [], "id": "002734fd1d05b9dce6c5df7bb63b958989fcf9d12325e3a7103e0ab8137dade1", "block_num": 2569469, "ref_block_prefix": 2078262758 },
    chain: { "server_version": "269c661e", "chain_id": "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", "head_block_num": 2569470, "last_irreversible_block_num": 2569469, "last_irreversible_block_id": "002734fd1d05b9dce6c5df7bb63b958989fcf9d12325e3a7103e0ab8137dade1", "head_block_id": "002734fee994b0d480c4e4eb711c99ea53acc53a8b42e452307380c159c7716e", "head_block_time": "2019-04-30T17:51:35.500", "head_block_producer": "eosio", "virtual_block_cpu_limit": 200000000, "virtual_block_net_limit": 1048576000, "block_cpu_limit": 199900, "block_net_limit": 1048576, "server_version_string": "v1.2.1-1301-g269c661e7" },
    nameNotAvailable: { "is_registered": true },
    nameAvailable: { "is_registered": false },
    registerName: {
        "transaction_id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
        "processed": {
            "id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
            "block_num": 2570159,
            "block_time": "2019-04-30T17:57:20.000",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 1207, "net_usage_words": 14 },
            "elapsed": 1207,
            "net_usage": 112,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.system",
                    "response": "{\"expiration\":1588208960,\"status\":\"OK\", \"fee_collected\": 30000000000}",
                    "act_digest": "e32df88f31f909f21e08469c38c4566026264d1ee5c7fbd890d4b10b31102230",
                    "global_sequence": 2573410,
                    "recv_sequence": 2943,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 3]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.system", "name": "registername", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "fio_name": "hola444.brd", "actor": "p4hc54ppiofx" }, "hex_data": "0b686f6c613434342e627264d01775b592821aa9" },
                "context_free": false,
                "elapsed": 1070,
                "console": "Name hash: 4888686337384024064, Domain has: 1479432477591207936\naccount: 12185195308425484240 actor: 12185195308425484240\nPayments currently disabled.Payments currently disabled.",
                "trx_id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
                "block_num": 2570159,
                "block_time": "2019-04-30T17:57:20.000",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.system", "delta": 610 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        },
    },
    renewFioDomainName: {
        "transaction_id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
        "processed": {
            "id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
            "block_num": 2570159,
            "block_time": "2019-04-30T17:57:20.000",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 1207, "net_usage_words": 14 },
            "elapsed": 1207,
            "net_usage": 112,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.system",
                    "response": "{\"expiration\":1588208960,\"status\":\"OK\", \"fee_collected\": 30000000000}",
                    "act_digest": "e32df88f31f909f21e08469c38c4566026264d1ee5c7fbd890d4b10b31102230",
                    "global_sequence": 2573410,
                    "recv_sequence": 2943,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 3]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.system", "name": "registername", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "fio_name": "hola444.brd", "actor": "p4hc54ppiofx" }, "hex_data": "0b686f6c613434342e627264d01775b592821aa9" },
                "context_free": false,
                "elapsed": 1070,
                "console": "Name hash: 4888686337384024064, Domain has: 1479432477591207936\naccount: 12185195308425484240 actor: 12185195308425484240\nPayments currently disabled.Payments currently disabled.",
                "trx_id": "f525f5513addc737a181d462a1312d1923e1d5c97cc43a9c77d846051e19d30a",
                "block_num": 2570159,
                "block_time": "2019-04-30T17:57:20.000",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.system", "delta": 610 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        },
    },
    registerNameFail: {
        "type": "invalid_input",
        "message": "An invalid request was sent in, please check the nested errors for details.",
        "fields": [{
            "name": "fio_name",
            "value": "hola443.brd",
            "error": "FIO name already registered"
        }],
    },
    FioBalance: {
        balance: "1000.0000"
    },
    GetInfo: {
        chain_id: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
    },
    FioNames: {
        "fio_domains": [{
            "fio_domain": "alice",
            "expiration": "15734567"
        }],
        "fio_addresses": [{
            "fio_address": "purse.alice",
            "expiration": "15734567"
        }]
    },
    pendingRequest: {
        "requests": [{ "fio_request_id": 86, "payer_fio_address": "76456891.brd", "payee_fio_address": "76454437.brd", "payee_public_address": "76454437.brd", "amount": "100.0", "token_code": "ETH", "metadata": "{\"memo\": \"testingWithVitor\"}", "time_stamp": 1556676465 }]
    },
    publicAddressLookUp: { "public_address": "77081021.brdLTCADDRESS" },
    sentRequests: { "requests": [{ "fio_request_id": 89, "payer_fio_address": "77634863.brd", "payee_fio_address": "77632281.brd", "payee_public_address": "77632281.brd", "amount": "100.0", "token_code": "ETH", "metadata": "{\"memo\": \"testingWithVitor\"}", "time_stamp": 1556677643, "status": "requested" }] },
    addPublicAddress: {
        "transaction_id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
        "processed": {
            "id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
            "block_num": 2632445,
            "block_time": "2019-05-01T02:36:23.000",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 898, "net_usage_words": 17 },
            "elapsed": 898,
            "net_usage": 136,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.system",
                    "response": "{\"status\":\"OK\"}",
                    "act_digest": "3598adf51847a49fa64a672a5f05f20deb0e20ec8f6f92b979e0df3f28067264",
                    "global_sequence": 2635966,
                    "recv_sequence": 3201,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 51]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.system", "name": "addaddress", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "fio_address": "78177992.brd", "token_code": "ETH", "public_address": "78177992.brd", "actor": "p4hc54ppiofx" }, "hex_data": "0c37383137373939322e627264034554480c37383137373939322e627264d01775b592821aa9" },
                "context_free": false,
                "elapsed": 768,
                "console": "account: 12185195308425484240 actor: 12185195308425484240\nPayments currently disabled.",
                "trx_id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
                "block_num": 2632445,
                "block_time": "2019-05-01T02:36:23.000",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.system", "delta": 306 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        }
    },
    recordSend: {
        "transaction_id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
        "processed": {
            "id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
            "block_num": 2632445,
            "block_time": "2019-05-01T02:36:23.000",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 898, "net_usage_words": 17 },
            "elapsed": 898,
            "net_usage": 136,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.system",
                    "response": "{\"status\":\"OK\"}",
                    "act_digest": "3598adf51847a49fa64a672a5f05f20deb0e20ec8f6f92b979e0df3f28067264",
                    "global_sequence": 2635966,
                    "recv_sequence": 3201,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 51]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.system", "name": "addaddress", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "fio_address": "78177992.brd", "token_code": "ETH", "public_address": "78177992.brd", "actor": "p4hc54ppiofx" }, "hex_data": "0c37383137373939322e627264034554480c37383137373939322e627264d01775b592821aa9" },
                "context_free": false,
                "elapsed": 768,
                "console": "account: 12185195308425484240 actor: 12185195308425484240\nPayments currently disabled.",
                "trx_id": "0a24972725b30f526c2415cb45b7b8b3829dd9fd7db610830acb8464bc7fc13b",
                "block_num": 2632445,
                "block_time": "2019-05-01T02:36:23.000",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.system", "delta": 306 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        }
    },
    rejectFundRequest: {
        "processed": {
            "id": "437e1fb2e717d25289c61258794abc475200a70a2133a036255ee43f570ffa7c",
            "block_num": 2644850,
            "block_time": "2019-05-01T04:19:45.500",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 489, "net_usage_words": 14 },
            "elapsed": 489,
            "net_usage": 112,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.reqobt",
                    "response": "{\"status\":\"request_rejected\"}",
                    "act_digest": "68fa92ba02617d988cbbaec7021cc6ea04b2f10d931ca5704088c81c21158399",
                    "global_sequence": 2648413,
                    "recv_sequence": 152,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 72]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.reqobt", "name": "rejectfndreq", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "fio_request_id": "93", "actor": "p4hc54ppiofx" }, "hex_data": "0239330c7034686335347070696f6678" },
                "context_free": false,
                "elapsed": 374,
                "console": "call new funds request\naccount: 12185195308425484240 actor: 12185195308425484240\n",
                "trx_id": "437e1fb2e717d25289c61258794abc475200a70a2133a036255ee43f570ffa7c",
                "block_num": 2644850,
                "block_time": "2019-05-01T04:19:45.500",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.reqobt", "delta": 273 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        }
    },
    requestNewFunds: {
        "processed": {
            "id": "c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b",
            "block_num": 2646444,
            "block_time": "2019-05-01T04:33:02.500",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 841, "net_usage_words": 26 },
            "elapsed": 841,
            "net_usage": 208,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.token",
                    "response": "{\"status\": \"OK\",\"fee_collected\": 0}",
                    "act_digest": "45f0980d70c1c192598a7ac1be85dff5e2ec7fcdec9567c3c74595f0b20a66bc",
                    "global_sequence": 2650010,
                    "recv_sequence": 153,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 73]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.reqobt", "name": "newfundsreq", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "payer_fio_address": "77632281.brd", "payee_fio_address": "77081021.brd", "payee_public_address": "0xab5801a7d398351b8be11c439e05c5b3259aec9b", "amount": "100.0", "token_code": "ETH", "metadata": "{\"memo\": \"Invoice1234\"}", "actor": "p4hc54ppiofx" }, "hex_data": "0c37373633323238312e6272640c37373038313032312e6272642a307861623538303161376433393833353162386265313163343339653035633562333235396165633962053130302e3003455448177b226d656d6f223a2022496e766f69636531323334227d0c7034686335347070696f6678" },
                "context_free": false,
                "elapsed": 699,
                "console": "account: 12185195308425484240 actor: 12185195308425484240\n",
                "trx_id": "c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b",
                "block_num": 2646444,
                "block_time": "2019-05-01T04:33:02.500",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.reqobt", "delta": 477 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        }
    },
    transferToken: {
        "processed": {
            "id": "c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b",
            "block_num": 2646444,
            "block_time": "2019-05-01T04:33:02.500",
            "producer_block_id": null,
            "receipt": { "status": "executed", "cpu_usage_us": 841, "net_usage_words": 26 },
            "elapsed": 841,
            "net_usage": 208,
            "scheduled": false,
            "action_traces": [{
                "receipt": {
                    "receiver": "fio.reqobt",
                    "response": "{\"status\": \"OK\",\"fee_collected\": 0}",
                    "act_digest": "45f0980d70c1c192598a7ac1be85dff5e2ec7fcdec9567c3c74595f0b20a66bc",
                    "global_sequence": 2650010,
                    "recv_sequence": 153,
                    "auth_sequence": [
                        ["p4hc54ppiofx", 73]
                    ],
                    "code_sequence": 1,
                    "abi_sequence": 1
                },
                "act": { "account": "fio.reqobt", "name": "newfundsreq", "authorization": [{ "actor": "p4hc54ppiofx", "permission": "active" }], "data": { "payer_fio_address": "77632281.brd", "payee_fio_address": "77081021.brd", "payee_public_address": "0xab5801a7d398351b8be11c439e05c5b3259aec9b", "amount": "100.0", "token_code": "ETH", "metadata": "{\"memo\": \"Invoice1234\"}", "actor": "p4hc54ppiofx" }, "hex_data": "0c37373633323238312e6272640c37373038313032312e6272642a307861623538303161376433393833353162386265313163343339653035633562333235396165633962053130302e3003455448177b226d656d6f223a2022496e766f69636531323334227d0c7034686335347070696f6678" },
                "context_free": false,
                "elapsed": 699,
                "console": "account: 12185195308425484240 actor: 12185195308425484240\n",
                "trx_id": "c4c0482faf743064367c660251e0f43e6a7eb9918eaef40303b1e41a53a0322b",
                "block_num": 2646444,
                "block_time": "2019-05-01T04:33:02.500",
                "producer_block_id": null,
                "account_ram_deltas": [{ "account": "fio.reqobt", "delta": 477 }],
                "except": null,
                "inline_traces": []
            }],
            "except": null
        }
    },
    abi1:{
        "account_name": "fio.system",
        "code_hash": "db4f497225529c4cee77b1632144b8b73be71be09771b04e098479e54df89add",
        "abi_hash": "6db49abfa6af117eaf1b3cf4a49ce2b40dcba899eff131bdbb53518319121493",
        "abi": "DmVvc2lvOjphYmkvMS4wAA4HZmlvbmFtZQAIBG5hbWUGc3RyaW5nCG5hbWVoYXNoBnVpbnQ2NAZkb21haW4Gc3RyaW5nCmRvbWFpbmhhc2gGdWludDY0CmV4cGlyYXRpb24GdWludDMyB2FjY291bnQGdWludDY0CWFkZHJlc3NlcwhzdHJpbmdbXRdidW5kbGVlbGlnaWJsZWNvdW50ZG93bgZ1aW50NjQGZG9tYWluAAQEbmFtZQZzdHJpbmcKZG9tYWluaGFzaAZ1aW50NjQKZXhwaXJhdGlvbgZ1aW50MzIHYWNjb3VudAZ1aW50NjQJY2hhaW5MaXN0AAMEbmFtZQZzdHJpbmcCaWQGdWludDY0CWNoYWluaGFzaAZ1aW50MzIIa2V5X25hbWUABgJpZAZ1aW50NjQDa2V5BnN0cmluZwdrZXloYXNoBnVpbnQ2NAljaGFpbnR5cGUGdWludDY0BG5hbWUGc3RyaW5nCmV4cGlyYXRpb24GdWludDMyCmVvc2lvX25hbWUAAwdhY2NvdW50BG5hbWUJY2xpZW50a2V5BnN0cmluZwdrZXloYXNoBnVpbnQ2NAljaGFpbnBhaXIAAwVpbmRleAZ1aW50NjQJY2hhaW5uYW1lBnN0cmluZwljaGFpbmhhc2gGdWludDY0CnJlZ2FkZHJlc3MABAtmaW9fYWRkcmVzcwZzdHJpbmcUb3duZXJfZmlvX3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUGdWludDY0BWFjdG9yBG5hbWUKYWRkYWRkcmVzcwAFC2Zpb19hZGRyZXNzBnN0cmluZwp0b2tlbl9jb2RlBnN0cmluZw5wdWJsaWNfYWRkcmVzcwZzdHJpbmcHbWF4X2ZlZQZ1aW50NjQFYWN0b3IEbmFtZQlyZWdkb21haW4ABApmaW9fZG9tYWluBnN0cmluZxRvd25lcl9maW9fcHVibGljX2tleQZzdHJpbmcHbWF4X2ZlZQZ1aW50NjQFYWN0b3IEbmFtZQpyZW1vdmVuYW1lAAAMcmVtb3ZlZG9tYWluAAAKcm12YWRkcmVzcwAAC2RlY3Jjb3VudGVyAAELZmlvX2FkZHJlc3MGc3RyaW5nCmJpbmQyZW9zaW8AAwdhY2NvdW50BG5hbWUKY2xpZW50X2tleQZzdHJpbmcIZXhpc3RpbmcEYm9vbAcAAMbqpmSYugpyZWdhZGRyZXNzAAAAxuqmZFIyCmFkZGFkZHJlc3MAAACYzkiamLoJcmVnZG9tYWluAACAkmaqTaW6CnJlbW92ZW5hbWUAMJ2RNKlNpboMcmVtb3ZlZG9tYWluAAAAxuqmZLa8CnJtdmFkZHJlc3MAAAB1mCqRpjsKYmluZDJlb3NpbwAFAAAAWEkzqVsDaTY0AQRuYW1lAQZzdHJpbmcHZmlvbmFtZQAAAABPZyRNA2k2NAEEbmFtZQEGc3RyaW5nBmRvbWFpbgAAAADg6UxDA2k2NAEEbmFtZQEGc3RyaW5nCWNoYWluTGlzdAAAAFhJM72CA2k2NAECaWQBBnVpbnQ2NAhrZXlfbmFtZQAAVtJM6jBVA2k2NAEHYWNjb3VudAEGdWludDY0CmVvc2lvX25hbWUAAAAA="
    },
    abi2:{
        "account_name": "fio.reqobt",
        "code_hash": "ecb56d4395410c602e518cde545254104a66e201a0583ba394d53e0b6608e9a6",
        "abi_hash": "6d21041835a1fbcf6db36015cf4b35e01718eeaa09f76637a6aee685d583646a",
        "abi": "DmVvc2lvOjphYmkvMS4wAAUKZmlvcmVxY3R4dAAIDmZpb19yZXF1ZXN0X2lkBnVpbnQ2NBFwYXllcl9maW9fYWRkcmVzcwZ1aW50NjQRcGF5ZWVfZmlvX2FkZHJlc3MGdWludDY0FHBheWVlX3B1YmxpY19hZGRyZXNzBnN0cmluZwZhbW91bnQGc3RyaW5nCnRva2VuX2NvZGUGc3RyaW5nCG1ldGFkYXRhBnN0cmluZwp0aW1lX3N0YW1wBnVpbnQ2NAlmaW9yZXFzdHMABQJpZAZ1aW50NjQOZmlvX3JlcXVlc3RfaWQGdWludDY0BnN0YXR1cwZ1aW50NjQIbWV0YWRhdGEGc3RyaW5nCnRpbWVfc3RhbXAGdWludDY0CnJlY29yZHNlbmQADBFwYXllcl9maW9fYWRkcmVzcwZzdHJpbmcRcGF5ZWVfZmlvX2FkZHJlc3MGc3RyaW5nFHBheWVyX3B1YmxpY19hZGRyZXNzBnN0cmluZxRwYXllZV9wdWJsaWNfYWRkcmVzcwZzdHJpbmcGYW1vdW50BnN0cmluZwp0b2tlbl9jb2RlBnN0cmluZwZzdGF0dXMGc3RyaW5nBm9idF9pZAZzdHJpbmcIbWV0YWRhdGEGc3RyaW5nDmZpb19yZXF1ZXN0X2lkBnN0cmluZwdtYXhfZmVlBnVpbnQ2NAVhY3RvcgZzdHJpbmcLbmV3ZnVuZHNyZXEACBFwYXllcl9maW9fYWRkcmVzcwZzdHJpbmcRcGF5ZWVfZmlvX2FkZHJlc3MGc3RyaW5nFHBheWVlX3B1YmxpY19hZGRyZXNzBnN0cmluZwZhbW91bnQGc3RyaW5nCnRva2VuX2NvZGUGc3RyaW5nCG1ldGFkYXRhBnN0cmluZwdtYXhfZmVlBnVpbnQ2NAVhY3RvcgZzdHJpbmcMcmVqZWN0Zm5kcmVxAAMOZmlvX3JlcXVlc3RfaWQGc3RyaW5nB21heF9mZWUGdWludDY0BWFjdG9yBnN0cmluZwMAQJoKp0uRugpyZWNvcmRzZW5kAACsujhNvbiaC25ld2Z1bmRzcmVxAGDVTXNlpJ66DHJlamVjdGZuZHJlcQACAHDuGVl1qVsDaTY0AQ5maW9fcmVxdWVzdF9pZAEGdWludDY0CmZpb3JlcWN0eHQAAMYZW3WpWwNpNjQBAmlkAQZ1aW50NjQJZmlvcmVxc3RzAAAAAA==="
        },
    abi3:{
        "account_name": "fio.token",
        "code_hash": "ca3a3b5dc73d1f9cf15364d26901a452a5c020277434023dfc4d42c37fb3c255",
        "abi_hash": "680a2c79927a627df41cd2ba4d13eae5c0cefa80907be6dbab7165d9cfbbf2e1",
        "abi": "DmVvc2lvOjphYmkvMS4wAQxhY2NvdW50X25hbWUEbmFtZQYIdHJhbnNmZXIABARmcm9tDGFjY291bnRfbmFtZQJ0bwxhY2NvdW50X25hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcMdHJuc2Zpb3B1Ymt5AAQQcGF5ZWVfcHVibGljX2tleQZzdHJpbmcGYW1vdW50BnN0cmluZwdtYXhfZmVlBnVpbnQ2NAVhY3RvcgRuYW1lBmNyZWF0ZQACBmlzc3VlcgxhY2NvdW50X25hbWUObWF4aW11bV9zdXBwbHkFYXNzZXQFaXNzdWUAAwJ0bwxhY2NvdW50X25hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIMYWNjb3VudF9uYW1lBAAAAFctPM3NCHRyYW5zZmVyAODh0ZW6hefNDHRybnNmaW9wdWJreQAAAAAAAKUxdgVpc3N1ZQAAAAAAqGzURQZjcmVhdGUAAgAAADhPTREyA2k2NAEIY3VycmVuY3kBBnVpbnQ2NAdhY2NvdW50AAAAAACQTcYDaTY0AQhjdXJyZW5jeQEGdWludDY0DmN1cnJlbmN5X3N0YXRzAAAAAA==="
    },
}

module.exports = serverMocks;