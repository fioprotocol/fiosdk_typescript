import { expect } from 'chai';
import 'mocha';

import { FIOSDK } from '../../src/FIOSDK';

export const RawAbiTests = ({ fioSdk }: { fioSdk: FIOSDK }) => describe('Raw Abi missing', () => {
  let consoleWarnOriginal: typeof console.warn // Store the original console.warn method
  let consoleWarnMessages: string[] = []

  beforeEach(() => {
    consoleWarnOriginal = console.warn // Store the original console.warn method
    console.warn = (...args) => {
      consoleWarnMessages.push(args.join(' '))
    }
  })

  afterEach(() => {
    console.warn = consoleWarnOriginal // Restore the original console.warn method
    consoleWarnMessages = [] // Reset the captured warning messages
  })

  it(`Get FIO Balance to test Raw Abi`, async () => {
    FIOSDK.setCustomRawAbiAccountName('fio.absentabi')

    const result = await fioSdk.genericAction('getFioBalance', {})

    const fioSdkAbiWarning = consoleWarnMessages.find((message) =>
      message.includes('FIO_SDK ABI WARNING:'),
    )

    FIOSDK.setCustomRawAbiAccountName(null)

    expect(fioSdkAbiWarning).to.exist

    expect(result).to.have.all.keys('balance', 'available', 'staked', 'srps', 'roe')
    expect(result.balance).to.be.a('number')
    expect(result.available).to.be.a('number')
    expect(result.staked).to.be.a('number')
    expect(result.srps).to.be.a('number')
    expect(result.roe).to.be.a('string')
  })
})
