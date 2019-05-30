"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RecordSend extends SignedTransaction_1.SignedTransaction {
    constructor(fioReqID = '', payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, memo, maxFee) {
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
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fioReqID: this.fioReqID,
            payerFIOAddress: this.payerFIOAddress,
            payeeFIOAddress: this.payeeFIOAddress,
            payerPublicAddress: this.payerPublicAddress,
            payeePublicAddress: this.payeePublicAddress,
            amount: this.amount,
            tokenCode: this.tokenCode,
            obtID: this.obtID,
            memo: this.memo,
            maxFee: this.maxFee,
            actor: actor
        };
        return data;
    }
}
exports.RecordSend = RecordSend;
