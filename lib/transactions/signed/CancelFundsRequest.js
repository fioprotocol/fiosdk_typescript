"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelFundsRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class CancelFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.cancelFundsRequest}`;
        this.ACTION = entities_1.Action.cancelFundsRequest;
        this.ACCOUNT = entities_1.Account.reqObt;
        this.getData = () => ({
            actor: this.getActor(),
            fio_request_id: this.props.fioRequestId,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.cancelFundsRequestRules;
    }
}
exports.CancelFundsRequest = CancelFundsRequest;
//# sourceMappingURL=CancelFundsRequest.js.map