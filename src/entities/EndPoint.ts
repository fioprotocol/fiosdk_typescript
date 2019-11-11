export enum EndPoint {
  newFundsRequest = 'new_funds_request',
  registerFioAddress = 'register_fio_address',
  registerFioDomain = 'register_fio_domain',
  renewFioDomain = 'renew_fio_domain',
  renewFioAddress = 'renew_fio_address',
  addPubAddress = 'add_pub_address',
  setFioDomainPublic = 'set_fio_domain_public',
  rejectFundsRequest = 'reject_funds_request',
  recordSend = 'record_send',
  transferTokens = 'transfer_tokens_pub_key',
}