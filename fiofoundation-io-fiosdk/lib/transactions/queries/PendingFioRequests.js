"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class PendingFioRequests extends Query_1.Query {
    constructor(fioPublicKey, limit = null, offset = null) {
        super();
        this.ENDPOINT = 'chain/get_pending_fio_requests';
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
    }
    getData() {
        const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null };
        return data;
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
