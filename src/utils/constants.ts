import {Account, EndPoint} from '../entities'

/**
 * @deprecated use {@link EndPoint}
 */
export const endPoints = {
    AddPublicAddress: EndPoint.addPublicAddress,
    PushTransaction: EndPoint.pushTransaction,
    RecordObtData: EndPoint.recordObtData,
    RegisterFioAddress: EndPoint.registerFioAddress,
    RegisterFioDomain: EndPoint.registerFioDomain,
    RegisterFioDomainAddress: EndPoint.registerFioDomainAddress,
    RejectFundsRequest: EndPoint.rejectFundsRequest,
    RequestNewFunds: EndPoint.newFundsRequest,
    SetFioDomainVisibility: EndPoint.setFioDomainPublic,
    StakeFioTokens: EndPoint.stakeFioTokens,
    TransferTokensFioAddress: EndPoint.transferTokensFioAddress,
    TransferTokensKey: EndPoint.transferTokensPublicKey,
    UnStakeFioTokens: EndPoint.unStakeFioTokens,
}

export const feeNoAddressOperation: string[] = [
    EndPoint.registerFioDomain,
    EndPoint.registerFioAddress,
    EndPoint.registerFioDomainAddress,
    EndPoint.transferTokensPublicKey,
    EndPoint.transferTokensFioAddress,
]

/**
 * @deprecated use {@link Account}
 */
export const rawAbiAccountName: string[] = Object.values(Account)

export const multiplier = 1000000000

export const defaultAccount: string = Account.address

export const defaultExpirationOffset = 180

/**
 * @ignore
 */
export const classMethodsToExcludeFromProxy = [
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
] as const

export type ClassMethodsToExcludeFromProxy = typeof classMethodsToExcludeFromProxy[number]

export const missingAbiError = 'unknown key'

export const API_ERROR_CODES = {
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    CONFLICT: 409,
}
