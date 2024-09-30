"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRules = exports.allRules = void 0;
exports.validate = validate;
const fiojs_1 = require("@fioprotocol/fiojs");
const validate_1 = __importDefault(require("validate"));
const testNativePublicKey = (key) => fiojs_1.Ecc.PublicKey.isValid(key);
const testFioPublicKey = (key) => key.startsWith('FIO') && fiojs_1.Ecc.PublicKey.isValid(key);
exports.allRules = {
    chain: {
        length: { min: 1, max: 10 },
        match: /^[a-z0-9]+$/i,
        required: true,
        type: String,
    },
    fioAddress: {
        length: { min: 3, max: 64 },
        match: /^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/gim,
        required: true,
        type: String,
    },
    fioDomain: {
        length: { min: 1, max: 62 },
        match: /^[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/i,
        required: true,
        type: String,
    },
    fioPublicKey: {
        length: { min: 1, max: 62 },
        required: true,
        type: String,
        use: { testFioPublicKey },
    },
    nativeBlockchainPublicAddress: {
        length: { min: 1, max: 128 },
        required: true,
        type: String,
        use: { testNativePublicKey },
    },
    tpid: {
        length: { min: 3, max: 64 },
        match: /^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/gim,
        type: String,
    },
};
exports.validationRules = {
    addPublicAddressRules: {
        fioAddress: exports.allRules.fioAddress,
        tpid: exports.allRules.tpid,
    },
    cancelFundsRequestRules: {
        tpid: exports.allRules.tpid,
    },
    getFee: {
        fioAddress: exports.allRules.fioAddress,
    },
    newFundsRequest: {
        payeeFioAddress: exports.allRules.fioAddress,
        payerFioAddress: exports.allRules.fioAddress,
        tokenCode: exports.allRules.chain,
        tpid: exports.allRules.tpid,
    },
    recordObtData: {
        payeeFioAddress: exports.allRules.fioAddress,
        payerFioAddress: exports.allRules.fioAddress,
        tokenCode: exports.allRules.chain,
        tpid: exports.allRules.tpid,
    },
    registerFioAddress: {
        fioAddress: exports.allRules.fioAddress,
        tpid: exports.allRules.tpid,
    },
    registerFioDomain: {
        fioDomain: exports.allRules.fioDomain,
        tpid: exports.allRules.tpid,
    },
    registerFioDomainAddress: {
        fioAddress: exports.allRules.fioAddress,
        tpid: exports.allRules.tpid,
    },
    rejectFunds: {
        tpid: exports.allRules.tpid,
    },
    renewFioAddress: {
        fioAddress: exports.allRules.fioAddress,
        tpid: exports.allRules.tpid,
    },
    renewFioDomain: {
        fioDomain: exports.allRules.fioDomain,
        tpid: exports.allRules.tpid,
    },
    setFioDomainVisibility: {
        fioDomain: exports.allRules.fioDomain,
        tpid: exports.allRules.tpid,
    },
    transferLockedTokensRequest: {
        tpid: exports.allRules.tpid,
    },
    transferTokens: {
        tpid: exports.allRules.tpid,
    },
};
function validate(data, rules) {
    const schema = {};
    // ATTENTION! Don't change this code. This code fix error when regexp rules not working correctly if used directly
    Object.keys(rules).forEach((ruleKey) => {
        schema[ruleKey] = Object.assign({}, rules[ruleKey]);
        const match = rules[ruleKey].match;
        if (match) {
            schema[ruleKey].match = new RegExp(match.source, match.flags);
        }
    });
    const validator = new validate_1.default(schema);
    const errors = validator.validate(data);
    const validationResult = { isValid: true, errors: [] };
    if (errors.length) {
        validationResult.isValid = false;
        validationResult.errors = errors.map((err) => ({
            field: err.path,
            message: ('message' in err && typeof err.message === 'string') ? err.message : '',
        }));
    }
    return validationResult;
}
//# sourceMappingURL=validation.js.map