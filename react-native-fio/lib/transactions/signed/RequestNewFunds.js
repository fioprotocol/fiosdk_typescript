"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RequestNewFunds extends SignedTransaction_1.SignedTransaction {
    constructor(payerFioAddress, payerFioPublicKey, payeeFioAddress, tpid = '', maxFee, payeePublicAddress, amount, tokenCode, memo = null, hash = null, offlineUrl = null) {
        super();
        this.ENDPOINT = "chain/new_funds_request";
        this.ACTION = "newfundsreq";
        this.ACOUNT = "fio.reqobt";
        this.payerFioAddress = payerFioAddress;
        this.payerFioPublicKey = payerFioPublicKey;
        this.payeeFioAddress = payeeFioAddress;
        this.tokenCode = tokenCode;
        this.maxFee = maxFee;
        this.content = {
            payee_public_address: payeePublicAddress,
            amount: amount,
            token_code: tokenCode,
            memo: memo,
            hash: hash,
            offline_url: offlineUrl
        };
        if (tpid) {
            this.tpid = tpid;
        }
        else {
            this.tpid = '';
        }
    }
    getData() {
        let actor = this.getActor();
        const cipherContent = this.getCipherContent('new_funds_content', this.content, this.privateKey, this.payerFioPublicKey);
        console.error('RequestNewFunds:getData:content: ', this.content);
        console.error('RequestNewFunds:getData:cipherContent: ', cipherContent);
        let data = {
            payer_fio_address: this.payerFioAddress,
            payee_fio_address: this.payeeFioAddress,
            content: cipherContent,
            max_fee: this.maxFee,
            tpid: this.tpid,
            actor: actor,
        };
        return data;
    }
}
exports.RequestNewFunds = RequestNewFunds;
