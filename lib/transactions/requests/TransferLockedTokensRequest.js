"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferLockedTokensRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class TransferLockedTokensRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.transferLockedTokens}`;
        this.ACTION = entities_1.Action.transferLockedTokens;
        this.ACCOUNT = entities_1.Account.token;
        this.getData = () => ({
            actor: this.getActor(),
            amount: this.props.amount,
            can_vote: this.props.canVote ? 1 : 0,
            max_fee: this.props.maxFee,
            payee_public_key: this.props.payeePublicKey,
            periods: this.props.periods,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.transferLockedTokensRequest;
    }
}
exports.TransferLockedTokensRequest = TransferLockedTokensRequest;
//# sourceMappingURL=TransferLockedTokensRequest.js.map