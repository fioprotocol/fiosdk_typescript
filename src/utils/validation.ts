const Schema = require('validate')
import { ErrObj } from '../entities/ValidationError'

export const allRules = {
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
      regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
      opt: 'gim'
    }
  },
  tpid: {
    type: String,
    length: { min: 3, max: 64 },
    matchParams: {
      regex: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}@[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$)',
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
}

export const validationRules = {
  addPublicAddressRules: {
    fioAddress: allRules.fioAddress,
    tpid: allRules.tpid,
  },
  cancelFundsRequestRules: {
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
  newFundsRequest: {
    payerFioAddress: allRules.fioAddress,
    payeeFioAddress: allRules.fioAddress,
    tokenCode: allRules.chain,
    tpid: allRules.tpid,
  },
  transferLockedTokensRequest: {
    tpid: allRules.tpid,
  },
  rejectFunds: {
    tpid: allRules.tpid,
  },
  recordObtData: {
    payerFioAddress: allRules.fioAddress,
    payeeFioAddress: allRules.fioAddress,
    tpid: allRules.tpid,
    tokenCode: allRules.chain,
  },
  transferTokens: {
    tpid: allRules.tpid,
  },
  getFee: {
    fioAddress: allRules.fioAddress,
  },
}

export function validate(data: any, rules: any): { isValid: boolean, errors: ErrObj[] } {
  const schema: any = {}
  for (const ruleKey in rules) {
    schema[ruleKey] = { ...rules[ruleKey] }
    if (rules[ruleKey].matchParams && rules[ruleKey].matchParams.regex) {
      schema[ruleKey].match = new RegExp(rules[ruleKey].matchParams.regex, rules[ruleKey].matchParams.opt);
      delete schema[ruleKey].matchParams
    }
  }
  const validator = new Schema(schema)
  const errors: { path: string, message: string }[] = validator.validate(data)
  const validationResult: { isValid: boolean, errors: ErrObj[] } = { isValid: true, errors: [] }

  if (errors.length) {
    validationResult.isValid = false
    validationResult.errors = errors.map(err => ({ field: err.path, message: err.message }))
  }

  return validationResult
}
