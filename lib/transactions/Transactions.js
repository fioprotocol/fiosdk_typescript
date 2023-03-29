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
exports.Transactions = exports.FioError = exports.FIO_BLOCK_NUMBER_ERROR_CODE = exports.FIO_CHAIN_INFO_ERROR_CODE = exports.fioApiErrorCodes = exports.signAllAuthorityProvider = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const chain_jssig_1 = require("@fioprotocol/fiojs/dist/chain-jssig");
const chain_numeric_1 = require("@fioprotocol/fiojs/dist/chain-numeric");
const text_encoding_1 = require("text-encoding");
const Autorization_1 = require("../entities/Autorization");
const RawAction_1 = require("../entities/RawAction");
const RawTransaction_1 = require("../entities/RawTransaction");
const ValidationError_1 = require("../entities/ValidationError");
const validation_1 = require("../utils/validation");
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
const defaultTextEncoder = new text_encoding_1.TextEncoder();
const defaultTextDecoder = new text_encoding_1.TextDecoder();
exports.signAllAuthorityProvider = {
    getRequiredKeys(authorityProviderArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { availableKeys } = authorityProviderArgs;
            return availableKeys;
        });
    },
};
exports.fioApiErrorCodes = [400, 403, 404, 409];
exports.FIO_CHAIN_INFO_ERROR_CODE = 800;
exports.FIO_BLOCK_NUMBER_ERROR_CODE = 801;
class FioError extends Error {
    constructor(message, code, labelCode, json) {
        super(message);
        this.list = [];
        this.labelCode = '';
        this.errorCode = 0;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FioError);
        }
        this.name = 'FioError';
        if (code) {
            this.errorCode = code;
        }
        if (labelCode) {
            this.labelCode = labelCode;
        }
        if (json) {
            this.json = json;
        }
    }
}
exports.FioError = FioError;
class Transactions {
    constructor() {
        this.publicKey = '';
        this.privateKey = '';
        this.serilizeEndpoint = 'chain/serialize_json';
        this.validationData = {};
        this.validationRules = null;
        this.expirationOffset = constants_1.Constants.defaultExpirationOffset;
    }
    getActor(publicKey = '') {
        return Transactions.FioProvider.accountHash((publicKey === '' || !publicKey) ? this.publicKey : publicKey);
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
            return yield this.multicastServers('chain/get_info', null, options);
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
            return yield this.multicastServers('chain/get_block', null, {
                body: JSON.stringify({
                    block_num_or_id: chain.last_irreversible_block_num,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
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
                expiration: expirationStr.substr(0, expirationStr.length - 1),
                // tslint:disable-next-line:no-bitwise
                ref_block_num: block.block_num & 0xFFFF,
                ref_block_prefix: block.ref_block_prefix,
            };
        });
    }
    setRawTransactionExp(rawTransaction, chainData) {
        rawTransaction.ref_block_num = chainData.ref_block_num;
        rawTransaction.ref_block_prefix = chainData.ref_block_prefix;
        rawTransaction.expiration = chainData.expiration;
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
    initFioJsApi({ chainId, abiMap, textDecoder = defaultTextDecoder, textEncoder = defaultTextEncoder, privateKeys, }) {
        return new fiojs_1.Api({
            abiProvider: this.generateApiProvider(abiMap),
            authorityProvider: exports.signAllAuthorityProvider,
            chainId,
            signatureProvider: new chain_jssig_1.JsSignatureProvider(privateKeys),
            textDecoder,
            textEncoder,
        });
    }
    createRawTransaction({ account, action, data, publicKey, chainData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawTransaction = new RawTransaction_1.RawTransaction();
            const rawaction = new RawAction_1.RawAction();
            rawaction.account = account;
            const actor = yield this.getActor(publicKey);
            if (!data.actor) {
                data.actor = actor;
            }
            rawaction.authorization.push(new Autorization_1.Autorization(data.actor, data.permission));
            rawaction.account = account;
            rawaction.name = action;
            rawaction.data = data;
            rawTransaction.actions.push(rawaction);
            if (chainData && chainData.ref_block_num) {
                this.setRawTransactionExp(rawTransaction, chainData);
            }
            return rawTransaction;
        });
    }
    serialize({ chainId, abiMap = Transactions.abiMap, transaction, textDecoder = defaultTextDecoder, textEncoder = defaultTextEncoder, }) {
        return __awaiter(this, void 0, void 0, function* () {
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
    deserialize({ chainId, abiMap = Transactions.abiMap, serializedTransaction, textDecoder = defaultTextDecoder, textEncoder = defaultTextEncoder, }) {
        return __awaiter(this, void 0, void 0, function* () {
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
    sign({ abiMap = Transactions.abiMap, chainId, privateKeys, transaction, serializedTransaction, serializedContextFreeData, }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const privky = new Array();
            privky.push(this.privateKey);
            const chainData = yield this.getChainDataForTx();
            this.setRawTransactionExp(transaction, chainData);
            if (dryRun) {
                return Transactions.FioProvider.prepareTransaction({
                    abiMap: Transactions.abiMap,
                    chainId: chainData.chain_id,
                    privateKeys: privky,
                    textDecoder: new text_encoding_1.TextDecoder(),
                    textEncoder: new text_encoding_1.TextEncoder(),
                    transaction,
                });
            }
            else {
                const signedTransaction = yield Transactions.FioProvider.prepareTransaction({
                    abiMap: Transactions.abiMap,
                    chainId: chainData.chain_id,
                    privateKeys: privky,
                    textDecoder: new text_encoding_1.TextDecoder(),
                    textEncoder: new text_encoding_1.TextEncoder(),
                    transaction,
                });
                return this.multicastServers(endpoint, JSON.stringify(signedTransaction));
            }
        });
    }
    executeCall(baseUrl, endPoint, body, fetchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
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
            try {
                const res = yield Transactions.fetchJson(baseUrl + endPoint, options);
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
                    const error = new Error(`Error ${res.status} while fetching ${baseUrl + endPoint}`);
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
                                    message: error.message,
                                    json: error.json,
                                },
                                isError: true,
                            };
                        }
                    }
                    catch (e) {
                        // tslint:disable-next-line:no-console
                        console.log(e);
                        error.json = {};
                    }
                    error.errorCode = res.status;
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
    multicastServers(endpoint, body, fetchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, utils_1.asyncWaterfall)((0, utils_1.shuffleArray)(Transactions.baseUrls.map((apiUrl) => () => this.executeCall(apiUrl, endpoint, body, fetchOptions))));
            if (res.isError) {
                const error = new FioError(res.errorMessage || res.data.message);
                error.json = res.data.json;
                error.list = res.data.list;
                error.errorCode = res.data.code;
                throw error;
            }
            return res;
        });
    }
    getCipherContent(contentType, content, privateKey, publicKey) {
        const cipher = fiojs_1.Fio.createSharedCipher({
            privateKey,
            publicKey,
            textDecoder: defaultTextDecoder,
            textEncoder: defaultTextEncoder,
        });
        return cipher.encrypt(contentType, content);
    }
    getUnCipherContent(contentType, content, privateKey, publicKey) {
        const cipher = fiojs_1.Fio.createSharedCipher({
            privateKey,
            publicKey,
            textDecoder: defaultTextDecoder,
            textEncoder: defaultTextEncoder,
        });
        return cipher.decrypt(contentType, content);
    }
    validate() {
        if (this.validationRules) {
            const validation = (0, validation_1.validate)(this.validationData, this.validationRules);
            if (!validation.isValid) {
                throw new ValidationError_1.ValidationError(validation.errors, `Validation error`);
            }
        }
    }
}
exports.Transactions = Transactions;
Transactions.abiMap = new Map();
