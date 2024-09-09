import Schema, {ValidationError} from 'validate'
import {ErrObj} from '../entities'

export type Rule = {
    length?: {min?: number, max: number},
    matchParams?: {
        opt?: string,
        regex: string,
    },
    required?: boolean,
    type: StringConstructor | NumberConstructor | ObjectConstructor | BooleanConstructor,
}

export const allRules = {
    chain: {
        length: {min: 1, max: 10},
        matchParams: {
            opt: 'i',
            regex: '^[a-z0-9]+$',
        },
        required: true,
        type: String,
    },
    fioAddress: {
        length: {min: 3, max: 64},
        matchParams: {
            opt: 'gim',
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
        },
        required: true,
        type: String,
    },
    fioDomain: {
        length: {min: 1, max: 62},
        matchParams: {
            opt: 'i',
            regex: '^[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$',
        },
        required: true,
        type: String,
    },
    fioPublicKey: {
        length: {min: 1, max: 62},
        matchParams: {
            regex: '^FIO\\w+$',
        },
        required: true,
        type: String,
    },
    nativeBlockchainPublicAddress: {
        length: {min: 1, max: 128},
        matchParams: {
            regex: '^\\w+$',
        },
        required: true,
        type: String,
    },
    tpid: {
        length: {min: 3, max: 64},
        matchParams: {
            opt: 'gim',
            regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
        },
        type: String,
    },
} satisfies Record<string, Rule>

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
} satisfies Record<string, Record<string, Rule>>

export function validate(
    data: any,
    rules: Record<string, Rule>,
): { isValid: boolean, errors: ErrObj[] } {
    const schema: any = {}

    Object.keys(rules).forEach((ruleKey) => {
        schema[ruleKey] = {...rules[ruleKey]}
        const matchParams = rules[ruleKey].matchParams
        if (matchParams && matchParams.regex) {
            schema[ruleKey].match = new RegExp(matchParams.regex, matchParams.opt)
            delete schema[ruleKey].matchParams
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
