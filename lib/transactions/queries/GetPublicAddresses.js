"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPublicAddresses = void 0;
const Query_1 = require("./Query");
class GetPublicAddresses extends Query_1.Query {
    constructor(fioAddress, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_pub_addresses';
        this.fioAddress = fioAddress;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return {
            fio_address: this.fioAddress,
            limit: this.limit || null,
            offset: this.offset || null
        };
    }
}
exports.GetPublicAddresses = GetPublicAddresses;
