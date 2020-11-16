"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTransaction = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const encryptActions = {
    [constants_1.Constants.actionNames.newfundsreq]: {
        contentType: constants_1.Constants.CipherContentTypes.new_funds_content,
        contentKeyName: 'payer_fio_public_key'
    },
    [constants_1.Constants.actionNames.recordobt]: {
        contentType: constants_1.Constants.CipherContentTypes.record_obt_data_content,
        contentKeyName: 'payee_public_address'
    }
};
class PushTransaction extends SignedTransaction_1.SignedTransaction {
    constructor(action, data, options = {}) {
        super();
        this.ENDPOINT = 'chain/push_transaction';
        this.ACTION = '';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.additionalReturnKeys = {};
        this.ACTION = action;
        if (options.account)
            this.ACCOUNT = options.account;
        if (options.additionalReturnKeys)
            this.additionalReturnKeys = options.additionalReturnKeys;
        this.data = data;
    }
    getByPath(obj, path) {
        let current = obj;
        for (let i = 0; i < path.length; i++) {
            if (!current[path[i]])
                return null;
            current = current[path[i]];
        }
        return current;
    }
    prepareResponse(result) {
        if (!Object.keys(this.additionalReturnKeys).length || !result.processed)
            return SignedTransaction_1.SignedTransaction.prepareResponse(result);
        const apiResponse = SignedTransaction_1.SignedTransaction.parseProcessedResult(result.processed);
        const response = Object.assign({}, apiResponse);
        for (const key in this.additionalReturnKeys) {
            response[key] = this.getByPath(result, this.additionalReturnKeys[key]);
        }
        return response;
    }
    getData() {
        let actor = this.getActor();
        if (encryptActions[this.ACTION]) {
            const { contentType, contentKeyName } = encryptActions[this.ACTION];
            this.data.content = this.getCipherContent(contentType, this.data.content, this.privateKey, this.data.content[contentKeyName]);
        }
        let data = Object.assign(Object.assign({}, this.data), { actor: actor });
        return data;
    }
}
exports.PushTransaction = PushTransaction;
