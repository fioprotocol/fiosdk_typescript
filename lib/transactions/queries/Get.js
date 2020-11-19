"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const Query_1 = require("./Query");
const EndPoint_1 = require("../../entities/EndPoint");
const constants_1 = require("../../utils/constants");
const encryptedEndpoints = {
    [`${EndPoint_1.EndPoint.pendingFioRequests}`]: {
        decryptKey: 'requests',
        decryptContentType: constants_1.Constants.CipherContentTypes.new_funds_content,
    },
    [`${EndPoint_1.EndPoint.sentFioRequests}`]: {
        decryptKey: 'requests',
        decryptContentType: constants_1.Constants.CipherContentTypes.new_funds_content,
    },
    [`${EndPoint_1.EndPoint.getObtData}`]: {
        decryptKey: 'obt_data_records',
        decryptContentType: constants_1.Constants.CipherContentTypes.record_obt_data_content,
    },
};
class Get extends Query_1.Query {
    constructor(endpoint, data, options = {}) {
        super();
        this.ENDPOINT = '';
        this.data = {};
        this.ENDPOINT = options.customEndpoint ? endpoint : `chain/${endpoint}`;
        this.data = data;
        this.isEncrypted = !!encryptedEndpoints[this.ENDPOINT];
    }
    getData() {
        return this.data;
    }
    decrypt(result) {
        const { decryptKey, decryptContentType } = encryptedEndpoints[this.ENDPOINT];
        if (result[decryptKey].length > 0) {
            const items = [];
            result[decryptKey].forEach((value) => {
                try {
                    let content;
                    if (value.payer_fio_public_key === this.publicKey) {
                        content = this.getUnCipherContent(decryptContentType, value.content, this.privateKey, value.payee_fio_public_key);
                    }
                    else {
                        content = this.getUnCipherContent(decryptContentType, value.content, this.privateKey, value.payer_fio_public_key);
                    }
                    value.content = content;
                    items.push(value);
                }
                catch (e) {
                    //
                }
            });
            return { [decryptKey]: items, more: result.more };
        }
    }
}
exports.Get = Get;
