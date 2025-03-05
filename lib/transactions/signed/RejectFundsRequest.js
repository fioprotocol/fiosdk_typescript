"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectFundsRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RejectFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.rejectFundsRequest}`;
        this.ACTION = entities_1.Action.rejectFundsRequest;
        this.ACCOUNT = entities_1.Account.reqObt;
        this.getData = () => ({
            actor: this.getActor(),
            fio_request_id: this.props.fioRequestId,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.rejectFunds;
    }
}
exports.RejectFundsRequest = RejectFundsRequest;
//# sourceMappingURL=RejectFundsRequest.js.map