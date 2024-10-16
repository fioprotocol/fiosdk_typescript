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
exports.PendingFioRequestsQuery = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../../utils/utils");
const Query_1 = require("./Query");
class PendingFioRequestsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getPendingFioRequests}`;
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
                            const account = this.getActor();
                            const encryptPublicKeysArray = this.publicKey ? [this.publicKey] : [];
                            const encryptPrivateKeysArray = this.privateKey ? [this.privateKey] : [];
                            const accountPrivateKeys = (0, utils_1.getAccountPrivateKeys)(account, this.props.encryptKeys);
                            if (accountPrivateKeys.length > 0) {
                                encryptPrivateKeysArray.push(...accountPrivateKeys);
                            }
                            const { payee_fio_address, payee_fio_public_key } = value || {};
                            try {
                                const unCipherEncryptKey = yield (0, utils_1.getEncryptKeyForUnCipherContent)({
                                    fioAddress: payee_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'PendingFioRequests',
                                });
                                if (unCipherEncryptKey) {
                                    encryptPublicKeysArray.push(unCipherEncryptKey);
                                }
                            }
                            catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                            }
                            if (payee_fio_public_key) {
                                encryptPublicKeysArray.push(payee_fio_public_key);
                            }
                            const content = (0, utils_1.getDecryptedContent)(entities_1.ContentType.newFundsContent, value.content, encryptPublicKeysArray, encryptPrivateKeysArray);
                            if (content === null) {
                                // Throw an error if all keys failed
                                throw new Error(`PendingFioRequests: Get UnCipher Content for account ${account} failed.`);
                            }
                            return Object.assign(Object.assign({}, value), { content });
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
exports.PendingFioRequestsQuery = PendingFioRequestsQuery;
//# sourceMappingURL=PendingFioRequestsQuery.js.map