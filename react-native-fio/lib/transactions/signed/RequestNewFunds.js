"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RequestNewFunds extends SignedTransaction_1.SignedTransaction {
    constructor(payerFioAddress, payeeFioAddress, payeePublicAddress, tokenCode, amount, metaData, maxFee) {
        super();
        this.ENDPOINT = "chain/new_funds_request";
        this.ACTION = "newfundsreq";
        this.ACOUNT = "fio.reqobt";
        this.payerFioAddress = payerFioAddress;
        this.payeeFioAddress = payeeFioAddress;
        this.payeePublicAddress = payeePublicAddress;
        this.tokenCode = tokenCode;
        this.amount = amount;
        this.metaData = metaData;
        this.maxFee = maxFee;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            payer_fio_address: this.payerFioAddress,
            payee_fio_address: this.payeeFioAddress,
            payee_public_address: this.payeePublicAddress,
            amount: this.amount,
            token_code: this.tokenCode,
            metadata: this.metaData,
            actor: actor,
            max_fee: this.maxFee
        };
        return data;
    }
}
exports.RequestNewFunds = RequestNewFunds;
