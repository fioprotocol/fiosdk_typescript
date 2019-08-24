"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class PendingFioRequests extends Query_1.Query {
    constructor(fioPublicKey) {
        super();
        this.ENDPOINT = "chain/get_pending_fio_requests";
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
    }
    getData() {
        return { fio_public_key: this.fioPublicKey };
    }
    decrypt(result) {
        if (result.requests.length > 0) {
            const pendings = [];
            result.requests.forEach((value) => {
                let content;
                if (value.payer_fio_public_key === this.publicKey) {
                    content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payee_fio_public_key);
                }
                else {
                    content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payer_fio_public_key);
                }
                value.content = content;
                pendings.push(value);
            });
            return pendings;
        }
    }
}
exports.PendingFioRequests = PendingFioRequests;
