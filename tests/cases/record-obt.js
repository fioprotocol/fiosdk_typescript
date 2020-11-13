const { expect } = require('chai')
const { EndPoint } = require('../../lib/entities/EndPoint')
const { SignedTransaction } = require('../../lib/transactions/signed/SignedTransaction')
const { Constants } = require('../../lib/utils/constants')

const recordObt = ({
  testFioAddressName,
  testFioAddressName2,
  fioChainCode,
  fioTokenCode,
  generateObtId,
  defaultFee,
  timeout
}) => {
  const obtId = generateObtId()
  const fundsAmount = 4.5

  it(`getFee for recordObtData`, async () => {
    const result = await fioSdk.getFee(EndPoint.recordObtData, testFioAddressName) // payerFioAddress

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`recordObtData`, async () => {
    const content = {
      payer_public_address: fioSdk.publicKey,
      payee_public_address: fioSdk2.publicKey,
      amount: `${fundsAmount}`,
      chain_code: fioChainCode,
      token_code: fioTokenCode,
      status: Constants.TrxStatuses.sent_to_blockchain,
      obt_id: obtId,
      memo: '',
      hash: '',
      offline_url: ''
    }
    const trx = new SignedTransaction()
    const result = await fioSdk.pushTransaction(Constants.actionNames.recordobt, {
      payer_fio_address: testFioAddressName,
      payee_fio_address: testFioAddressName2,
      content: trx.getCipherContent(Constants.CipherContentTypes.record_obt_data_content, content, fioSdk.privateKey, fioSdk2.publicKey),
      fio_request_id: '',
      max_fee: defaultFee,
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Payer getObtData`, async () => {
    await timeout(4000)
    const result = await fioSdk.get(
      EndPoint.getObtData, {
        fio_public_key: fioSdk.publicKey
      }, {
        decrypt: {
          key: 'obt_data_records',
          contentType: Constants.CipherContentTypes.record_obt_data_content
        }
      }
    )
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payee getObtData`, async () => {
    const result = await fioSdk2.get(
      EndPoint.getObtData, {
        fio_public_key: fioSdk2.publicKey
      }, {
        decrypt: {
          key: 'obt_data_records',
          contentType: Constants.CipherContentTypes.record_obt_data_content
        }
      }
    )
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })
}

module.exports = {
  recordObt
}
