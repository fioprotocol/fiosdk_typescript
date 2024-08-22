"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingAbiError = exports.classMethodsToExcludeFromProxy = exports.defaultExpirationOffset = exports.defaultAccount = exports.multiplier = exports.rawAbiAccountName = exports.feeNoAddressOperation = exports.endPoints = void 0;
const entities_1 = require("../entities");
/**
 * @deprecated use {@link EndPoint}
 */
exports.endPoints = {
    AddPublicAddress: entities_1.EndPoint.addPubAddress,
    PushTransaction: entities_1.EndPoint.pushTransaction,
    RecordObtData: entities_1.EndPoint.recordObtData,
    RegisterFioAddress: entities_1.EndPoint.registerFioAddress,
    RegisterFioDomain: entities_1.EndPoint.registerFioDomain,
    RegisterFioDomainAddress: entities_1.EndPoint.registerFioDomainAddress,
    RejectFundsRequest: entities_1.EndPoint.rejectFundsRequest,
    RequestNewFunds: entities_1.EndPoint.newFundsRequest,
    SetFioDomainVisibility: entities_1.EndPoint.setFioDomainPublic,
    StakeFioTokens: entities_1.EndPoint.stakeFioTokens,
    TransferTokensFioAddress: entities_1.EndPoint.transferTokensFioAddress,
    TransferTokensKey: entities_1.EndPoint.transferTokensKey,
    UnStakeFioTokens: entities_1.EndPoint.unStakeFioTokens,
};
exports.feeNoAddressOperation = [
    entities_1.EndPoint.registerFioDomain,
    entities_1.EndPoint.registerFioAddress,
    entities_1.EndPoint.registerFioDomainAddress,
    entities_1.EndPoint.transferTokensKey,
    entities_1.EndPoint.transferTokensFioAddress,
];
/**
 * @deprecated use {@link Account}
 */
exports.rawAbiAccountName = [
    // TODO we really need it?
    'eosio',
    // TODO we really need it?
    'eosio.msig',
    entities_1.Account.address,
    entities_1.Account.reqObt,
    entities_1.Account.token,
    entities_1.Account.fee,
    entities_1.Account.treasury,
    entities_1.Account.tpid,
    entities_1.Account.staking,
    entities_1.Account.perms,
    entities_1.Account.escrow,
    entities_1.Account.oracle,
];
exports.multiplier = 1000000000;
exports.defaultAccount = entities_1.Account.address;
exports.defaultExpirationOffset = 180;
/**
 * @ignore
 */
exports.classMethodsToExcludeFromProxy = [
    'constructor',
    'SUFUnit',
    'derivedPublicKey',
    'isChainCodeValid',
    'isTokenCodeValid',
    'isFioAddressValid',
    'isFioDomainValid',
    'isFioPublicKeyValid',
    'isPublicAddressValid',
    'validateChainCode',
    'validateTokenCode',
    'validateFioAddress',
    'validateFioDomain',
    'validateFioPublicKey',
    'validatePublicAddress',
    'amountToSUF',
    'SUFToAmount',
    'getFioPublicKey',
    'getTechnologyProviderId',
    'setSignedTrxReturnOption',
    'setApiUrls',
    'getMultiplier',
    'getAbi',
    'customRawAbiAccountName',
    'setCustomRawAbiAccountName',
];
exports.missingAbiError = 'unknown key';
