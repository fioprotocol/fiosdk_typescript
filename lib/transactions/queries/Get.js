"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const Query_1 = require("./Query");
class Get extends Query_1.Query {
    constructor(endpoint, data, options = {}) {
        super();
        this.ENDPOINT = '';
        this.data = {};
        this.decryptContentType = '';
        this.decryptKey = '';
        this.ENDPOINT = options.customEndpoint ? endpoint : `chain/${endpoint}`;
        this.data = data;
        this.isEncrypted = !!options.decrypt;
        this.decryptContentType = options.decrypt && options.decrypt.key ? options.decrypt.contentType : '';
        this.decryptKey = options.decrypt && options.decrypt.key ? options.decrypt.key : '';
    }
    getData() {
        return this.data;
    }
    decrypt(result) {
        if (result[this.decryptKey].length > 0) {
            const items = [];
            result[this.decryptKey].forEach((value) => {
                try {
                    let content;
                    if (value.payer_fio_public_key === this.publicKey) {
                        content = this.getUnCipherContent(this.decryptContentType, value.content, this.privateKey, value.payee_fio_public_key);
                    }
                    else {
                        content = this.getUnCipherContent(this.decryptContentType, value.content, this.privateKey, value.payer_fio_public_key);
                    }
                    value.content = content;
                    items.push(value);
                }
                catch (e) {
                    //
                }
            });
            return { [this.decryptKey]: items, more: result.more };
        }
    }
}
exports.Get = Get;
