"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("react-native-fio/transactions/queries/Query");
class SentFioRequests extends Query_1.Query {
    constructor(fioAddress) {
        super();
        this.ENDPOINT = "chain/get_sent_fio_requests";
        this.fioAddress = fioAddress;
    }
    getData() {
        return {
            fio_public_address: this.fioAddress,
        };
    }
}
exports.SentFioRequests = SentFioRequests;
