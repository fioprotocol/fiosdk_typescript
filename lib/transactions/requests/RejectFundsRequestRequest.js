"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectFundsRequestRequest = void 0;
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RejectFundsRequestRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/reject_funds_request';
        this.ACTION = 'rejectfndreq';
        this.ACCOUNT = 'fio.reqobt';
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
exports.RejectFundsRequestRequest = RejectFundsRequestRequest;
