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
exports.getUnCipherContent = exports.getCipherContent = exports.defaultTextDecoder = exports.defaultTextEncoder = exports.createRawRequest = exports.createRawAction = exports.createAuthorization = exports.resolveOptions = exports.cleanupObject = void 0;
exports.asyncWaterfall = asyncWaterfall;
exports.getEncryptKeyForUnCipherContent = getEncryptKeyForUnCipherContent;
const fiojs_1 = require("@fioprotocol/fiojs");
const abort_controller_1 = require("abort-controller");
const text_encoding_1 = require("text-encoding");
const DEFAULT_REQUEST_TIMEOUT = 60000;
function asyncWaterfall(_a) {
    return __awaiter(this, arguments, void 0, function* ({ asyncFunctions, requestTimeout = DEFAULT_REQUEST_TIMEOUT, }) {
        const timeoutIds = [];
        try {
            for (let i = 0; i < asyncFunctions.length; i++) {
                const func = asyncFunctions[i];
                const abortController = new abort_controller_1.default();
                let timeoutId;
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => {
                        abortController.abort();
                        reject(new Error('request_timeout'));
                    }, requestTimeout);
                    timeoutIds.push(timeoutId);
                });
                try {
                    const result = yield Promise.race([func(abortController.signal), timeoutPromise]);
                    clearTimeout(timeoutId);
                    if (result.isError) {
                        throw result.data;
                    }
                    if (result !== undefined) {
                        return result;
                    }
                }
                catch (error) {
                    clearTimeout(timeoutId);
                    if (i === asyncFunctions.length - 1) {
                        throw error;
                    }
                }
            }
        }
        finally {
            timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
        }
    });
}
function getEncryptKeyForUnCipherContent(_a) {
    return __awaiter(this, arguments, void 0, function* ({ getEncryptKey, method = '', fioAddress, }) {
        let encryptKey = null;
        if (fioAddress) {
            try {
                const encryptKeyRes = yield getEncryptKey(fioAddress);
                if (encryptKeyRes && encryptKeyRes.encrypt_public_key) {
                    encryptKey = encryptKeyRes.encrypt_public_key;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.warn(`${method}: Get Encrypt Key fio_address ${fioAddress} failed.`);
                // Skip if getEncryptKey fails and continue with the publicKey
            }
        }
        return encryptKey;
    });
}
const cleanupObject = (obj) => {
    const result = Object.assign({}, obj);
    Object.keys(result).forEach((key) => {
        if (result[key] === null || result[key] === undefined) {
            delete result[key];
        }
    });
    return result;
};
exports.cleanupObject = cleanupObject;
const resolveOptions = (options) => {
    if (options.arguments.length === 0) {
        return {};
    }
    if (options.arguments.length === 1
        && typeof options.arguments[0] === 'object'
        && typeof options.arguments[0] !== null
        && !Array.isArray(options.arguments[0])) {
        return (0, exports.cleanupObject)(options.arguments[0]);
    }
    let result = {};
    for (const key of options.keys) {
        const i = options.keys.indexOf(key);
        if (key === '$base') {
            const base = options.arguments[i];
            if (!base) {
                continue;
            }
            if (typeof base !== 'object' || Array.isArray(base)) {
                throw new Error('Not supported base field');
            }
            result = Object.assign(Object.assign({}, result), options.arguments[i]);
        }
        else {
            result[key] = options.arguments[i];
        }
    }
    return (0, exports.cleanupObject)(result);
};
exports.resolveOptions = resolveOptions;
const createAuthorization = (actor, permission = 'active') => ({
    actor,
    permission,
});
exports.createAuthorization = createAuthorization;
const createRawAction = (data) => {
    var _a;
    return ({
        account: data.account,
        actor: data.actor,
        authorization: (_a = data.authorization) !== null && _a !== void 0 ? _a : [],
        data: data.data,
        name: data.name,
    });
};
exports.createRawAction = createRawAction;
const createRawRequest = (data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return ({
        actions: (_a = data.actions) !== null && _a !== void 0 ? _a : [],
        context_free_actions: (_b = data.context_free_actions) !== null && _b !== void 0 ? _b : [],
        delay_sec: (_c = data.delay_sec) !== null && _c !== void 0 ? _c : 0,
        expiration: (_d = data.expiration) !== null && _d !== void 0 ? _d : '',
        max_cpu_usage_ms: (_e = data.max_cpu_usage_ms) !== null && _e !== void 0 ? _e : 0,
        max_net_usage_words: (_f = data.max_net_usage_words) !== null && _f !== void 0 ? _f : 0,
        ref_block_num: (_g = data.ref_block_num) !== null && _g !== void 0 ? _g : 0,
        ref_block_prefix: (_h = data.ref_block_prefix) !== null && _h !== void 0 ? _h : 0,
        transaction_extensions: (_j = data.transaction_extensions) !== null && _j !== void 0 ? _j : [],
    });
};
exports.createRawRequest = createRawRequest;
exports.defaultTextEncoder = new text_encoding_1.TextEncoder();
exports.defaultTextDecoder = new text_encoding_1.TextDecoder();
const getCipherContent = (contentType, content, privateKey, publicKey) => {
    const cipher = fiojs_1.Fio.createSharedCipher({
        privateKey,
        publicKey,
        textDecoder: exports.defaultTextDecoder,
        textEncoder: exports.defaultTextEncoder,
    });
    return cipher.encrypt(contentType, content);
};
exports.getCipherContent = getCipherContent;
const getUnCipherContent = (contentType, content, privateKey, publicKey) => {
    const cipher = fiojs_1.Fio.createSharedCipher({
        privateKey,
        publicKey,
        textDecoder: exports.defaultTextDecoder,
        textEncoder: exports.defaultTextEncoder,
    });
    return cipher.decrypt(contentType, content);
};
exports.getUnCipherContent = getUnCipherContent;
//# sourceMappingURL=utils.js.map