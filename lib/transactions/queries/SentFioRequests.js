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
exports.SentFioRequests = void 0;
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class SentFioRequests extends Query_1.Query {
    constructor({ fioPublicKey, limit = null, offset = null, includeEncrypted = false, encryptKeys, getEncryptKey }) {
        super();
        this.ENDPOINT = 'chain/get_sent_fio_requests';
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
        this.includeEncrypted = includeEncrypted;
        this.encryptKeys = encryptKeys;
        this.getEncryptKey = getEncryptKey;
    }
    getData() {
        const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null };
        return data;
    }
    decrypt(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (result.requests.length > 0) {
                    try {
                        const requests = yield Promise.allSettled(result.requests.map((value) => __awaiter(this, void 0, void 0, function* () {
                            let encryptPublicKeysArray = [];
                            let encryptPrivateKeysArray = [];
                            const { payer_fio_address, payer_fio_public_key } = value || {};
                            try {
                                const uncipherEncryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    getEncryptKey: this.getEncryptKey,
                                    method: 'SentFioRequests',
                                    fioAddress: payer_fio_address,
                                });
                                if (uncipherEncryptKey) {
                                    encryptPublicKeysArray.push(uncipherEncryptKey);
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            const account = this.getActor();
                            if (this.encryptKeys) {
                                const accountEncryptKeys = this.encryptKeys.get(account);
                                if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                                    encryptPrivateKeysArray =
                                        encryptPrivateKeysArray.concat(accountEncryptKeys.map((accountEncryptKey) => accountEncryptKey.privateKey));
                                }
                            }
                            if (payer_fio_public_key) {
                                encryptPublicKeysArray.push(payer_fio_public_key);
                            }
                            encryptPublicKeysArray.push(this.publicKey);
                            encryptPrivateKeysArray.push(this.privateKey);
                            let content = null;
                            try {
                                for (let i = 0; i < encryptPublicKeysArray.length; i++) {
                                    const publicKey = encryptPublicKeysArray[i];
                                    for (let j = 0; j < encryptPrivateKeysArray.length; j++) {
                                        const privateKey = encryptPrivateKeysArray[j];
                                        let result = null;
                                        try {
                                            result = this.getUnCipherContent('new_funds_content', value.content, privateKey, publicKey);
                                            if (result !== null) {
                                                content = result;
                                                break; // Exit the inner loop if a successful result is obtained
                                            }
                                        }
                                        catch (error) { }
                                    }
                                }
                                if (content === null) {
                                    throw new Error(`SentFioRequests: Get UnCipher Content for account ${account} failed.`); // Throw an error if all keys failed
                                }
                                else {
                                    value.content = content;
                                }
                            }
                            catch (error) {
                                if (this.includeEncrypted)
                                    return value;
                                console.error(error);
                                throw error;
                            }
                            return value;
                        })));
                        const fulfilledRequests = [];
                        requests
                            .forEach(result => result.status === 'fulfilled' && fulfilledRequests.push(result.value));
                        resolve({ requests: fulfilledRequests, more: result.more });
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    resolve(undefined);
                }
            }));
        });
    }
}
exports.SentFioRequests = SentFioRequests;
