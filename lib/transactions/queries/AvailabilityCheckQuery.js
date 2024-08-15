"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityCheckQuery = void 0;
const Query_1 = require("./Query");
class AvailabilityCheckQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/avail_check';
        this.getData = () => ({ fio_name: this.props.fioName });
    }
}
exports.AvailabilityCheckQuery = AvailabilityCheckQuery;
