"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RecordSend extends SignedTransaction_1.SignedTransaction {
    constructor(fioReqID = '', payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, metadata, maxFee, tpid, status = 'sent_to_blockchain') {
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
        this.metadata = metadata;
        this.maxFee = maxFee;
        if (status) {
            this.status = status;
        }
        else {
            this.status = 'sent_to_blockchain';
        }
        this.tpid = tpid;
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
            metadata: this.metadata,
            max_fee: this.maxFee,
            actor: actor,
            status: this.status,
            tpid: this.tpid
        };
        return data;
    }
}
exports.RecordSend = RecordSend;
