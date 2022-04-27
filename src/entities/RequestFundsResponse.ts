export interface RequestFundsResponse {
  transaction_id: string,
  block_num: number,
  fio_request_id: number,
  status: string,
  fee_collected: number
}
