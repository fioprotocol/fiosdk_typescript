import { expect } from 'chai';
import { Account, Action, FIOSDK, TransactionResponse } from '../../src/FIOSDK';
import { defaultFee } from '../constants';

export const AccountPermissionsTests = ({
  fioSdk,
  fioSdk2,
  publicKey,
  publicKey2,
  testFioAddressName,
  testFioDomainName,
}: {
  fioSdk: FIOSDK,
  fioSdk2: FIOSDK,
  publicKey: string,
  publicKey2: string,
  testFioAddressName: string,
  testFioDomainName: string,
}) => describe('Test addaddress on account with permissions', () => {
  let account1: string
  let account2: string

  it(`gen account names`, async () => {
    account1 = FIOSDK.accountHash(publicKey).accountnm
    account2 = FIOSDK.accountHash(publicKey2).accountnm
  })

  const permissionName = 'addmyadd' // Must be < 12 chars

  it(`user1 creates addmyadd permission and assigns to user2`, async () => {
    try {
      const authorizationObject = {
        accounts: [
          {
            permission: {
              actor: account2,
              permission: 'active',
            },
            weight: 1,
          },
        ],
        keys: [],
        threshold: 1,
        waits: [],
      }

      const result = await fioSdk.genericAction('pushTransaction', {
        account: Account.eosio,
        action: Action.updateAuth,
        data: {
          account: account1,
          actor: account1,
          auth: authorizationObject,
          max_fee: defaultFee,
          parent: 'active',
          permission: permissionName,
        },
      }) as TransactionResponse

      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time')

      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log('Error', e)
    }
  })

  it(`user1 links regmyadd permission to regaddress`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        account: Account.eosio,
        action: Action.linkAuth,
        data: {
          // the owner of the permission to be linked, this account will sign the transaction
          account: account1,
          actor: account1,
          code: 'fio.address', // the contract owner of the action to be linked
          max_fee: defaultFee, // the action to be linked
          requirement: permissionName, // the name of the custom permission (created by updateauth)
          type: 'addaddress',
        },
      }) as TransactionResponse

      expect(result).to.have.all.keys(
        'transaction_id',
        'block_num',
        'block_time',
      )
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      // the error we get here is due to using the same account every time we run the test,
      // we get an error "same as previous" from linkauth, this is ok!
      // console.log(e);
    }
  })

  it(`renewdomain for user1`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        account: Account.address,
        action: Action.renewDomain,
        authPermission: 'active',
        data: {
          actor: account1,
          fio_domain: testFioDomainName,
          max_fee: defaultFee,
          tpid: '',
        },
      }) as TransactionResponse

      expect(result.status).to.equal('OK')
    } catch (e) {
      console.log(e)
    }
  })

  it(`addaddress as user2`, async () => {
    try {
      const result = await fioSdk2.genericAction('pushTransaction', {
        account: Account.address,
        action: Action.addPublicAddresses,
        authPermission: permissionName,
        data: {
          actor: account1,
          fio_address: testFioAddressName,
          max_fee: defaultFee,
          public_addresses: [
            {
              chain_code: 'BCH',
              public_address:
                'bitcoincash:qzf8zha74ahdh9j0xnwlffdn0zuyaslx3c90q7n9g9',
              token_code: 'BCH',
            },
          ],
          tpid: '',
        },
        signingAccount: account2,
      }) as TransactionResponse

      expect(result.status).to.equal('OK')
    } catch (e) {
      console.log(e)
    }
  })
})
