"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioFeeQuery = void 0;
const entities_1 = require("../../entities");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const Query_1 = require("./Query");
class FioFeeQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFee}`;
        this.getData = () => ({ end_point: this.props.endPoint, fio_address: this.props.fioAddress });
        this.getResolvedProps = (props) => {
            var _a;
            return (Object.assign(Object.assign({}, props), { fioAddress: (_a = props.fioAddress) !== null && _a !== void 0 ? _a : '' }));
        };
        this.props = this.getResolvedProps(props);
        if (constants_1.feeNoAddressOperation.findIndex((element) => element === this.props.endPoint) > -1
            && this.props.fioAddress.length > 0) {
            throw new Error(`End point ${this.props.endPoint} should not have any fio address, when requesting fee`);
        }
        if (props.fioAddress) {
            this.validationData = { fioAddress: this.props.fioAddress };
            this.validationRules = validation_1.validationRules.getFee;
        }
    }
}
exports.FioFeeQuery = FioFeeQuery;
//# sourceMappingURL=FioFeeQuery.js.map