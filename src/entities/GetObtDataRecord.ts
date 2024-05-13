export interface GetObtDataRecord {
  payer_fio_address: string,
  payee_fio_address: string,
  payer_fio_public_key: string,
  payee_fio_public_key: string,
  content: string | { token_code: string }, // todo: set proper type for content
  fio_request_id: number,
  status: string,
  time_stamp: string
}
