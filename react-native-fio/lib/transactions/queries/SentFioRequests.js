"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class SentFioRequests extends Query_1.Query {
    constructor(fioPublicKey) {
        super();
        this.ENDPOINT = "chain/get_sent_fio_requests";
        this.fioPublicKey = fioPublicKey;
    }
    getData() {
        return {
            fio_public_key: this.fioPublicKey,
        };
    }
}
exports.SentFioRequests = SentFioRequests;
