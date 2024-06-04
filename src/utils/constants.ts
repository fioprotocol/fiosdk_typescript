export class Constants {
  public static endPoints = {
    AddPublicAddress: 'add_pub_address',
    SetFioDomainVisibility: 'set_fio_domain_public',
    RecordObtData: 'record_obt_data',
    RegisterFioAddress: 'register_fio_address',
    RegisterFioDomainAddress: 'register_fio_domain_address',
    RegisterFioDomain: 'register_fio_domain',
    RejectFundsRequest: 'reject_funds_request',
    RequestNewFunds: 'new_funds_request',
    TransferTokensKey: 'transfer_tokens_pub_key',
    TransferTokensFioAddress: 'transfer_tokens_fio_address',
    PushTransaction: 'push_transaction',
    StakeFioTokens: 'stake_fio_tokens',
    UnStakeFioTokens: 'unstake_fio_tokens',
  }

  public static feeNoAddressOperation: string[] = [
    Constants.endPoints.RegisterFioDomain,
    Constants.endPoints.RegisterFioAddress,
    Constants.endPoints.RegisterFioDomainAddress,
    Constants.endPoints.TransferTokensKey,
    Constants.endPoints.TransferTokensFioAddress,
  ]

  public static rawAbiAccountName: string[] = [
    'fio.address',
    'fio.reqobt',
    'fio.token',
    'eosio',
    'fio.fee',
    'eosio.msig',
    'fio.treasury',
    'fio.tpid',
    'fio.staking',
    'fio.perms',
    'fio.escrow',
    'fio.oracle'
  ]

  public static multiplier = 1000000000

  public static defaultAccount: string = 'fio.address'

  public static defaultExpirationOffset = 180

  public static classMethodsToExcludeFromProxy: string[] = [
    'constructor',
    'SUFUnit',
    'derivedPublicKey',
    'isChainCodeValid',
    'isTokenCodeValid',
    'isFioAddressValid',
    'isFioDomainValid',
    'isFioPublicKeyValid',
    'isPublicAddressValid',
    'amountToSUF',
    'SUFToAmount',
    'getFioPublicKey',
    'getTechnologyProviderId',
    'setSignedTrxReturnOption',
    'setApiUrls',
    'getMultiplier',
    'getAbi',
    'customRawAbiAccountName',
    'setCustomRawAbiAccountName',
  ]

  public static missingAbiError = 'unknown key'
}
