"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RecordSend extends SignedTransaction_1.SignedTransaction {
    constructor(recordSendRequest) {
        super();
        this.ENDPOINT = "chain/record_send";
        this.ACTION = "recordsend";
        this.ACOUNT = "fio.reqobt";
        this.recordSendRequest = recordSendRequest;
        recordSendRequest.max_fee = 0;
    }
    getData() {
        let actor = this.getActor();
        this.recordSendRequest.actor = actor;
        let data = this.recordSendRequest;
        /*{
            recordsend:JSON.stringify(this.recordSendRequest)
        }*/
        return data;
    }
}
exports.RecordSend = RecordSend;
