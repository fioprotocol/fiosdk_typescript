"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNftsByFioAddress = void 0;
const Query_1 = require("./Query");
class GetNftsByFioAddress extends Query_1.Query {
    constructor(fioAddress, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_nfts_fio_address';
        this.fioAddress = fioAddress;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return {
            fio_address: this.fioAddress,
            limit: this.limit || null,
            offset: this.offset || null,
        };
    }
}
exports.GetNftsByFioAddress = GetNftsByFioAddress;
