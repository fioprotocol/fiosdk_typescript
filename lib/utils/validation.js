"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRules = exports.allRules = void 0;
exports.validate = validate;
const validate_1 = require("validate");
exports.allRules = {
    chain: {
        length: { min: 1, max: 10 },
        matchParams: {
            opt: 'i',
            regex: '^[a-z0-9]+$',
        },
        required: true,
        type: String,
    },
    fioAddress: {
        length: { min: 3, max: 64 },
        matchParams: {
            opt: 'gim',
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
        },
        required: true,
        type: String,
    },
    fioDomain: {
        length: { min: 1, max: 62 },
        matchParams: {
            opt: 'i',
            regex: '^[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$',
        },
        required: true,
        type: String,
    },
    fioPublicKey: {
        length: { min: 1, max: 62 },
        matchParams: {
            regex: '^FIO\\w+$',
        },
        required: true,
        type: String,
    },
    nativeBlockchainPublicAddress: {
        length: { min: 1, max: 128 },
        matchParams: {
            regex: '^\\w+$',
        },
        required: true,
        type: String,
    },
    tpid: {
        length: { min: 3, max: 64 },
        matchParams: {
            opt: 'gim',
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
        },
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
    Object.keys(rules).forEach((ruleKey) => {
        schema[ruleKey] = Object.assign({}, rules[ruleKey]);
        const matchParams = rules[ruleKey].matchParams;
        if (matchParams && matchParams.regex) {
            schema[ruleKey].match = new RegExp(matchParams.regex, matchParams.opt);
            delete schema[ruleKey].matchParams;
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