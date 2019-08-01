"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            const key = yield react_native_fio_1.FIOSDK.createPrivateKeyMnemonic(buf);
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
            const key = yield this.getkeys();
            this.privateKey = key.privateKey;
            this.publicKey = key.publicKey;
            this.fioSDK = yield new react_native_fio_1.FIOSDK(this.privateKey, this.publicKey, 'http://54.184.39.43:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV4');
        });
    }
    doSomething() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK();
            this.fioSDK.requestFunds('faucet:fio', 'fire:edge', this.publicKey, 8, 'FIO', 'memo', 3000000000, null)
                .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
        });
    }
    doSomethingElse() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupSDK();
            this.fioSDK.getPendingFioRequests(this.publicKey)
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
                publicKey: this.publicKey,
                textEncoder: textEncoder,
                textDecoder: textDecoder
            };
            console.error('params', params);
            const cipher = fiojs_1.Fio.createSharedCipher(params);
            return cipher.decrypt('new_funds_content', 'fcbb5df83cce121bda60fab613806a86dc4e2a47c36d116b747880e024480784c3a3fd9998dc0e9873112db1512c6ae9dbbef8854a3d3afacb501cbd0896af55c1fb5b51c01cb847dd67a018d7e1abacf91620b4f5ef2291edd90e22f0314153f05aeb5670c508cfffd3792937563767b9a85e0df4bc26eaaecdf58924f925cc');
        });
    }
}
const worker = new Worker();
//worker.setupSDK()
//worker.doSomething()
worker.doSomethingElse2();
//worker.decrypt().then(content => {console.error('content: ', content)})
