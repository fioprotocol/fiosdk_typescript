"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectFundsRequest = void 0;
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RejectFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(fioreqid, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/reject_funds_request';
        this.ACTION = 'rejectfndreq';
        this.ACCOUNT = 'fio.reqobt';
        this.fioreqid = fioreqid;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.rejectFunds;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_request_id: this.fioreqid,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor,
        };
        return data;
    }
}
exports.RejectFundsRequest = RejectFundsRequest;
