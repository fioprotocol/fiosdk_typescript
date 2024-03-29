"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivedFioRequests = void 0;
const Query_1 = require("./Query");
class ReceivedFioRequests extends Query_1.Query {
    constructor(fioPublicKey, limit = null, offset = null, includeEncrypted = false) {
        super();
        this.ENDPOINT = 'chain/get_received_fio_requests';
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
        this.limit = limit;
        this.offset = offset;
        this.includeEncrypted = includeEncrypted;
    }
    getData() {
        const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null };
        return data;
    }
    decrypt(result) {
        if (result.requests.length > 0) {
            const requests = [];
            result.requests.forEach((value) => {
                try {
                    let content;
                    if (value.payer_fio_public_key === this.publicKey) {
                        content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payee_fio_public_key);
                    }
                    else {
                        content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payer_fio_public_key);
                    }
                    value.content = content;
                    requests.push(value);
                }
                catch (e) {
                    if (this.includeEncrypted)
                        requests.push(value);
                }
            });
            return { requests, more: result.more };
        }
    }
}
exports.ReceivedFioRequests = ReceivedFioRequests;
