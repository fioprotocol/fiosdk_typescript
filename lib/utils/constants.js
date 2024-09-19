"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingAbiError = exports.classMethodsToExcludeFromProxy = exports.defaultExpirationOffset = exports.defaultAccount = exports.multiplier = exports.rawAbiAccountName = exports.feeNoAddressOperation = exports.endPoints = void 0;
const entities_1 = require("../entities");
/**
 * @deprecated use {@link EndPoint}
 */
exports.endPoints = {
    AddPublicAddress: entities_1.EndPoint.addPublicAddress,
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
    TransferTokensKey: entities_1.EndPoint.transferTokensPublicKey,
    UnStakeFioTokens: entities_1.EndPoint.unStakeFioTokens,
};
exports.feeNoAddressOperation = [
    entities_1.EndPoint.registerFioDomain,
    entities_1.EndPoint.registerFioAddress,
    entities_1.EndPoint.registerFioDomainAddress,
    entities_1.EndPoint.transferTokensPublicKey,
    entities_1.EndPoint.transferTokensFioAddress,
];
/**
 * @deprecated use {@link Account}
 */
exports.rawAbiAccountName = Object.values(entities_1.Account);
exports.multiplier = 1000000000;
exports.defaultAccount = entities_1.Account.address;
exports.defaultExpirationOffset = 180;
/**
 * @ignore
 */
exports.classMethodsToExcludeFromProxy = [
    'constructor',
    'transactions',
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
//# sourceMappingURL=constants.js.map