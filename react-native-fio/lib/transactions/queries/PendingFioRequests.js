"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class PendingFioRequests extends Query_1.Query {
    constructor(publicAddress) {
        super();
        this.ENDPOINT = "chain/get_pending_fio_requests";
        this.publicAddress = publicAddress;
    }
    getData() {
        return { fio_public_address: this.publicAddress };
    }
}
exports.PendingFioRequests = PendingFioRequests;
