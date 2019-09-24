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
            console.log('privateKey %s', this.privateKey);
            const publick = react_native_fio_1.FIOSDK.derivedPublicKey(this.privateKey);
            const publicKey = publick.publicKey;
            console.log('publicKey %s', this.publicKey);
            return { privateKey, publicKey };
        });
    }
}
class Worker {
    constructor() {
        this.fetchJson = makeFetchJson();
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
            const privateKey = key.privateKey;
            const publicKey = key.publicKey;
            console.error('keys.privateKey', privateKey);
            console.error('keys.publicKey', publicKey);
            this.fioSDK = new react_native_fio_1.FIOSDK(privateKey, publicKey, 'http://54.184.39.43:8889/v1/', null, fetchJson, 'http://mock.dapix.io/mockd/DEV4');
        });
    }
    doSomething() {
        this.fioSDK.requestFunds('fire:edge', 'fire:edge', keys.publicKey, 5, 'FIO', 'memo', 3000000000, null)
            .then(res => { console.log('res: ', res); }).catch(error => { console.log('error: ', error); });
    }
}
const worker = new Worker();
worker.setupSDK();
worker.doSomething();
//fioSDK.isAvailable('fire:edge').then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
//fioSDK.getPublicAddress('faucet:fio','FIO').then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
// requestFunds(payerFioAddress: string, payeeFioAddress: string,payeePublicAddress: string, amount: number,tokenCode: string, memo: string,maxFee:number, payerFioPublicKey?:string, tpid:string='', hash?:string, offlineUrl?:string):Promise<any>{
