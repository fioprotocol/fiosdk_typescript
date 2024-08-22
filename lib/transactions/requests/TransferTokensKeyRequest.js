"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferTokensKeyRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class TransferTokensKeyRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.transferTokensKey}`;
        this.ACTION = entities_1.Action.transferTokensKey;
        this.ACCOUNT = entities_1.Account.token;
        this.getData = () => ({
            actor: this.getActor(),
            amount: this.props.amount,
            max_fee: this.props.maxFee,
            payee_public_key: this.props.payeeFioPublicKey,
            tpid: this.props.technologyProviderId,
        });
        this.getResolvedProps = (props) => (Object.assign(Object.assign({}, props), { 
            // TODO why amount is string?
            amount: `${props.amount}` }));
        this.props = this.getResolvedProps(props);
        this.validationData = { tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.transferTokens;
    }
    prepareResponse(result) {
        if (!result.processed) {
            return result;
        }
        const apiResponse = SignedRequest_1.SignedRequest.parseProcessedResult(result.processed);
        return Object.assign({ block_num: result.processed.block_num, transaction_id: result.transaction_id }, apiResponse);
    }
}
exports.TransferTokensKeyRequest = TransferTokensKeyRequest;
