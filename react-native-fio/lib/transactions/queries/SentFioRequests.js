"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class SentFioRequests extends Query_1.Query {
    constructor(fioPublicKey) {
        super();
        this.ENDPOINT = "chain/get_sent_fio_requests";
        this.isEncrypted = true;
        this.fioPublicKey = fioPublicKey;
    }
    getData() {
        return {
            fio_public_key: this.fioPublicKey,
        };
    }
    decrypt(result) {
        console.error('decrypt: ', result);
        if (result.requests.length > 0) {
            const pendings = [];
            result.requests.forEach((value) => {
                const content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payer_fio_public_key);
                console.error("SentFioRequests:content: ", content);
                pendings.push(content);
            });
            return pendings;
        }
    }
}
exports.SentFioRequests = SentFioRequests;
