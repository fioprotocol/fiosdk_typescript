"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class AvailabilityCheck extends Query_1.Query {
    constructor(fioName) {
        super();
        this.ENDPOINT = 'chain/avail_check';
        this.fioName = fioName;
    }
    getData() {
        return { fio_name: this.fioName };
    }
}
exports.AvailabilityCheck = AvailabilityCheck;
