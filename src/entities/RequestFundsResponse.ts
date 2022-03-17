export interface RequestFundsResponse {
  transaction_id?: string,
  fio_request_id: number,
  status: string,
  fee_collected: number
}
