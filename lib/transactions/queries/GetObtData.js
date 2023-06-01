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
exports.GetObtData = void 0;
const Query_1 = require("./Query");
class GetObtData extends Query_1.Query {
    constructor({ fioPublicKey, limit = 0, offset = 0, tokenCode = '', getEncryptKey }) {
        super();
        this.ENDPOINT = 'chain/get_obt_data';
        this.isEncrypted = true;
        this.fio_public_key = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
        this.tokenCode = tokenCode;
        this.getEncryptKey = getEncryptKey;
    }
    getData() {
        return { fio_public_key: this.fio_public_key, limit: this.limit || null, offset: this.offset || null };
    }
    decrypt(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (result.obt_data_records && result.obt_data_records.length > 0) {
                    let content = null;
                    const contentType = 'record_obt_data_content';
                    try {
                        const requests = yield Promise.allSettled(result.obt_data_records.map((obtDataRecord) => __awaiter(this, void 0, void 0, function* () {
                            let encryptKey = this.publicKey;
                            if (obtDataRecord.payer_fio_address) {
                                try {
                                    const payerEncryptKey = yield this.getEncryptKey(obtDataRecord.payer_fio_address);
                                    if (payerEncryptKey && payerEncryptKey.encrypt_public_key) {
                                        encryptKey = payerEncryptKey.encrypt_public_key;
                                    }
                                }
                                catch (error) {
                                    console.warn(`Get Encrypt Key for ${obtDataRecord.payer_fio_address} failed. Using publicKey.`);
                                    // Skip if getEncryptKey fails and continue with the publicKey
                                }
                            }
                            try {
                                if (obtDataRecord.payer_fio_public_key === encryptKey) {
                                    content = this.getUnCipherContent(contentType, obtDataRecord.content, this.privateKey, obtDataRecord.payee_fio_public_key);
                                }
                                else {
                                    content = this.getUnCipherContent(contentType, obtDataRecord.content, this.privateKey, obtDataRecord.payer_fio_public_key);
                                }
                            }
                            catch (error) {
                                console.warn(`Get UnCipher Content for ${encryptKey} failed. Return original value.`);
                            }
                            if (content) {
                                if (this.tokenCode && content.token_code && content.token_code !== this.tokenCode) {
                                    return null;
                                }
                                obtDataRecord.content = content;
                            }
                            return obtDataRecord;
                        })));
                        const fulfilledRequests = [];
                        requests
                            .forEach(result => result.status === 'fulfilled' && result.value && fulfilledRequests.push(result.value));
                        resolve({ obt_data_records: fulfilledRequests, more: result.more });
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    resolve(result);
                }
            }));
        });
    }
}
exports.GetObtData = GetObtData;
