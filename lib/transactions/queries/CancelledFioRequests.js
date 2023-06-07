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
exports.CancelledFioRequests = void 0;
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class CancelledFioRequests extends Query_1.Query {
    constructor({ fioPublicKey, limit = null, offset = null, getEncryptKey }) {
        super();
        this.ENDPOINT = 'chain/get_cancelled_fio_requests';
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
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
                            let encryptKey = this.publicKey;
                            const { payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key } = value || {};
                            try {
                                encryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    getEncryptKey: this.getEncryptKey,
                                    method: 'CancelledFioRequests',
                                    payeeFioAddress: payee_fio_address,
                                    payerFioAddress: payer_fio_address,
                                    payeePublicKey: payee_fio_public_key,
                                    payerPublicKey: payer_fio_public_key,
                                    publicKey: this.publicKey
                                });
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                value.content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, encryptKey);
                            }
                            catch (error) {
                                console.warn(`CancelledFioRequests: Get UnCipher Content for ${encryptKey} failed. Return original value.`);
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
exports.CancelledFioRequests = CancelledFioRequests;
