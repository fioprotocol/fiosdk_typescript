"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RecordSend extends SignedTransaction_1.SignedTransaction {
    constructor(fioReqID = '', payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, memo, maxFee, status = 'sent_to_blockchain') {
        super();
        this.ENDPOINT = "chain/record_send";
        this.ACTION = "recordsend";
        this.ACOUNT = "fio.reqobt";
        this.fioReqID = '';
        this.fioReqID = fioReqID;
        this.payerFIOAddress = payerFIOAddress;
        this.payeeFIOAddress = payeeFIOAddress;
        this.payerPublicAddress = payerPublicAddress;
        this.payeePublicAddress = payeePublicAddress;
        this.amount = amount;
        this.tokenCode = tokenCode;
        this.obtID = obtID;
        this.memo = memo;
        this.maxFee = maxFee;
        this.status = status;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_request_id: this.fioReqID,
            payer_fio_address: this.payerFIOAddress,
            payee_fio_address: this.payeeFIOAddress,
            payer_public_address: this.payerPublicAddress,
            payee_public_address: this.payeePublicAddress,
            amount: this.amount,
            token_code: this.tokenCode,
            obt_id: this.obtID,
            memo: this.memo,
            maxFee: this.maxFee,
            actor: actor,
            status: this.status
        };
        return data;
    }
}
exports.RecordSend = RecordSend;
