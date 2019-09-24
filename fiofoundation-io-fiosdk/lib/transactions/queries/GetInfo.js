"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetInfo extends Query_1.Query {
    constructor() {
        super();
        this.ENDPOINT = "chain/get_info";
    }
    getData() {
        return {};
    }
}
exports.GetInfo = GetInfo;
