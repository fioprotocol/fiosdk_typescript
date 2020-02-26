"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema = require('validate');
exports.allRules = {
    chain: {
        required: true,
        type: String,
        length: { min: 1, max: 10 },
        match: /^[a-z0-9]+$/i
    },
    fioAddress: {
        required: true,
        type: String,
        length: { min: 3, max: 64 },
        match: /^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)/i
    },
    tpid: {
        type: String,
        length: { min: 3, max: 64 },
        match: /^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)/i
    },
    fioDomain: {
        required: true,
        type: String,
        length: { min: 1, max: 62 },
        match: /^[a-z0-9\-]+$/i
    },
    fioPublicKey: {
        required: true,
        type: String,
        length: { min: 1, max: 62 },
        match: /^FIO\w+$/
    },
    nativeBlockchainPublicAddress: {
        required: true,
        type: String,
        length: { min: 1, max: 128 },
        match: /^\w+$/
    },
};
exports.validationRules = {
    addPublicAddressRules: {
        fioAddress: exports.allRules.fioAddress,
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
    newFundsRequest: {
        payerFioAddress: exports.allRules.fioAddress,
        payeeFioAddress: exports.allRules.fioAddress,
        tokenCode: exports.allRules.chain,
        tpid: exports.allRules.tpid,
    },
    rejectFunds: {
        tpid: exports.allRules.tpid,
    },
    recordObtData: {
        payerFioAddress: exports.allRules.fioAddress,
        payeeFioAddress: exports.allRules.fioAddress,
        tpid: exports.allRules.tpid,
        tokenCode: exports.allRules.chain,
    },
    transferTokens: {
        tpid: exports.allRules.tpid,
    },
    getFee: {
        fioAddress: exports.allRules.fioAddress,
    },
};
function validate(data, rules) {
    const validator = new Schema(rules);
    const errors = validator.validate(data);
    const validationResult = { isValid: true, errors: [] };
    if (errors.length) {
        validationResult.isValid = false;
        validationResult.errors = errors.map(err => ({ field: err.path, message: err.message }));
    }
    return validationResult;
}
exports.validate = validate;
