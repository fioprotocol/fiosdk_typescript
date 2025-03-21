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
exports.Transactions = exports.FIO_BLOCK_NUMBER_ERROR_CODE = exports.FIO_CHAIN_INFO_ERROR_CODE = exports.fioApiErrorCodes = exports.signAllAuthorityProvider = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const chain_jssig_1 = require("@fioprotocol/fiojs/dist/chain-jssig");
const chain_numeric_1 = require("@fioprotocol/fiojs/dist/chain-numeric");
const text_encoding_1 = require("text-encoding");
const entities_1 = require("../entities");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
const validation_1 = require("../utils/validation");
exports.signAllAuthorityProvider = {
    getRequiredKeys(authorityProviderArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { availableKeys } = authorityProviderArgs;
            return availableKeys;
        });
    },
};
exports.fioApiErrorCodes = [constants_1.API_ERROR_CODES.BAD_REQUEST, constants_1.API_ERROR_CODES.FORBIDDEN, constants_1.API_ERROR_CODES.NOT_FOUND, constants_1.API_ERROR_CODES.CONFLICT];
exports.FIO_CHAIN_INFO_ERROR_CODE = 800;
exports.FIO_BLOCK_NUMBER_ERROR_CODE = 801;
class Transactions {
    constructor(config) {
        this.config = config;
        this.publicKey = '';
        this.privateKey = '';
        this.validationData = {};
        this.validationRules = null;
        this.expirationOffset = constants_1.defaultExpirationOffset;
    }
    getActor(publicKey = '') {
        return this.config.fioProvider.accountHash((publicKey === '' || !publicKey) ? this.publicKey : publicKey);
    }
    getChainInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            };
            return yield this.multicastServers({ endpoint: `chain/${entities_1.EndPoint.getInfo}`, fetchOptions: options });
        });
    }
    getBlock(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chain === undefined || !chain) {
                throw new Error('chain undefined');
            }
            if (chain.last_irreversible_block_num === undefined) {
                throw new Error('chain.last_irreversible_block_num undefined');
            }
            return yield this.multicastServers({
                endpoint: `chain/${entities_1.EndPoint.getBlock}`, fetchOptions: {
                    body: JSON.stringify({
                        block_num_or_id: chain.last_irreversible_block_num,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                },
            });
        });
    }
    getChainDataForTx() {
        return __awaiter(this, void 0, void 0, function* () {
            let chain;
            let block;
            try {
                chain = yield this.getChainInfo();
            }
            catch (error) {
                if (error.name === 'ValidationError') {
                    throw error;
                }
                // tslint:disable-next-line:no-console
                console.error('chain:: ' + error);
                const e = new Error(`Error while fetching chain info`);
                e.errorCode = exports.FIO_CHAIN_INFO_ERROR_CODE;
                throw e;
            }
            try {
                block = yield this.getBlock(chain);
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('block: ' + error);
                const e = new Error(`Error while fetching block`);
                e.errorCode = exports.FIO_BLOCK_NUMBER_ERROR_CODE;
                throw e;
            }
            const expiration = new Date(chain.head_block_time + 'Z');
            expiration.setSeconds(expiration.getSeconds() + this.expirationOffset);
            const expirationStr = expiration.toISOString();
            return {
                chain_id: chain.chain_id,
                expiration: expirationStr.substring(0, expirationStr.length - 1),
                // tslint:disable-next-line:no-bitwise
                ref_block_num: block.block_num & 0xFFFF,
                ref_block_prefix: block.ref_block_prefix,
            };
        });
    }
    setRawRequestExp(rawRequest, chainData) {
        rawRequest.ref_block_num = chainData.ref_block_num;
        rawRequest.ref_block_prefix = chainData.ref_block_prefix;
        rawRequest.expiration = chainData.expiration;
    }
    generateApiProvider(abiMap) {
        return {
            getRawAbi(accountName) {
                return __awaiter(this, void 0, void 0, function* () {
                    const rawAbi = abiMap.get(accountName);
                    if (!rawAbi) {
                        throw new Error(`Missing ABI for account ${accountName}`);
                    }
                    const abi = (0, chain_numeric_1.base64ToBinary)(rawAbi.abi);
                    const binaryAbi = { accountName: rawAbi.account_name, abi };
                    return binaryAbi;
                });
            },
        };
    }
    initFioJsApi({ chainId, abiMap, textDecoder = utils_1.defaultTextDecoder, textEncoder = utils_1.defaultTextEncoder, privateKeys, }) {
        return new fiojs_1.Api({
            abiProvider: this.generateApiProvider(abiMap),
            authorityProvider: exports.signAllAuthorityProvider,
            chainId,
            signatureProvider: new chain_jssig_1.JsSignatureProvider(privateKeys),
            textDecoder,
            textEncoder,
        });
    }
    createRawTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ account, action, authPermission, data, publicKey, chainData, signingAccount }) {
            const actor = this.getActor(publicKey);
            if (!data.actor) {
                data.actor = actor;
            }
            const rawTransaction = (0, utils_1.createRawRequest)({
                actions: [
                    (0, utils_1.createRawAction)({
                        account,
                        actor: signingAccount,
                        authorization: [(0, utils_1.createAuthorization)(data.actor, authPermission)],
                        data,
                        name: action,
                    }),
                ],
            });
            if (chainData && chainData.ref_block_num) {
                this.setRawRequestExp(rawTransaction, chainData);
            }
            return rawTransaction;
        });
    }
    serialize(_a) {
        return __awaiter(this, arguments, void 0, function* ({ chainId, abiMap = Transactions.abiMap, transaction, textDecoder = utils_1.defaultTextDecoder, textEncoder = utils_1.defaultTextEncoder, }) {
            const api = this.initFioJsApi({
                abiMap,
                chainId,
                privateKeys: [],
                textDecoder,
                textEncoder,
            });
            return yield api.transact(transaction, { sign: false });
        });
    }
    deserialize(_a) {
        return __awaiter(this, arguments, void 0, function* ({ chainId, abiMap = Transactions.abiMap, serializedTransaction, textDecoder = utils_1.defaultTextDecoder, textEncoder = utils_1.defaultTextEncoder, }) {
            const api = this.initFioJsApi({
                abiMap,
                chainId,
                privateKeys: [],
                textDecoder,
                textEncoder,
            });
            return yield api.deserializeTransactionWithActions(serializedTransaction);
        });
    }
    sign(_a) {
        return __awaiter(this, arguments, void 0, function* ({ abiMap = Transactions.abiMap, chainId, privateKeys, transaction, serializedTransaction, serializedContextFreeData, }) {
            const signatureProvider = new chain_jssig_1.JsSignatureProvider(privateKeys);
            const availableKeys = yield signatureProvider.getAvailableKeys();
            const requiredKeys = yield exports.signAllAuthorityProvider.getRequiredKeys({ transaction, availableKeys });
            const api = this.initFioJsApi({
                abiMap,
                chainId,
                privateKeys,
            });
            const abis = yield api.getTransactionAbis(transaction);
            const signedTx = yield signatureProvider.sign({
                abis,
                chainId,
                requiredKeys,
                serializedContextFreeData,
                serializedTransaction,
            });
            return {
                compression: 0,
                packed_context_free_data: (0, chain_numeric_1.arrayToHex)(signedTx.serializedContextFreeData || new Uint8Array(0)),
                packed_trx: (0, chain_numeric_1.arrayToHex)(signedTx.serializedTransaction),
                signatures: signedTx.signatures,
            };
        });
    }
    pushToServer(transaction, endpoint, dryRun) {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKeys = [];
            privateKeys.push(this.privateKey);
            const chainData = yield this.getChainDataForTx();
            this.setRawRequestExp(transaction, chainData);
            const signedTransaction = yield this.config.fioProvider.prepareTransaction({
                abiMap: Transactions.abiMap,
                chainId: chainData.chain_id,
                privateKeys,
                textDecoder: new text_encoding_1.TextDecoder(),
                textEncoder: new text_encoding_1.TextEncoder(),
                transaction,
            });
            if (dryRun) {
                return signedTransaction;
            }
            return this.multicastServers({ endpoint, body: JSON.stringify(signedTransaction) });
        });
    }
    executeCall(_a) {
        return __awaiter(this, arguments, void 0, function* ({ baseUrl, endPoint, body, fetchOptions, signal, }) {
            var _b, _c;
            let options;
            this.validate();
            if (fetchOptions != null) {
                options = fetchOptions;
                if (body != null) {
                    options.body = body;
                }
            }
            else {
                options = {
                    body,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                };
            }
            options.signal = signal;
            try {
                const res = yield this.config.fetchJson(baseUrl + endPoint, options);
                if (res === undefined) {
                    const error = new Error(`Error: Can't reach the site ${baseUrl}${endPoint}. Possible wrong url.`);
                    return {
                        data: {
                            code: 500,
                            message: error.message,
                        },
                        isError: true,
                    };
                }
                if (!res.ok) {
                    const error = new entities_1.ExecuteCallError(`Error ${res.status} while fetching ${baseUrl + endPoint}`, res.status);
                    try {
                        error.json = yield res.json();
                        if (exports.fioApiErrorCodes.indexOf(res.status) > -1) {
                            if (error.json &&
                                error.json.fields &&
                                error.json.fields[0] &&
                                error.json.fields[0].error) {
                                error.message = error.json.fields[0].error;
                            }
                            return {
                                data: {
                                    code: error.errorCode || res.status,
                                    json: error.json,
                                    message: error.message,
                                },
                                isError: true,
                            };
                        }
                    }
                    catch (e) {
                        error.json = {};
                        (_c = (_b = this.config).logger) === null || _c === void 0 ? void 0 : _c.call(_b, {
                            context: {
                                endpoint: endPoint,
                                error,
                            },
                            type: 'execute',
                        });
                    }
                    throw error;
                }
                return res.json();
            }
            catch (e) {
                // @ts-ignore
                e.requestParams = { baseUrl, endPoint, body, fetchOptions };
                throw e;
            }
        });
    }
    multicastServers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { endpoint, body, fetchOptions, requestTimeout } = req;
            const res = yield (0, utils_1.asyncWaterfall)({
                asyncFunctions: this.config.baseUrls.map((apiUrl) => (signal) => this.executeCall({ baseUrl: apiUrl, endPoint: endpoint, body, fetchOptions, signal })),
                requestTimeout,
                baseUrls: this.config.baseUrls,
            });
            // TODO asyncWaterfall can throw errors and error interface can be different
            if (res === null || res === void 0 ? void 0 : res.isError) {
                const error = new entities_1.FioError(res.errorMessage || res.data.message);
                error.json = res.data.json;
                error.list = res.data.list;
                error.errorCode = res.data.code;
                (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, { type: 'request', context: Object.assign(Object.assign({}, req), { error }) });
                throw error;
            }
            (_d = (_c = this.config).logger) === null || _d === void 0 ? void 0 : _d.call(_c, { type: 'request', context: Object.assign(Object.assign({}, req), { res }) });
            return res;
        });
    }
    getCipherContent(contentType, content, privateKey, publicKey) {
        return (0, utils_1.getCipherContent)(contentType, content, privateKey, publicKey);
    }
    getUnCipherContent(contentType, content, privateKey, publicKey) {
        return (0, utils_1.getUnCipherContent)(contentType, content, privateKey, publicKey);
    }
    validate() {
        if (this.validationRules) {
            const validation = (0, validation_1.validate)(this.validationData, this.validationRules);
            if (!validation.isValid) {
                throw new entities_1.ValidationError(validation.errors, `Validation error`);
            }
        }
    }
}
exports.Transactions = Transactions;
Transactions.abiMap = new Map();
//# sourceMappingURL=Transactions.js.map