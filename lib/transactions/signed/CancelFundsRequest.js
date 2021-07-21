"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
class CancelFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(fioRequestId, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/cancel_funds_request';
        this.ACTION = 'cancelfndreq';
        this.ACCOUNT = 'fio.reqobt';
        this.fioRequestId = fioRequestId;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.cancelFundsRequestRules;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_request_id: this.fioRequestId,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.CancelFundsRequest = CancelFundsRequest;
