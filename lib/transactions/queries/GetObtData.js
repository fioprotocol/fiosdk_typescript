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
const utils_1 = require("../../utils/utils");
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
                    try {
                        const requests = yield Promise.allSettled(result.obt_data_records.map((obtDataRecord) => __awaiter(this, void 0, void 0, function* () {
                            let encryptKey = this.publicKey;
                            const { content: obtDataRecordContent, payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key } = obtDataRecord || {};
                            try {
                                encryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    getEncryptKey: this.getEncryptKey,
                                    method: 'GetObtData',
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
                                content = this.getUnCipherContent('record_obt_data_content', obtDataRecordContent, this.privateKey, encryptKey);
                            }
                            catch (error) {
                                console.warn(`GetObtData: Get UnCipher Content for ${encryptKey} failed. Return original value.`);
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
