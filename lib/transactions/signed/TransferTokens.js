"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferTokens = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
class TransferTokens extends SignedTransaction_1.SignedTransaction {
    constructor(payeePublicKey, amount, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/transfer_tokens_pub_key';
        this.ACTION = 'trnsfiopubky';
        this.ACCOUNT = 'fio.token';
        this.payeePublicKey = payeePublicKey;
        this.amount = `${amount}`;
        this.technologyProviderId = technologyProviderId;
        this.maxFee = maxFee;
        this.validationData = { tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.transferTokens;
    }
    prepareResponse(result) {
        if (!result.processed)
            return result;
        const apiResponse = this.parseProcessedResult(result.processed);
        return Object.assign({ transaction_id: result.transaction_id, block_num: result.processed.block_num }, apiResponse);
    }
    getData() {
        let actor = this.getActor();
        let data = {
            payee_public_key: this.payeePublicKey,
            amount: this.amount,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor: actor
        };
        return data;
    }
}
exports.TransferTokens = TransferTokens;
