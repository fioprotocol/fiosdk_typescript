export class Constants {
  public static endPoints: any = {
    AddPublicAddress: 'add_pub_address',
    SetFioDomainVisibility: 'set_fio_domain_public',
    RecordSend: 'record_send',
    RegisterFioAddress: 'register_fio_address',
    RegisterFioDomain: 'register_fio_domain',
    RejectFundsRequest: 'reject_funds_request',
    RequestNewFunds: 'new_funds_request',
    TransferTokensKey: 'transfer_tokens_pub_key',
    TransferTokensFioAddress: 'transfer_tokens_fio_address',
  }

  public static feeNoAddressOperation: string[] = [
    Constants.endPoints.RegisterFioDomain,
    Constants.endPoints.RegisterFioAddress,
    Constants.endPoints.TransferTokensKey,
    Constants.endPoints.TransferTokensFioAddress,
  ]

  public static rawAbiAccountName: string[] = [
    'fio.system',
    'fio.reqobt',
    'fio.token',
  ]

  public static multiplier = 1000000000

}
