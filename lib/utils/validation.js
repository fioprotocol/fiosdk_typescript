"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validationRules = exports.allRules = void 0;
const Schema = require('validate');
exports.allRules = {
    chain: {
        required: true,
        type: String,
        length: { min: 1, max: 10 },
        matchParams: {
            regex: '^[a-z0-9]+$',
            opt: 'i'
        }
    },
    fioAddress: {
        required: true,
        type: String,
        length: { min: 3, max: 64 },
        matchParams: {
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+$)',
            opt: 'gim'
        }
    },
    tpid: {
        type: String,
        length: { min: 3, max: 64 },
        matchParams: {
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+$)',
            opt: 'gim'
        }
    },
    fioDomain: {
        required: true,
        type: String,
        length: { min: 1, max: 62 },
        matchParams: {
            regex: '^[a-z0-9\\-]+$',
            opt: 'i'
        }
    },
    fioPublicKey: {
        required: true,
        type: String,
        length: { min: 1, max: 62 },
        matchParams: {
            regex: '^FIO\\w+$'
        }
    },
    nativeBlockchainPublicAddress: {
        required: true,
        type: String,
        length: { min: 1, max: 128 },
        matchParams: {
            regex: '^\\w+$'
        }
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
    const schema = {};
    for (const ruleKey in rules) {
        schema[ruleKey] = Object.assign({}, rules[ruleKey]);
        if (rules[ruleKey].matchParams && rules[ruleKey].matchParams.regex) {
            schema[ruleKey].match = new RegExp(rules[ruleKey].matchParams.regex, rules[ruleKey].matchParams.opt);
            delete schema[ruleKey].matchParams;
        }
    }
    const validator = new Schema(schema);
    const errors = validator.validate(data);
    const validationResult = { isValid: true, errors: [] };
    if (errors.length) {
        validationResult.isValid = false;
        validationResult.errors = errors.map(err => ({ field: err.path, message: err.message }));
    }
    return validationResult;
}
exports.validate = validate;
