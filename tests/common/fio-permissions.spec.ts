import { expect } from 'chai';
import { Account, Action, FIOSDK, TransactionResponse } from '../../src/FIOSDK';
import { generateTestingFioDomain } from '../utils';
import { defaultFee } from '../constants';

export const FioPermissionsTests = ({
  fioSdk,
  publicKey,
  publicKey2,
}: {
  fioSdk: FIOSDK,
  publicKey: string,
  publicKey2: string,
}) => describe('Testing Fio permissions', () => {
  let accountName: string
  let accountName2: string
  let newFioDomain: string
  const permName = 'register_address_on_domain'

  it(`create new domain and register to user 1`, async () => {

    accountName = FIOSDK.accountHash(publicKey).accountnm
    accountName2 = FIOSDK.accountHash(publicKey2).accountnm
    newFioDomain = generateTestingFioDomain()
    const result = await fioSdk.genericAction('registerFioDomain', { fioDomain: newFioDomain, maxFee: defaultFee })
    expect(result.status).to.equal('OK')
  })

  it(`First call addperm, user1 adds permission to user2 to register addresses on user1 domain `, async () => {

    const result = await fioSdk.genericAction('pushTransaction', {
      account: Account.perms,
      action: Action.addPerm,
      data: {
        actor: accountName,
        grantee_account: accountName2,
        max_fee: defaultFee,
        object_name: newFioDomain,
        permission_info: '',
        permission_name: permName,
        tpid: '',
      },
    }) as TransactionResponse

    expect(result.status).to.equal('OK')
  })

  it(`getGranteePermissions user2 account `, async () => {
    const result = await fioSdk.genericAction('getGranteePermissions', { granteeAccount: accountName2 })
    expect(result).to.have.keys('more', 'permissions')
    expect(result.permissions[0]).to.have.keys('grantee_account', 'permission_name',
      'permission_info', 'object_name', 'grantor_account')
  })

  it(`getGrantorPermissions user1 account `, async () => {
    const result = await fioSdk.genericAction('getGrantorPermissions', { grantorAccount: accountName })
    expect(result).to.have.keys('more', 'permissions')
    expect(result.permissions[0]).to.have.keys('grantee_account', 'permission_name',
      'permission_info', 'object_name', 'grantor_account')
  })

  it(`getObjectPermissions user1 domain and "register_address_on_domain" permission `, async () => {
    const result = await fioSdk.genericAction('getObjectPermissions', {
      objectName: newFioDomain,
      permissionName: permName,
    })
    expect(result).to.have.keys('more', 'permissions')
    expect(result.permissions[0]).to.have.keys('grantee_account', 'permission_name',
      'permission_info', 'object_name', 'grantor_account')
  })
})
