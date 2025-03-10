import { expect } from 'chai';
import { Account, Action, EndPoint, FioRequestStatus, FIOSDK, FioSentItem, FioSentItemContent, KeysPair, TransactionResponse } from '../../src/FIOSDK';
import { defaultFee, fioChainCode, fioTokenCode } from '../constants';
import { getMnemonic, timeout, fetchJson, generateTestingFioDomain, generateTestingFioAddress } from '../utils';

export const FioRequestsWithDifferentEncryptKeysTests = ({
  baseUrls,
  faucetPriv,
  faucetPub,
}: {
  baseUrls: string[],
  faucetPriv: string,
  faucetPub: string
}) =>
  describe('Request funds, approve and send with updated encrypt key', () => {
    let encFioSdk: FIOSDK
    let encFioSdk2: FIOSDK

    let encPrivateKey: string
    let encPublicKey: string
    let encPrivateKey2: string
    let encPublicKey2: string

    let encTestFioAddressName: string
    let encTestFioAddressName2: string

    const fundsAmount = 3
    const requestIds: number[] = []
    const requestIds2: number[] = []
    const memo = 'testing fund request with updated encrypt key'
    const memo2 = '2 testing fund request with updated encrypt key'
    const memo3 = '3 testing fund request with updated encrypt key'
    const memo4 = '4 testing fund request with updated encrypt key'
    const user1EncryptKeysMap = new Map()
    const user2EncryptKeysMap = new Map()
    let user1Account: string | null = null
    let user2Account: string | null = null

    let user1EncryptKeys: KeysPair
    let user1EncryptKeys2: KeysPair
    let user2EncryptKeys: KeysPair
    let user2EncryptKeys2: KeysPair

    before(async () => {
      const encPrivateKeyRes = await FIOSDK.createPrivateKeyMnemonic(getMnemonic())
      encPrivateKey = encPrivateKeyRes.fioKey
      const encPublicKeyRes = FIOSDK.derivedPublicKey(encPrivateKey)
      encPublicKey = encPublicKeyRes.publicKey
      encFioSdk = new FIOSDK({
        privateKey: encPrivateKey,
        publicKey: encPublicKey,
        apiUrls: baseUrls,
        fetchJson,
      })
      const encTestDomain = generateTestingFioDomain()
      encTestFioAddressName = generateTestingFioAddress(encTestDomain)

      const encPrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(getMnemonic())
      encPrivateKey2 = encPrivateKeyRes2.fioKey
      const encPublicKeyRes2 = FIOSDK.derivedPublicKey(encPrivateKey2)
      encPublicKey2 = encPublicKeyRes2.publicKey
      encFioSdk2 = new FIOSDK({
        privateKey: encPrivateKey2,
        publicKey: encPublicKey2,
        apiUrls: baseUrls,
        fetchJson,
      });

      await timeout(1000); //wait for 1 sec to generate another domain depending on timestamp

      const encTestDomain2 = generateTestingFioDomain()
      encTestFioAddressName2 = generateTestingFioAddress(encTestDomain2)

      const fioSdkFaucet = new FIOSDK({
        privateKey: faucetPriv,
        publicKey: faucetPub,
        apiUrls: baseUrls,
        fetchJson,
      })
      console.log('faucetPriv', faucetPriv);
      console.log('faucetPub', faucetPub);
      const fioDomainFee = await fioSdkFaucet.getFee({
        endPoint: EndPoint.registerFioDomain,
      });
      const fioAddressFee = await fioSdkFaucet.getFee({
        endPoint: EndPoint.registerFioAddress,
      });
      console.log('fioDomainFee', fioDomainFee);
      console.log('fioAddressFee', fioAddressFee);
      console.log(Number(fioDomainFee.fee), Number(fioAddressFee.fee));
      const fundsAmount = Number(fioDomainFee.fee) + Number(fioAddressFee.fee) + Number(FIOSDK.SUFUnit * 300);
      console.log('fundsAmount', fundsAmount);

      await fioSdkFaucet.genericAction('transferTokens', {
        payeeFioPublicKey: encPublicKey,
        amount: fundsAmount,
        maxFee: defaultFee,
      })
      await fioSdkFaucet.genericAction('transferTokens', {
        payeeFioPublicKey: encPublicKey2,
        amount: fundsAmount,
        maxFee: defaultFee,
      })

      const encIsAvailableResult = await encFioSdk.genericAction('isAvailable', {
        fioName: encTestDomain,
      })
      if (!encIsAvailableResult.is_registered) {
        await encFioSdk.genericAction('registerFioDomain', {
          fioDomain: encTestDomain,
          maxFee: defaultFee,
        })
      }

      await encFioSdk.genericAction('setFioDomainVisibility', {
        fioDomain: encTestDomain,
        isPublic: true,
        maxFee: defaultFee,
        technologyProviderId: '',
      })

      const encIsAvailableResult2 = await encFioSdk2.genericAction(
        'isAvailable',
        {
          fioName: encTestDomain2,
        },
      )
      if (!encIsAvailableResult2.is_registered) {
        await encFioSdk2.genericAction('registerFioDomain', {
          fioDomain: encTestDomain2,
          maxFee: defaultFee,
        })
      }

      const encIsAvailableResult3 = await encFioSdk.genericAction('isAvailable', {
        fioName: encTestFioAddressName,
      })
      if (!encIsAvailableResult3.is_registered) {
        await encFioSdk.genericAction('registerFioAddress', {
          fioAddress: encTestFioAddressName,
          maxFee: defaultFee,
        })
      }

      const encIsAvailableResult4 = await encFioSdk2.genericAction(
        'isAvailable',
        {
          fioName: encTestFioAddressName2,
        },
      )
      if (!encIsAvailableResult4.is_registered) {
        await encFioSdk2.genericAction('registerFioAddress', {
          fioAddress: encTestFioAddressName2,
          maxFee: defaultFee,
        })
      }
    })

    it(`Generate encrypt keys for user1`, async () => {
      const user1PrivateKeyRes1 = await FIOSDK.createPrivateKeyMnemonic(
        getMnemonic(),
      )
      const user1PrivateKey1 = user1PrivateKeyRes1.fioKey
      const user1PublicKeyRes1 = FIOSDK.derivedPublicKey(user1PrivateKey1)
      const user1PublicKey1 = user1PublicKeyRes1.publicKey

      const user1PrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(
        getMnemonic(),
      )
      const user1PrivateKey2 = user1PrivateKeyRes2.fioKey
      const user1PublicKeyRes2 = FIOSDK.derivedPublicKey(user1PrivateKey2)
      const user1PublicKey2 = user1PublicKeyRes2.publicKey

      user1EncryptKeys = {
        privateKey: user1PrivateKey1,
        publicKey: user1PublicKey1,
      }

      user1EncryptKeys2 = {
        privateKey: user1PrivateKey2,
        publicKey: user1PublicKey2,
      }
    })

    it(`Generate encrypt keys for user2`, async () => {
      const user2PrivateKeyRes1 = await FIOSDK.createPrivateKeyMnemonic(
        getMnemonic(),
      )
      const user2PrivateKey1 = user2PrivateKeyRes1.fioKey
      const user2PublicKeyRes1 = FIOSDK.derivedPublicKey(user2PrivateKey1)
      const user2PublicKey1 = user2PublicKeyRes1.publicKey

      const user2PrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(
        getMnemonic(),
      )
      const user2PrivateKey2 = user2PrivateKeyRes2.fioKey
      const user2PublicKeyRes2 = FIOSDK.derivedPublicKey(user2PrivateKey2)
      const user2PublicKey2 = user2PublicKeyRes2.publicKey

      user2EncryptKeys = {
        privateKey: user2PrivateKey1,
        publicKey: user2PublicKey1,
      }

      user2EncryptKeys2 = {
        privateKey: user2PrivateKey2,
        publicKey: user2PublicKey2,
      }
    })
    it(`Set accountHash and set encryptKeys`, async () => {
      user1Account = FIOSDK.accountHash(encFioSdk.publicKey).accountnm
      user1EncryptKeysMap.set(user1Account, [
        user1EncryptKeys,
        user1EncryptKeys2,
      ])

      user2Account = FIOSDK.accountHash(encFioSdk2.publicKey).accountnm
      user2EncryptKeysMap.set(user2Account, [
        user2EncryptKeys,
        user2EncryptKeys2,
      ])
    })

    it(`Add new encrypt key for user1`, async () => {
      try {
        const result = await encFioSdk.genericAction('pushTransaction', {
          account: Account.address,
          action: Action.updateCryptKey,
          data: {
            encrypt_public_key: user1EncryptKeys.publicKey,
            fio_address: encTestFioAddressName,
            max_fee: 40000000000,
            tpid: '',
          },
        }) as TransactionResponse

        expect(result.status).to.equal('OK')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`requestFunds using encryptkey1 - user1 request of user2`, async () => {
      try {
        const result = await encFioSdk.genericAction('requestFunds', {
          amount: fundsAmount,
          chainCode: fioChainCode,
          encryptPrivateKey: user1EncryptKeys.privateKey,
          maxFee: defaultFee,
          memo,
          payeeFioAddress: encTestFioAddressName,
          payeeTokenPublicAddress: encFioSdk.publicKey,
          payerFioAddress: encTestFioAddressName2,
          payerFioPublicKey: encFioSdk2.publicKey,
          technologyProviderId: '',
          tokenCode: fioTokenCode,
        })

        requestIds.push(result.fio_request_id)
        expect(result.status).to.equal('requested')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`Add new encrypt 2 key for user1`, async () => {
      try {
        const result = await encFioSdk.genericAction('pushTransaction', {
          account: Account.address,
          action: Action.updateCryptKey,
          data: {
            encrypt_public_key: user1EncryptKeys2.publicKey,
            fio_address: encTestFioAddressName,
            max_fee: 40000000000,
            tpid: '',
          },
        }) as TransactionResponse

        expect(result.status).to.equal('OK')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`requestFunds using encryptkey2 - user1 request of user2`, async () => {
      try {
        const result = await encFioSdk.genericAction('requestFunds', {
          amount: fundsAmount,
          chainCode: fioChainCode,
          encryptPrivateKey: user1EncryptKeys2.privateKey,
          maxFee: defaultFee,
          memo: memo2,
          payeeFioAddress: encTestFioAddressName,
          payeeTokenPublicAddress: encFioSdk.publicKey,
          payerFioAddress: encTestFioAddressName2,
          payerFioPublicKey: encFioSdk2.publicKey,
          technologyProviderId: '',
          tokenCode: fioTokenCode,
        })

        requestIds.push(result.fio_request_id)
        expect(result.status).to.equal('requested')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`Add new encrypt key for user2`, async () => {
      try {
        const result = await encFioSdk2.genericAction('pushTransaction', {
          account: Account.address,
          action: Action.updateCryptKey,
          data: {
            encrypt_public_key: user2EncryptKeys.publicKey,
            fio_address: encTestFioAddressName2,
            max_fee: 40000000000,
            tpid: '',
          },
        }) as TransactionResponse

        expect(result.status).to.equal('OK')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`requestFunds using encryptkey - user2 request of user1`, async () => {
      try {
        const result = await encFioSdk2.genericAction('requestFunds', {
          amount: fundsAmount,
          chainCode: fioChainCode,
          encryptPrivateKey: user2EncryptKeys.privateKey,
          maxFee: defaultFee,
          memo: memo3,
          payeeFioAddress: encTestFioAddressName2,
          payeeTokenPublicAddress: encFioSdk2.publicKey,
          payerFioAddress: encTestFioAddressName,
          payerFioPublicKey: encFioSdk.publicKey,
          technologyProviderId: '',
          tokenCode: fioTokenCode,
        })

        requestIds2.push(result.fio_request_id)
        expect(result.status).to.equal('requested')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`Add new encrypt2 key for user2`, async () => {
      try {
        const result = await encFioSdk2.genericAction('pushTransaction', {
          account: Account.address,
          action: Action.updateCryptKey,
          data: {
            encrypt_public_key: user2EncryptKeys2.publicKey,
            fio_address: encTestFioAddressName2,
            max_fee: 40000000000,
            tpid: '',
          },
        }) as TransactionResponse

        expect(result.status).to.equal('OK')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`requestFunds using encryptkey2 - user2 request of user1`, async () => {
      try {
        const result = await encFioSdk2.genericAction('requestFunds', {
          amount: fundsAmount,
          chainCode: fioChainCode,
          encryptPrivateKey: user2EncryptKeys2.privateKey,
          maxFee: defaultFee,
          memo: memo4,
          payeeFioAddress: encTestFioAddressName2,
          payeeTokenPublicAddress: encFioSdk2.publicKey,
          payerFioAddress: encTestFioAddressName,
          payerFioPublicKey: encFioSdk.publicKey,
          technologyProviderId: '',
          tokenCode: fioTokenCode,
        })
        requestIds2.push(result.fio_request_id)
        expect(result.status).to.equal('requested')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getSentFioRequests user 1 encrypt keys`, async () => {
      try {
        const result = await encFioSdk.genericAction('getSentFioRequests', {
          encryptKeys: user1EncryptKeysMap,
        })

        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const sentReq = result.requests.filter(
          (sr) => requestIds.includes(sr.fio_request_id),
        )

        const firstSentReq = sentReq[0] as FioSentItem
        const secondSentReq = sentReq[1] as FioSentItem

        expect(firstSentReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(firstSentReq.fio_request_id).to.be.a('number')
        expect(firstSentReq.fio_request_id).to.equal(requestIds[0])
        expect(firstSentReq.payer_fio_address).to.be.a('string')
        expect(firstSentReq.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(firstSentReq.payee_fio_address).to.be.a('string')
        expect(firstSentReq.payee_fio_address).to.equal(encTestFioAddressName)
        expect(firstSentReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey)
        expect(firstSentReq.payee_fio_public_key).to.equal(
          user1EncryptKeys.publicKey,
        )
        expect(firstSentReq.content.memo).to.be.equal(memo)

        expect(secondSentReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(secondSentReq.fio_request_id).to.be.a('number')
        expect(secondSentReq.fio_request_id).to.equal(requestIds[1])
        expect(secondSentReq.payer_fio_address).to.be.a('string')
        expect(secondSentReq.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(secondSentReq.payee_fio_address).to.be.a('string')
        expect(secondSentReq.payee_fio_address).to.equal(encTestFioAddressName)
        expect(secondSentReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey)
        expect(secondSentReq.payee_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(secondSentReq.content.memo).to.be.equal(memo2)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getPendingFioRequests user2 encrypt keys`, async () => {
      try {
        const result = await encFioSdk2.genericAction('getPendingFioRequests', {
          encryptKeys: user2EncryptKeysMap,
        })

        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const pendingReq = result.requests.filter((pr) =>
          requestIds.includes(pr.fio_request_id),
        )
        const firstPendingReq = pendingReq[0]
        const secondPendingReq = pendingReq[1]

        expect(firstPendingReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
        )
        expect(firstPendingReq.fio_request_id).to.be.a('number')
        expect(firstPendingReq.fio_request_id).to.equal(requestIds[0])
        expect(firstPendingReq.payer_fio_address).to.be.a('string')
        expect(firstPendingReq.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(firstPendingReq.payee_fio_address).to.be.a('string')
        expect(firstPendingReq.payee_fio_address).to.equal(encTestFioAddressName)
        expect(firstPendingReq.payer_fio_public_key).to.equal(
          encFioSdk2.publicKey,
        )
        expect(firstPendingReq.payee_fio_public_key).to.equal(
          user1EncryptKeys.publicKey,
        )
        expect(firstPendingReq.content.memo).to.equal(memo)

        expect(secondPendingReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
        )
        expect(secondPendingReq.fio_request_id).to.be.a('number')
        expect(secondPendingReq.fio_request_id).to.equal(requestIds[1])
        expect(secondPendingReq.payer_fio_address).to.be.a('string')
        expect(secondPendingReq.payer_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(secondPendingReq.payee_fio_address).to.be.a('string')
        expect(secondPendingReq.payee_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(secondPendingReq.payer_fio_public_key).to.equal(
          encFioSdk2.publicKey,
        )
        expect(secondPendingReq.payee_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(secondPendingReq.content.memo).to.equal(memo2)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getSentFioRequests user2 encrypt keys`, async () => {
      try {
        const result = await encFioSdk2.genericAction('getSentFioRequests', {
          encryptKeys: user2EncryptKeysMap,
        })
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const sentReq = result.requests.filter((sr) =>
          requestIds2.includes(sr.fio_request_id),
        )
        const firstSentReq = sentReq[0] as FioSentItem
        const secondSentReq = sentReq[1] as FioSentItem

        expect(firstSentReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(firstSentReq.fio_request_id).to.be.a('number')
        expect(firstSentReq.fio_request_id).to.equal(requestIds2[0])
        expect(firstSentReq.payer_fio_address).to.be.a('string')
        expect(firstSentReq.payer_fio_address).to.equal(encTestFioAddressName)
        expect(firstSentReq.payee_fio_address).to.be.a('string')
        expect(firstSentReq.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(firstSentReq.payer_fio_public_key).to.equal(user1EncryptKeys2.publicKey)
        expect(firstSentReq.payee_fio_public_key).to.equal(
          user2EncryptKeys.publicKey,
        )
        expect(firstSentReq.content.memo).to.be.equal(memo3)

        expect(secondSentReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(secondSentReq.fio_request_id).to.be.a('number')
        expect(secondSentReq.fio_request_id).to.equal(requestIds2[1])
        expect(secondSentReq.payer_fio_address).to.be.a('string')
        expect(secondSentReq.payer_fio_address).to.equal(encTestFioAddressName)
        expect(secondSentReq.payee_fio_address).to.be.a('string')
        expect(secondSentReq.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(secondSentReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(secondSentReq.payee_fio_public_key).to.equal(
          user2EncryptKeys2.publicKey,
        )
        expect(secondSentReq.content.memo).to.be.equal(memo4)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getPendingFioRequests user1 encrypt keys`, async () => {
      try {
        const result = await encFioSdk.genericAction('getPendingFioRequests', {
          encryptKeys: user1EncryptKeysMap,
        })
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const pendingReq = result.requests.filter((pr) =>
          requestIds2.includes(pr.fio_request_id),
        )
        const firstPendingReq = pendingReq[0]
        const secondPendingReq = pendingReq[1]

        expect(firstPendingReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
        )
        expect(firstPendingReq.fio_request_id).to.be.a('number')
        expect(firstPendingReq.fio_request_id).to.equal(requestIds2[0])
        expect(firstPendingReq.payer_fio_address).to.be.a('string')
        expect(firstPendingReq.payer_fio_address).to.equal(encTestFioAddressName)
        expect(firstPendingReq.payee_fio_address).to.be.a('string')
        expect(firstPendingReq.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(firstPendingReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(firstPendingReq.payee_fio_public_key).to.equal(
          user2EncryptKeys.publicKey,
        )
        expect(firstPendingReq.content.memo).to.equal(memo3)

        expect(secondPendingReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
        )
        expect(secondPendingReq.fio_request_id).to.be.a('number')
        expect(secondPendingReq.fio_request_id).to.equal(requestIds2[1])
        expect(secondPendingReq.payer_fio_address).to.be.a('string')
        expect(secondPendingReq.payer_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(secondPendingReq.payee_fio_address).to.be.a('string')
        expect(secondPendingReq.payee_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(secondPendingReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(secondPendingReq.payee_fio_public_key).to.equal(
          user2EncryptKeys2.publicKey,
        )
        expect(secondPendingReq.content.memo).to.equal(memo4)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getReceivedFioRequests encrypt keys - user1 to user2`, async () => {
      try {
        const result = await encFioSdk.genericAction('getReceivedFioRequests', {
          encryptKeys: user1EncryptKeysMap,
        })
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const receivedReq = result.requests.filter((pr) =>
          requestIds2.includes(pr.fio_request_id),
        )
        const firstReceivedReq = receivedReq[0]
        const secondReceivedReq = receivedReq[1]

        expect(firstReceivedReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
          'status',
        )
        expect(firstReceivedReq.status).to.be.a('string')
        expect(firstReceivedReq.fio_request_id).to.be.a('number')
        expect(firstReceivedReq.fio_request_id).to.equal(requestIds2[0])
        expect(firstReceivedReq.payer_fio_address).to.be.a('string')
        expect(firstReceivedReq.payer_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(firstReceivedReq.payee_fio_address).to.be.a('string')
        expect(firstReceivedReq.payee_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(firstReceivedReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(firstReceivedReq.payee_fio_public_key).to.equal(
          user2EncryptKeys.publicKey,
        )
        expect((firstReceivedReq.content as FioSentItemContent).memo).to.equal(memo3)

        expect(secondReceivedReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
          'status',
        )
        expect(secondReceivedReq.status).to.be.a('string')
        expect(secondReceivedReq.fio_request_id).to.be.a('number')
        expect(secondReceivedReq.fio_request_id).to.equal(requestIds2[1])
        expect(secondReceivedReq.payer_fio_address).to.be.a('string')
        expect(secondReceivedReq.payer_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(secondReceivedReq.payee_fio_address).to.be.a('string')
        expect(secondReceivedReq.payee_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(secondReceivedReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(secondReceivedReq.payee_fio_public_key).to.equal(
          user2EncryptKeys2.publicKey,
        )
        expect((secondReceivedReq.content as FioSentItemContent).memo).to.equal(memo4)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getReceivedFioRequests encrypt keys - user2 to user1`, async () => {
      try {
        const result = await encFioSdk2.genericAction(
          'getReceivedFioRequests',
          {
            encryptKeys: user2EncryptKeysMap,
          },
        )
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const receivedReq = result.requests.filter((pr) =>
          requestIds.includes(pr.fio_request_id),
        )
        const firstReceivedReq = receivedReq[0]
        const secondReceivedReq = receivedReq[1]

        expect(firstReceivedReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
          'status',
        )
        expect(firstReceivedReq.status).to.be.a('string')
        expect(firstReceivedReq.fio_request_id).to.be.a('number')
        expect(firstReceivedReq.fio_request_id).to.equal(requestIds[0])
        expect(firstReceivedReq.payer_fio_address).to.be.a('string')
        expect(firstReceivedReq.payer_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(firstReceivedReq.payee_fio_address).to.be.a('string')
        expect(firstReceivedReq.payee_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(firstReceivedReq.payer_fio_public_key).to.equal(
          encFioSdk2.publicKey,
        )
        expect(firstReceivedReq.payee_fio_public_key).to.equal(
          user1EncryptKeys.publicKey,
        )
        expect((firstReceivedReq.content as FioSentItemContent).memo).to.equal(memo)

        expect(secondReceivedReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'time_stamp',
          'content',
          'status',
        )
        expect(secondReceivedReq.status).to.be.a('string')
        expect(secondReceivedReq.fio_request_id).to.be.a('number')
        expect(secondReceivedReq.fio_request_id).to.equal(requestIds[1])
        expect(secondReceivedReq.payer_fio_address).to.be.a('string')
        expect(secondReceivedReq.payer_fio_address).to.equal(
          encTestFioAddressName2,
        )
        expect(secondReceivedReq.payee_fio_address).to.be.a('string')
        expect(secondReceivedReq.payee_fio_address).to.equal(
          encTestFioAddressName,
        )
        expect(secondReceivedReq.payer_fio_public_key).to.equal(
          encFioSdk2.publicKey,
        )
        expect(secondReceivedReq.payee_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect((secondReceivedReq.content as FioSentItemContent).memo).to.equal(memo2)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`Cancel request encrypt key - user1 to user2`, async () => {
      try {
        const result = await encFioSdk.genericAction('cancelFundsRequest', {
          fioRequestId: requestIds[0],
          maxFee: defaultFee,
        })
        expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
        expect(result.status).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`Cancel request encrypt key - user2 to user1`, async () => {
      try {
        const result = await encFioSdk2.genericAction('cancelFundsRequest', {
          fioRequestId: requestIds2[0],
          maxFee: defaultFee,
        })
        expect(result).to.have.all.keys(
          'transaction_id',
          'block_num',
          'block_time',
          'status',
          'fee_collected',
        )
        expect(result.status).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getCancelledFioRequests user1 encrypt keys`, async () => {
      try {
        await timeout(4000)
        const result = await encFioSdk.genericAction('getCancelledFioRequests', {
          encryptKeys: user1EncryptKeysMap,
        })
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const canceledReq = result.requests.find((cr) =>
          requestIds[0] === cr.fio_request_id,
        )!

        expect(canceledReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(canceledReq.fio_request_id).to.be.a('number')
        expect(canceledReq.fio_request_id).to.equal(requestIds[0])
        expect(canceledReq.payer_fio_address).to.be.a('string')
        expect(canceledReq.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(canceledReq.payee_fio_address).to.be.a('string')
        expect(canceledReq.payee_fio_address).to.equal(encTestFioAddressName)
        expect(canceledReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey)
        expect(canceledReq.payee_fio_public_key).to.equal(
          user1EncryptKeys.publicKey,
        )
        expect(canceledReq.content.memo).to.be.equal(memo)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getCancelledFioRequests user2 encrypt keys`, async () => {
      try {
        const result = await encFioSdk2.genericAction('getCancelledFioRequests', {
          encryptKeys: user2EncryptKeysMap,
        })
        expect(result).to.have.all.keys('requests', 'more')
        expect(result.requests).to.be.a('array')
        expect(result.more).to.be.a('number')

        const canceledReq = result.requests.find((cr) =>
          requestIds2[0] === cr.fio_request_id,
        )!

        expect(canceledReq).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(canceledReq.fio_request_id).to.be.a('number')
        expect(canceledReq.fio_request_id).to.equal(requestIds2[0])
        expect(canceledReq.payer_fio_address).to.be.a('string')
        expect(canceledReq.payer_fio_address).to.equal(encTestFioAddressName)
        expect(canceledReq.payee_fio_address).to.be.a('string')
        expect(canceledReq.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(canceledReq.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(canceledReq.payee_fio_public_key).to.equal(
          user2EncryptKeys.publicKey,
        )
        expect(canceledReq.content.memo).to.be.equal(memo3)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`recordObtData encrypt2 key - user1 to user2`, async () => {
      try {
        const transfer = await encFioSdk.genericAction('transferTokens', {
          amount: fundsAmount,
          maxFee: defaultFee,
          payeeFioPublicKey: encFioSdk2.publicKey,
        })
        const result = await encFioSdk.genericAction('recordObtData', {
          amount: fundsAmount,
          chainCode: fioChainCode,
          encryptPrivateKey: user1EncryptKeys2.privateKey,
          fioRequestId: requestIds2[1],
          maxFee: defaultFee,
          memo: memo4,
          obtId: transfer.transaction_id,
          payeeFioAddress: encTestFioAddressName2,
          payeeTokenPublicAddress: encPublicKey2,
          payerFioAddress: encTestFioAddressName,
          payerTokenPublicAddress: encPublicKey,
          status: FioRequestStatus.sentToBlockchain,
          tokenCode: fioTokenCode,
        })
        expect(result).to.have.all.keys(
          'transaction_id',
          'block_num',
          'block_time',
          'status',
          'fee_collected',
        )
        expect(result.status).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
      } catch (err) {
        expect(err).to.equal(null)
      }
    })

    it(`recordObtData encrypt2 key - user2 to user1`, async () => {
      const transfer = await encFioSdk2.genericAction('transferTokens', {
        amount: fundsAmount,
        maxFee: defaultFee,
        payeeFioPublicKey: encFioSdk.publicKey,
      })
      const result = await encFioSdk2.genericAction('recordObtData', {
        amount: fundsAmount,
        chainCode: fioChainCode,
        encryptPrivateKey: user2EncryptKeys2.privateKey,
        fioRequestId: requestIds[1],
        maxFee: defaultFee,
        memo: memo2,
        obtId: transfer.transaction_id,
        payeeFioAddress: encTestFioAddressName,
        payeeTokenPublicAddress: encFioSdk.publicKey,
        payerFioAddress: encTestFioAddressName2,
        payerTokenPublicAddress: encFioSdk2.publicKey,
        status: FioRequestStatus.sentToBlockchain,
        tokenCode: fioTokenCode,
      })
      expect(result).to.have.all.keys(
        'transaction_id',
        'block_num',
        'block_time',
        'status',
        'fee_collected',
      )
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    })

    it(`(sdk) Call getObtData - Payer user1`, async () => {
      try {
        await timeout(10000)
        const result = await encFioSdk.genericAction('getObtData', {
          encryptKeys: user1EncryptKeysMap,
        })
        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')

        const obtData = result.obt_data_records.find(
          (pr) => pr.fio_request_id === requestIds2[1],
        ) as FioSentItem

        expect(obtData).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(obtData.fio_request_id).to.be.a('number')
        expect(obtData.fio_request_id).to.equal(requestIds2[1])
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(encTestFioAddressName)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(obtData.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(obtData.payee_fio_public_key).to.equal(
          user2EncryptKeys2.publicKey,
        )
        expect(obtData.content.memo).to.be.equal(memo4)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getObtData - Payee user2`, async () => {
      try {
        const result = await encFioSdk2.genericAction('getObtData', {
          encryptKeys: user2EncryptKeysMap,
        })

        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')

        const obtData = result.obt_data_records.find(
          (pr) => pr.fio_request_id === requestIds2[1],
        ) as FioSentItem

        expect(obtData).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(obtData.fio_request_id).to.be.a('number')
        expect(obtData.fio_request_id).to.equal(requestIds2[1])
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(encTestFioAddressName)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(encTestFioAddressName2)
        expect(obtData.payer_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(obtData.payee_fio_public_key).to.equal(
          user2EncryptKeys2.publicKey,
        )
        expect(obtData.content.memo).to.be.equal(memo4)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getObtData - Payer user2`, async () => {
      try {
        await timeout(10000)
        const result = await encFioSdk2.genericAction('getObtData', {
          encryptKeys: user2EncryptKeysMap,
        })
        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')

        const obtData = result.obt_data_records.find(
          (pr) => pr.fio_request_id === requestIds[1],
        ) as FioSentItem

        expect(obtData).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(obtData.fio_request_id).to.be.a('number')
        expect(obtData.fio_request_id).to.equal(requestIds[1])
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(encTestFioAddressName)
        expect(obtData.payer_fio_public_key).to.equal(encPublicKey2)
        expect(obtData.payee_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(obtData.content.memo).to.be.equal(memo2)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })

    it(`(sdk) Call getObtData - Payee user1`, async () => {
      try {
        const result = await encFioSdk.genericAction('getObtData', {
          encryptKeys: user1EncryptKeysMap,
        })

        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')

        const obtData = result.obt_data_records.find(
          (pr) => pr.fio_request_id === requestIds[1],
        )! as FioSentItem

        expect(obtData).to.have.all.keys(
          'fio_request_id',
          'payer_fio_address',
          'payee_fio_address',
          'payee_fio_public_key',
          'payer_fio_public_key',
          'status',
          'time_stamp',
          'content',
        )
        expect(obtData.fio_request_id).to.be.a('number')
        expect(obtData.fio_request_id).to.equal(requestIds[1])
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(encTestFioAddressName2)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(encTestFioAddressName)
        expect(obtData.payer_fio_public_key).to.equal(
          encPublicKey2,
        )
        expect(obtData.payee_fio_public_key).to.equal(
          user1EncryptKeys2.publicKey,
        )
        expect(obtData.content.memo).to.be.equal(memo2)
      } catch (err) {
        // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test

        expect(err).to.equal(null)
      }
    })
  });
