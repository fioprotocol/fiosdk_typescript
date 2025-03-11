"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferTokens = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class TransferTokens extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.transferTokensPublicKey}`;
        this.ACTION = entities_1.Action.transferTokensKey;
        this.ACCOUNT = entities_1.Account.token;
        this.getData = () => ({
            actor: this.getActor(),
            amount: this.props.amount,
            max_fee: this.props.maxFee,
            payee_public_key: this.props.payeeFioPublicKey,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.transferTokens;
    }
    prepareResponse(result) {
        if (!result.processed) {
            return result;
        }
        const apiResponse = SignedTransaction_1.SignedTransaction.parseProcessedResult(result.processed);
        return Object.assign({ block_num: result.processed.block_num, transaction_id: result.transaction_id }, apiResponse);
    }
}
exports.TransferTokens = TransferTokens;
//# sourceMappingURL=TransferTokens.js.map