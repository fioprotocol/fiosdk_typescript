"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fio_1 = require("react-native-fio");
const fetch = require('node-fetch');
const fiojs_1 = require("fiojs");
const text_encoding_1 = require("text-encoding");
const textEncoder = new text_encoding_1.TextEncoder();
const textDecoder = new text_encoding_1.TextDecoder();
function makeFetchJson() {
    return function fetchJson(uri, opts) {
        return fetch(uri, opts).then(reply => {
            if (!reply.ok) {
                const error = new Error(`Error ${reply.status} while fetching ${uri}`);
                return reply.json().then(json => {
                    error.json = json;
                    error.errorCode = reply.status;
                    error.uri = uri;
                    return Promise.reject(error);
                }, e => Promise.reject(error));
            }
            return reply.json();
        });
    };
}
class Keys {
    createKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = Buffer.from('F0000F00F0000F000F000F0000000000');
            const key = yield react_native_fio_1.FIOSDK.createPrivateKey(buf);
            const privateKey = key.fioKey;
            console.log('privateKey %s', privateKey);
            const publick = react_native_fio_1.FIOSDK.derivedPublicKey(privateKey);
            const publicKey = publick.publicKey;
            console.log('publicKey %s', publicKey);
            return { privateKey, publicKey };
        });
    }
}
class Worker {
    constructor() {
        this.fetchJson = makeFetchJson();
        this.privateKey = '';
        this.publicKey = '';
    }
    getkeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = new Keys();
            const key = yield keys.createKey();
            return key;
        });
    }
    setupSDK() {
        return __awaiter(this, void 0, void 0, function* () {
            //const key = await this.getkeys()
            this.privateKey = '5KJhpazsjBuxyLhJLNufzjbkDb6st5igvFH5qSRknf2VWRD2fza'; //key.privateKey
            this.publicKey = 'FIO5SLYerShFL59VyHuKJ21ciURAWMJnCMkcMJxAgr2po2sq2eZQa'; //key.publicKey
            this.fioSDK = yield new react_native_fio_1.FIOSDK(this.privateKey, this.publicKey, /*'http://192.168.86.23:8888/v1/'*/ 'http://34.220.61.65:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV1');
            console.log('key: ' + this.publicKey + ' actor: ' + this.fioSDK.getActor());
        });
    }
    setupSDK1() {
        return __awaiter(this, void 0, void 0, function* () {
            //const key = await this.getkeys()
            this.privateKey = '5KftCDayJhHLigrxiM6Vx7c7jqfQM6eSPjMQbwrptMUc3w46KAm'; //key.privateKey
            this.publicKey = 'FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA'; //key.publicKey
            this.fioSDK = yield new react_native_fio_1.FIOSDK(this.privateKey, this.publicKey, /*'http://192.168.86.23:8888/v1/'*/ 'http://34.220.61.65:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV1');
            console.log('address: expired1:edge key: ' + this.publicKey + ' privatekey: ' + this.privateKey);
        });
    }
    setupSDK2() {
        return __awaiter(this, void 0, void 0, function* () {
            //const key = await this.getkeys()
            this.privateKey = '5JCf4cYbp7G8ZH3tETvig7KNoXkygiPWYerY1U23CT1wZrGXg7v'; //key.privateKey
            this.publicKey = 'FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP'; //key.publicKey
            this.fioSDK = yield new react_native_fio_1.FIOSDK(this.privateKey, this.publicKey, /*'http://192.168.86.23:8888/v1/'*/ 'http://34.220.61.65:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV1');
            console.log('address: expired2:edge key: ' + this.publicKey + ' actor: ' + this.fioSDK.getActor());
        });
    }
    setupSDK3() {
        return __awaiter(this, void 0, void 0, function* () {
            //const key = await this.getkeys()
            this.privateKey = '5JMmK1ViJwTCyfguQFi3B9eKZT2bz7JT4PXVYw9pzChNUo7oPhi '; //key.privateKey
            this.publicKey = 'FIO6enwFUMcFmudTmM8YPAVurik3gWZ76DL8JuVhFyMD7yPN97vSU'; //key.publicKey
            this.fioSDK = yield new react_native_fio_1.FIOSDK(this.privateKey, this.publicKey, /*'http://192.168.86.23:8888/v1/'*/ 'http://34.220.61.65:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV1');
            console.log('address: expired3:edge key: ' + this.publicKey + ' actor: ' + this.fioSDK.getActor());
        });
    }
    getSDK() {
        return this.fioSDK;
    }
    requestFunds() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK1();
            this.fioSDK.requestFunds('test2:edge', 'test1:edge', this.publicKey, 8, 'FIO', 'memo please coins', 3000000000, null)
                .then(res => { console.log('res: ', res); }).catch(error => { console.error('error: ', error); });
        });
    }
    transferTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK();
            this.fioSDK.transferTokens('FIO87MK3VsNmCjSTtscRKBnEwzbNYsCnGaUWdFgGuCLCV3tVW4Wai', 20000000000, 30000000000)
                .then(res => { console.log('res: ', res); }).catch(error => { console.error('error: ', JSON.stringify(error)); });
        });
    }
    recordSend() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK1();
            this.fioSDK.genericAction('recordSend', { 'fioRequestId': 8, 'payerFIOAddress': 'test1:edge', 'payeeFIOAddress': 'test2:edge', 'payerPublicAddress': 'FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP', 'payeePublicAddress': 'FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP', 'amount': '5', 'tokenCode': 'FIO', 'obtID': '7ed4b7f8ec2d67a18a4068e71141d55c90daf19837c102e756a55f909452f52e', 'memo': 'de test2 a test1', 'maxFee': '0', 'tpid': '', 'status': 'sent_to_blockchain' }).
                then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
            //this.fioSDK.recordSend('test1:edge','test2:edge','FIO8kdrXrYcrf7nvqhTzKr24P2xpKt5UVNZ3sDgz2q4sVVV2Kz4KA','FIO8HNTa4xXf4jiM3da5Q8kv6AuoT2Kh6NZmzFabK3vhwisvyotuP','1','FIO','','1',0,'',null,1,'memo')
            //.then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
        });
    }
    getPendingFioRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK2();
            this.fioSDK.getPendingFioRequests(this.publicKey)
                .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
        });
    }
    getSentFioRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK2();
            this.fioSDK.getSentFioRequests(this.publicKey)
                .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK();
            this.fioSDK.getFioBalance('FIO87MK3VsNmCjSTtscRKBnEwzbNYsCnGaUWdFgGuCLCV3tVW4Wai')
                .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
        });
    }
    doSomethingElse2() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK();
            this.fioSDK.getSentFioRequests(this.publicKey)
                .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
        });
    }
    decrypt() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getkeys();
            this.privateKey = key.privateKey;
            this.publicKey = key.publicKey;
            const params = {
                privateKey: this.privateKey,
                publicKey: 'FIO5SLYerShFL59VyHuKJ21ciURAWMJnCMkcMJxAgr2po2sq2eZQa',
                textEncoder: textEncoder,
                textDecoder: textDecoder
            };
            console.error('params', params);
            const cipher = fiojs_1.Fio.createSharedCipher(params);
            return cipher.decrypt('new_funds_content', '6d0a17de0e64527ee4c6c22938a106d5e79727112fb143ba67f3363056fff063f56b639103423255460a466bed08e4a0fb8996a76942e4375caf1da71bab02ac059bd373feee7551b63c409ae4a3c984f2d6d77fcc56622a6d7eb11eb5c1f38bb9f2c53c50f9755eb74d33bbf0dbdc66');
        });
    }
}
const worker = new Worker();
// worker.getPendingFioRequests()
// worker.setupSDK2()
// worker.setupSDK3()
//worker.getBalance()
worker.getSentFioRequests();
//worker.transferTokens()
//worker.getPendingFioRequests()
//worker.getSentFioRequests()
// worker.doSomethingElse2()
// worker.doSomething()
// worker.getBalance()
// worker.decrypt().then(content => {console.error('content: ', content)})
