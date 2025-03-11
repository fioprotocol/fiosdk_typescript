import { RawAction } from './RawAction';
export type RawRequest = {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
    max_net_usage_words: number;
    max_cpu_usage_ms: number;
    delay_sec: number;
    context_free_actions: [];
    actions: RawAction[];
    transaction_extensions: [];
};
//# sourceMappingURL=RawRequest.d.ts.map