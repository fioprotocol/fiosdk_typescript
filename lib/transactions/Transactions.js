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
exports.Transactions = exports.FioError = exports.FIO_BLOCK_NUMBER_ERROR_CODE = exports.FIO_CHAIN_INFO_ERROR_CODE = exports.fioApiErrorCodes = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const text_encoding_1 = require("text-encoding");
const ValidationError_1 = require("../entities/ValidationError");
const validation_1 = require("../utils/validation");
const utils_1 = require("../utils/utils");
const textEncoder = new text_encoding_1.TextEncoder();
const textDecoder = new text_encoding_1.TextDecoder();
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
        if (code)
            this.errorCode = code;
        if (labelCode)
            this.labelCode = labelCode;
        if (json)
            this.json = json;
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
    }
    getActor(publicKey = '') {
        const actor = Transactions.FioProvider.accountHash((publicKey == '') ? this.publicKey : publicKey);
        return actor;
    }
    getChainInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            return yield this.multicastServers('chain/get_info', null, options);
        });
    }
    getBlock(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chain == undefined) {
                throw new Error('chain undefined');
            }
            if (chain.last_irreversible_block_num == undefined) {
                throw new Error('chain.last_irreversible_block_num undefined');
            }
            return yield this.multicastServers('chain/get_block', null, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    block_num_or_id: chain.last_irreversible_block_num,
                }),
            });
        });
    }
    pushToServer(transaction, endpoint, dryRun) {
        return __awaiter(this, void 0, void 0, function* () {
            const privky = new Array();
            privky.push(this.privateKey);
            let chain, block;
            try {
                chain = yield this.getChainInfo();
            }
            catch (error) {
                console.error('chain:: ' + error);
                const e = new Error(`Error while fetching chain info`);
                e.errorCode = exports.FIO_CHAIN_INFO_ERROR_CODE;
                throw e;
            }
            try {
                block = yield this.getBlock(chain);
            }
            catch (error) {
                console.error('block: ' + error);
                const e = new Error(`Error while fetching block`);
                e.errorCode = exports.FIO_BLOCK_NUMBER_ERROR_CODE;
                throw e;
            }
            transaction.ref_block_num = block.block_num & 0xFFFF;
            transaction.ref_block_prefix = block.ref_block_prefix;
            const expiration = new Date(chain.head_block_time + 'Z');
            expiration.setSeconds(expiration.getSeconds() + 180);
            const expirationStr = expiration.toISOString();
            transaction.expiration = expirationStr.substr(0, expirationStr.length - 1);
            if (dryRun) {
                return Transactions.FioProvider.prepareTransaction({
                    transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                    textDecoder: new text_encoding_1.TextDecoder(), textEncoder: new text_encoding_1.TextEncoder(),
                });
            }
            else {
                const signedTransaction = yield Transactions.FioProvider.prepareTransaction({
                    transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                    textDecoder: new text_encoding_1.TextDecoder(), textEncoder: new text_encoding_1.TextEncoder(),
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
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body,
                };
            }
            try {
                const res = yield Transactions.fetchJson(baseUrl + endPoint, options);
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
                                isError: true,
                                data: {
                                    code: error.errorCode,
                                    message: error.message,
                                    json: error.json
                                }
                            };
                        }
                    }
                    catch (e) {
                        console.log(e);
                        error.json = {};
                    }
                    error.errorCode = res.status;
                    throw error;
                }
                return res.json();
            }
            catch (e) {
                e.requestParams = { baseUrl, endPoint, body, fetchOptions };
                throw e;
            }
        });
    }
    multicastServers(endpoint, body, fetchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield utils_1.asyncWaterfall(utils_1.shuffleArray(Transactions.baseUrls.map(apiUrl => () => this.executeCall(apiUrl, endpoint, body, fetchOptions))));
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
        const cipher = fiojs_1.Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder });
        return cipher.encrypt(contentType, content);
    }
    getUnCipherContent(contentType, content, privateKey, publicKey) {
        const cipher = fiojs_1.Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder });
        return cipher.decrypt(contentType, content);
    }
    validate() {
        if (this.validationRules) {
            const validation = validation_1.validate(this.validationData, this.validationRules);
            if (!validation.isValid) {
                throw new ValidationError_1.ValidationError(validation.errors, `Validation error`);
            }
        }
    }
}
exports.Transactions = Transactions;
Transactions.abiMap = new Map();
