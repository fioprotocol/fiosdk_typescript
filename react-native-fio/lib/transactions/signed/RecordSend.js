"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RecordSend extends SignedTransaction_1.SignedTransaction {
    constructor(payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, maxFee, status, tpid = '', payerFioPublicKey, fioReqID = '', memo = null, hash = null, offLineUrl = null) {
        super();
        this.ENDPOINT = "chain/record_send";
        this.ACTION = "recordsend";
        this.ACOUNT = "fio.reqobt";
        this.fioReqID = '';
        this.tpid = '';
        this.fioReqID = fioReqID;
        this.payerFIOAddress = payerFIOAddress;
        this.payerFioPublicKey = payerFioPublicKey;
        this.payeeFIOAddress = payeeFIOAddress;
        this.payerPublicAddress = payerPublicAddress;
        this.payeePublicAddress = payeePublicAddress;
        if (tpid) {
            this.tpid = tpid;
        }
        else {
            this.tpid = '';
        }
        this.maxFee = maxFee;
        this.content = {
            payer_public_address: this.payerPublicAddress,
            payee_public_address: this.payeePublicAddress,
            amount: amount,
            token_code: tokenCode,
            status: status,
            obt_id: obtID,
            memo: memo,
            hash: hash,
            offline_url: offLineUrl
        };
    }
    getData() {
        let actor = this.getActor();
        const cipherContent = this.getCipherContent('record_send_content', this.content, this.privateKey, this.payerFioPublicKey);
        let data = {
            payer_fio_address: this.payerFIOAddress,
            payee_fio_address: this.payeeFIOAddress,
            content: cipherContent,
            fio_request_id: this.fioReqID,
            max_fee: this.maxFee,
            actor: actor,
            tpid: this.tpid
        };
        return data;
    }
}
exports.RecordSend = RecordSend;
