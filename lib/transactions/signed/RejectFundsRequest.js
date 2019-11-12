"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
class RejectFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(fioreqid, maxFee, walletFioAddress = '') {
        super();
        this.ENDPOINT = 'chain/reject_funds_request';
        this.ACTION = 'rejectfndreq';
        this.ACCOUNT = 'fio.reqobt';
        this.fioreqid = fioreqid;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
        this.validationData = { tpid: walletFioAddress };
        this.validationRules = validation_1.validationRules.rejectFunds;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_request_id: this.fioreqid,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor: actor
        };
        return data;
    }
}
exports.RejectFundsRequest = RejectFundsRequest;
