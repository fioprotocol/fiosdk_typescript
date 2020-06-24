"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetDomains extends Query_1.Query {
    constructor(fioPublicKey, limit = null, offset = null) {
        super();
        this.ENDPOINT = 'chain/get_fio_domains';
        this.fioPublicKey = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
    }
    getData() {
        return { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null };
    }
}
exports.GetDomains = GetDomains;
