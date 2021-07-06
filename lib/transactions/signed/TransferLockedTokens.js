"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferLockedTokens = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
class TransferLockedTokens extends SignedTransaction_1.SignedTransaction {
    constructor(payeePublicKey, canVote, periods, amount, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/transfer_locked_tokens';
        this.ACTION = 'trnsloctoks';
        this.ACCOUNT = 'fio.token';
        this.payeePublicKey = payeePublicKey;
        this.canVote = canVote ? 1 : 0;
        this.periods = periods;
        this.amount = amount;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.transferLockedTokensRequest;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            payee_public_key: this.payeePublicKey,
            can_vote: this.canVote,
            periods: this.periods,
            amount: this.amount,
            max_fee: this.maxFee,
            actor,
            tpid: this.technologyProviderId
        };
        return data;
    }
}
exports.TransferLockedTokens = TransferLockedTokens;
