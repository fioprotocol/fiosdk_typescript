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
exports.CancelledFioRequestsQuery = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class CancelledFioRequestsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getCancelledFioRequests}`;
        this.isEncrypted = true;
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
    decrypt(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (result.requests.length > 0) {
                    try {
                        const requests = yield Promise.allSettled(result.requests.map((value) => __awaiter(this, void 0, void 0, function* () {
                            const encryptPublicKeysArray = [];
                            let encryptPrivateKeysArray = [];
                            const { payer_fio_address, payer_fio_public_key } = value || {};
                            try {
                                const unCipherEncryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    fioAddress: payer_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'CancelledFioRequests',
                                });
                                if (unCipherEncryptKey) {
                                    encryptPublicKeysArray.push(unCipherEncryptKey);
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
                                            unCipherContent = this.getUnCipherContent('new_funds_content', value.content, privateKey, publicKey);
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
                                    throw new Error(`CancelledFioRequests: Get UnCipher Content for account ${account} failed.`);
                                }
                                return Object.assign(Object.assign({}, value), { content });
                            }
                            catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                                throw error;
                            }
                        })));
                        const fulfilledRequests = [];
                        requests.forEach((req) => req.status === 'fulfilled' && fulfilledRequests.push(req.value));
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
exports.CancelledFioRequestsQuery = CancelledFioRequestsQuery;
//# sourceMappingURL=CancelledFioRequestsQuery.js.map