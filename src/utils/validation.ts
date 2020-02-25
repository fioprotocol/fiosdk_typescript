import { SchemaDefinition } from 'validate'
const Schema = require('validate')
import { ErrObj } from '../entities/ValidationError'

export const allRules = {
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
}

export const validationRules = {
  addPublicAddressRules: {
    fioAddress: allRules.fioAddress,
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

export function validate(data: object, rules: SchemaDefinition): { isValid: boolean, errors: ErrObj[] } {
  const validator = new Schema(rules)
  const errors: { path: string, message: string }[] = validator.validate(data)
  const validationResult: { isValid: boolean, errors: ErrObj[] } = { isValid: true, errors: [] }

  if (errors.length) {
    validationResult.isValid = false
    validationResult.errors = errors.map(err => ({ field: err.path, message: err.message }))
  }

  return validationResult
}
