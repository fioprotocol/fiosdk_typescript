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
exports.getEncryptKeyForUnCipherContent = exports.asyncWaterfall = void 0;
const abort_controller_1 = require("abort-controller");
const DEFAULT_REQUEST_TIMEOUT = 60000;
function asyncWaterfall({ asyncFuncs, requestTimeout = DEFAULT_REQUEST_TIMEOUT, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeoutIds = [];
        try {
            for (let i = 0; i < asyncFuncs.length; i++) {
                const func = asyncFuncs[i];
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
                    if (i === asyncFuncs.length - 1) {
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
exports.asyncWaterfall = asyncWaterfall;
function getEncryptKeyForUnCipherContent({ getEncryptKey, method = '', fioAddress, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let encryptKey = null;
        if (fioAddress) {
            try {
                const encryptKeyRes = yield getEncryptKey(fioAddress);
                if (encryptKeyRes && encryptKeyRes.encrypt_public_key) {
                    encryptKey = encryptKeyRes.encrypt_public_key;
                }
            }
            catch (error) {
                console.warn(`${method}: Get Encrypt Key fio_address ${fioAddress} failed.`);
                // Skip if getEncryptKey fails and continue with the publicKey
            }
        }
        return encryptKey;
    });
}
exports.getEncryptKeyForUnCipherContent = getEncryptKeyForUnCipherContent;
