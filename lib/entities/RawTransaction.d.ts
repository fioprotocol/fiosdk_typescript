import { RawAction } from './RawAction';
export declare class RawTransaction {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
    max_net_usage_words: number;
    max_cpu_usage_ms: number;
    delay_sec: number;
    context_free_actions: never[];
    actions: RawAction[];
    transaction_extensions: never[];
}
//# sourceMappingURL=RawTransaction.d.ts.map