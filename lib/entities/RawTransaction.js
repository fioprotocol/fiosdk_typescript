"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawTransaction = void 0;
class RawTransaction {
    constructor() {
        this.expiration = ''; //'2018-09-04T18:42:49',
        this.ref_block_num = 0; //38096,
        this.ref_block_prefix = 0; //505360011,
        this.max_net_usage_words = 0;
        this.max_cpu_usage_ms = 0;
        this.delay_sec = 0;
        this.context_free_actions = [];
        this.actions = new Array();
        this.transaction_extensions = [];
    }
}
exports.RawTransaction = RawTransaction;
