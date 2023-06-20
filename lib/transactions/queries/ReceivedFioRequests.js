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
exports.ReceivedFioRequests = void 0;
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class ReceivedFioRequests extends Query_1.Query {
    constructor({ fioPublicKey, limit = null, offset = null, includeEncrypted = false, encryptKeys, getEncryptKey, }) {
        super();
        this.ENDPOINT = 'chain/get_received_fio_requests';
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
                            let encryptKeysArray = [];
                            const { payee_fio_address, payee_fio_public_key } = value || {};
                            try {
                                const uncipherEncryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    getEncryptKey: this.getEncryptKey,
                                    method: 'ReceivedFioRequests',
                                    fioAddress: payee_fio_address,
                                });
                                if (uncipherEncryptKey) {
                                    encryptKeysArray.push({ publicKey: uncipherEncryptKey });
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            const account = this.getActor();
                            if (this.encryptKeys) {
                                const accountEncryptKeys = this.encryptKeys.get(account);
                                if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                                    encryptKeysArray = encryptKeysArray.concat(accountEncryptKeys);
                                }
                            }
                            if (payee_fio_public_key) {
                                encryptKeysArray.push({ publicKey: payee_fio_public_key });
                            }
                            encryptKeysArray.push({ publicKey: this.publicKey });
                            let content = null;
                            try {
                                for (let i = 0; i < encryptKeysArray.length; i++) {
                                    const { publicKey, privateKey } = encryptKeysArray[i];
                                    let result = null;
                                    try {
                                        result = this.getUnCipherContent('new_funds_content', value.content, privateKey || this.privateKey, publicKey);
                                    }
                                    catch (error) { }
                                    // Check if the result is successful
                                    if (result !== null) {
                                        content = result;
                                        break; // Exit the loop if a successful result is obtained
                                    }
                                }
                                if (content === null) {
                                    throw new Error(`ReceivedFioRequests: Get UnCipher Content for account ${account} failed.`); // Throw an error if all keys failed
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
exports.ReceivedFioRequests = ReceivedFioRequests;
