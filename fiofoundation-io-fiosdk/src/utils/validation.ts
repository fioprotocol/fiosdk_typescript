// @ts-ignore
import { LIVR } from 'livr'

interface IValidationRules {
  addPublicAddressRules: object,
  registerFioAddress: object,
  setFioDomainVisibility: object,
  newFundsRequest: object
}

const allRules = {
  chain: ['string', 'to_lc', { length_between: [1, 10], like: '^[a-z0-9]+$' }],
  fioAddress: ['string', 'to_lc', {
    length_between: [3, 64],
    like: '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-)):[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)',
  }],
  fioDomain: ['string', 'to_lc', { length_between: [1, 62], like: '^[a-z0-9\\-]+$' }],
  fioPublicKey: ['string', { like: '^FIO.+$' }],
  nativeBlockchainPublicAddress: ['string', { length_between: [1, 128] }],
}

const addPublicAddressRules: object = {
  fioAddress: allRules.fioAddress,
  publicAddress: allRules.nativeBlockchainPublicAddress,
  tokenCode: allRules.chain,
}

const registerFioAddress: object = {
  fioAddress: allRules.fioAddress,
  tpid: allRules.fioAddress,
}

const setFioDomainVisibility: object = {
  fioDomain: allRules.fioDomain,
  tpid: allRules.fioAddress,
}

const newFundsRequest: object = {
  payerFioAddress: allRules.fioAddress,
  payerFioPublicKey: allRules.fioAddress,
  tokenCode: allRules.chain,
  walletFioAddress: allRules.fioAddress,
}

export const validationRules: IValidationRules = {
  addPublicAddressRules,
  registerFioAddress,
  setFioDomainVisibility,
  newFundsRequest,
}

export function validate(data: object, rules: object): { isValid: boolean, errors: object } {
  const validator = new LIVR.Validator(rules)
  const validData = validator.validate(data)
  const validationResult = { isValid: true, errors: {} }

  if (!validData) {
    validationResult.isValid = false
    validationResult.errors = validator.getErrors()
  }

  return validationResult
}
