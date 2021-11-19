"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNftsByContract = void 0;
const Query_1 = require("./Query");
class GetNftsByContract extends Query_1.Query {
    constructor(chainCode, contractAddress, tokenId, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_nfts_contract';
        this.chainCode = chainCode;
        this.contractAddress = contractAddress;
        this.tokenId = tokenId || null;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return {
            chain_code: this.chainCode,
            contract_address: this.contractAddress,
            token_id: this.tokenId,
            limit: this.limit || null,
            offset: this.offset || null
        };
    }
}
exports.GetNftsByContract = GetNftsByContract;
