"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNftsByHash = void 0;
const Query_1 = require("./Query");
class GetNftsByHash extends Query_1.Query {
    constructor(hash, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_nfts_hash';
        this.hash = hash;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return {
            hash: this.hash,
            limit: this.limit || null,
            offset: this.offset || null,
        };
    }
}
exports.GetNftsByHash = GetNftsByHash;
