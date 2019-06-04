import { RawAction } from "./RawAction";

export class RawTransaction{
        expiration: string = '' //'2018-09-04T18:42:49',
        ref_block_num: number  = 0//38096,
        ref_block_prefix: number = 0 //505360011,
        max_net_usage_words = 0
        max_cpu_usage_ms = 0
        delay_sec = 0
        context_free_actions= [] 
        actions: Array<RawAction> = new Array<RawAction>()
        transaction_extensions = [] 
}