import {Ecc} from '@fioprotocol/fiojs'
import Schema, { PropertyDefinition, ValidationError } from 'validate'
import {ErrObj} from '../entities'

const testFioPublicKey = (key: string) => key.startsWith('FIO') && Ecc.PublicKey.isValid(key)

export const allRules = {
    chain: {
        length: {min: 1, max: 10},
        match: /^[a-z0-9]+$/i,
        required: true,
        type: String,
    },
    fioAddress: {
        length: {min: 3, max: 64},
        match: /^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/gim,
        required: true,
        type: String,
    },
    fioDomain: {
        length: {min: 1, max: 62},
        match: /^[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/i,
        required: true,
        type: String,
    },
    fioName: {
        length: {min: 1, max: 62},
        match: /^(?=.{1,62}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/i,
        required: true,
        type: String,
    },
    fioPublicKey: {
        length: {min: 1, max: 62},
        required: true,
        type: String,
        use: {testFioPublicKey},
    },
    nativeBlockchainPublicAddress: {
        length: {min: 1, max: 128},
        match: /^\w+$/,
        required: true,
        type: String,
    },
    tpid: {
        length: {min: 3, max: 64},
        match: /^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/gim,
        type: String,
    },
} satisfies Record<string, PropertyDefinition>

export const validationRules = {
    addPublicAddressRules: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.tpid,
    },
    cancelFundsRequestRules: {
        tpid: allRules.tpid,
    },
    getFee: {
        fioAddress: allRules.fioAddress,
    },
    newFundsRequest: {
        payeeFioAddress: allRules.fioAddress,
        payerFioAddress: allRules.fioAddress,
        tokenCode: allRules.chain,
        tpid: allRules.tpid,
    },
    recordObtData: {
        payeeFioAddress: allRules.fioAddress,
        payerFioAddress: allRules.fioAddress,
        tokenCode: allRules.chain,
        tpid: allRules.tpid,
    },
    registerFioAddress: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.tpid,
    },
    registerFioDomain: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.tpid,
    },
    registerFioDomainAddress: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.tpid,
    },
    rejectFunds: {
        tpid: allRules.tpid,
    },
    renewFioAddress: {
        fioAddress: allRules.fioAddress,
        tpid: allRules.tpid,
    },
    renewFioDomain: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.tpid,
    },
    setFioDomainVisibility: {
        fioDomain: allRules.fioDomain,
        tpid: allRules.tpid,
    },
    transferLockedTokensRequest: {
        tpid: allRules.tpid,
    },
    transferTokens: {
        tpid: allRules.tpid,
    },
} satisfies Record<string, Record<string, PropertyDefinition>>

export function validate(
    data: any,
    rules: Record<string, PropertyDefinition>,
): { isValid: boolean, errors: ErrObj[] } {
    const schema: any = {}

    // ATTENTION! Don't change this code. This code fix error when regexp rules not working correctly if used directly
    Object.keys(rules).forEach((ruleKey) => {
        schema[ruleKey] = {...rules[ruleKey]}
        const match = rules[ruleKey].match
        if (match) {
            schema[ruleKey].match = new RegExp(match.source, match.flags)
        }
    })

    const validator = new Schema(schema)
    const errors: ValidationError[] = validator.validate(data)
    const validationResult: { isValid: boolean, errors: ErrObj[] } = {isValid: true, errors: []}

    if (errors.length) {
        validationResult.isValid = false
        validationResult.errors = errors.map((err) => ({
            field: err.path,
            message: ('message' in err && typeof err.message === 'string') ? err.message : '',
        }))
    }

    return validationResult
}
