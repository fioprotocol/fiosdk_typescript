"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LIVR = require('livr');
const allRules = {
    chain: ['string', 'to_lc', { length_between: [1, 10], like: '^[a-z0-9]+$' }],
    fioAddress: ['string', 'to_lc', {
            length_between: [3, 64],
            like: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-)):[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)',
        }],
    fioDomain: ['string', 'to_lc', { length_between: [1, 62], like: '^[a-z0-9\\-]+$' }],
    fioPublicKey: ['string', { like: '^FIO.+$' }],
    nativeBlockchainPublicAddress: ['string', { length_between: [1, 128] }],
};
exports.validationRules = {
    addPublicAddressRules: {
        fioAddress: allRules.fioAddress,
        publicAddress: allRules.nativeBlockchainPublicAddress,
        tokenCode: allRules.chain,
        tpid: allRules.fioAddress,
    },
    registerFioAddress: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.fioAddress,
    },
    registerFioDomain: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.fioAddress,
    },
    renewFioAddress: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.fioAddress,
    },
    renewFioDomain: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.fioAddress,
    },
    setFioDomainVisibility: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.fioAddress,
    },
    newFundsRequest: {
        payerFioAddress: allRules.fioAddress,
        payeeFioAddress: allRules.fioAddress,
        tokenCode: allRules.chain,
        walletFioAddress: allRules.fioAddress,
    },
    rejectFunds: {
        tpid: allRules.fioAddress,
    },
    recordSend: {
        payerFIOAddress: allRules.fioAddress,
        payeeFIOAddress: allRules.fioAddress,
        tpid: allRules.fioAddress,
        tokenCode: allRules.chain,
    },
    transferTokens: {
        tpid: allRules.fioAddress,
    },
    getFee: {
        fioAddress: allRules.fioAddress,
    },
};
function validate(data, rules) {
    const validator = new LIVR.Validator(rules);
    const validData = validator.validate(data);
    const validationResult = { isValid: true, errors: {} };
    if (!validData) {
        validationResult.isValid = false;
        validationResult.errors = validator.getErrors();
    }
    return validationResult;
}
exports.validate = validate;
