export interface RecordObtDataRequest {
  payer_fio_address: string,
  payee_fio_address: string,
  payer_public_address: string,
  payee_public_address: string,
  amount: string,
  chain_code: string,
  token_code: string,
  status: string,
  obt_id: string,
  metadata: string,
  fio_request_id: string,
  max_fee: number,
  actor: string
}
