"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelFundsRequestRequest = void 0;
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class CancelFundsRequestRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/cancel_funds_request';
        this.ACTION = 'cancelfndreq';
        this.ACCOUNT = 'fio.reqobt';
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
exports.CancelFundsRequestRequest = CancelFundsRequestRequest;
