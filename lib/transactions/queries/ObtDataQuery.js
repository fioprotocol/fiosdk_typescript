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
exports.ObtDataQuery = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class ObtDataQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.getObtData}`;
        this.isEncrypted = true;
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
        this.getResolvedProps = (props) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, props), { includeEncrypted: (_a = props.includeEncrypted) !== null && _a !== void 0 ? _a : false, tokenCode: (_b = props.tokenCode) !== null && _b !== void 0 ? _b : '' }));
        };
        this.props = this.getResolvedProps(props);
    }
    decrypt(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (result.obt_data_records && result.obt_data_records.length > 0) {
                    try {
                        const requests = yield Promise.allSettled(result.obt_data_records.map((obtDataRecord) => __awaiter(this, void 0, void 0, function* () {
                            const encryptPublicKeysArray = [];
                            let encryptPrivateKeysArray = [];
                            const { content: obtDataRecordContent, payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key, } = obtDataRecord || {};
                            try {
                                const payerEncryptKeyRes = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    fioAddress: payer_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'GetObtData',
                                });
                                if (payerEncryptKeyRes) {
                                    encryptPublicKeysArray.push(payerEncryptKeyRes);
                                }
                            }
                            catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                            }
                            try {
                                const payeeEncryptKeyRes = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    fioAddress: payee_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'GetObtData',
                                });
                                if (payeeEncryptKeyRes) {
                                    encryptPublicKeysArray.push(payeeEncryptKeyRes);
                                }
                            }
                            catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                            }
                            const account = this.getActor();
                            if (this.props.encryptKeys) {
                                const accountEncryptKeys = this.props.encryptKeys.get(account);
                                if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                                    encryptPrivateKeysArray =
                                        encryptPrivateKeysArray.concat(accountEncryptKeys.map((accountEncryptKey) => accountEncryptKey.privateKey));
                                }
                            }
                            if (payee_fio_public_key) {
                                encryptPublicKeysArray.push(payee_fio_public_key);
                            }
                            if (payer_fio_public_key) {
                                encryptPublicKeysArray.push(payer_fio_public_key);
                            }
                            encryptPublicKeysArray.push(this.publicKey);
                            encryptPrivateKeysArray.push(this.privateKey);
                            let content = null;
                            try {
                                for (const publicKey of encryptPublicKeysArray) {
                                    for (const privateKey of encryptPrivateKeysArray) {
                                        let unCipherContent = null;
                                        try {
                                            unCipherContent = this.getUnCipherContent('record_obt_data_content', obtDataRecordContent, privateKey, publicKey);
                                            if (unCipherContent !== null) {
                                                content = unCipherContent;
                                                // Exit the inner loop if a successful result is obtained
                                                break;
                                            }
                                        }
                                        catch (error) {
                                            // tslint:disable-next-line:no-console
                                            console.error(error);
                                        }
                                    }
                                }
                                if (content === null) {
                                    // Throw an error if all keys failed
                                    throw new Error(`GetObtData: Get UnCipher Content for account ${account} failed.`);
                                }
                            }
                            catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                                throw error;
                            }
                            if (content) {
                                if (this.props.tokenCode
                                    && content.token_code
                                    && content.token_code !== this.props.tokenCode) {
                                    return null;
                                }
                                return Object.assign(Object.assign({}, obtDataRecord), { content });
                            }
                            return obtDataRecord;
                        })));
                        const fulfilledRequests = [];
                        requests.forEach((req) => req.status === 'fulfilled' && req.value && fulfilledRequests.push(req.value));
                        resolve({ obt_data_records: fulfilledRequests, more: result.more });
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    resolve(Object.assign(Object.assign({}, result), { obt_data_records: [] }));
                }
            }));
        });
    }
}
exports.ObtDataQuery = ObtDataQuery;
//# sourceMappingURL=ObtDataQuery.js.map