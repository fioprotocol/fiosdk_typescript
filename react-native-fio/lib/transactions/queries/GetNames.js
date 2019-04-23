"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetNames extends Query_1.Query {
    constructor(fioAddress) {
        super();
        this.ENDPOINT = "chain/get_fio_names";
        this.fioAddress = fioAddress;
    }
    getData() {
        return { fio_public_address: this.fioAddress };
    }
}
exports.GetNames = GetNames;
