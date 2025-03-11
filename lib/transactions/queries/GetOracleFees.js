"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOracleFees = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetOracleFees extends Query_1.Query {
    constructor() {
        super(...arguments);
        this.ENDPOINT = `chain/${entities_1.EndPoint.getOracleFees}`;
    }
    getData() {
        return;
    }
}
exports.GetOracleFees = GetOracleFees;
//# sourceMappingURL=GetOracleFees.js.map