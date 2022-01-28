import { RawAction } from './RawAction'

export class RawTransaction {
  public expiration: string = '' // '2018-09-04T18:42:49',
  public ref_block_num: number = 0// 38096,
  public ref_block_prefix: number = 0 // 505360011,
  public max_net_usage_words = 0
  public max_cpu_usage_ms = 0
  public delay_sec = 0
  public context_free_actions = []
  public actions: RawAction[] = new Array<RawAction>()
  public transaction_extensions = []
}
