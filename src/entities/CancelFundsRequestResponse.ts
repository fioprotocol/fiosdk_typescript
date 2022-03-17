export interface CancelFundsRequestResponse {
  transaction_id: string,
  block_num: number,
  status: string,
  fee_collected: number
}
