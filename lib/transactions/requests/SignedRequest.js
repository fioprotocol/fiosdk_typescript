"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedRequest = void 0;
const constants_1 = require("../../utils/constants");
const Request_1 = require("../Request");
class SignedRequest extends Request_1.Request {
    static prepareResponse(result, includeTrxId = false) {
        if (result.processed) {
            const processed = SignedRequest.parseProcessedResult(result.processed);
            return Object.assign({ block_num: result.processed.block_num, block_time: result.processed.block_time, transaction_id: result.transaction_id }, processed);
        }
        return result;
    }
    static parseProcessedResult(processed) {
        try {
            if (!processed.action_traces[0].receipt.response) {
                return {};
            }
            return JSON.parse(processed.action_traces[0].receipt.response);
        }
        catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
        return {};
    }
    execute(privateKey, publicKey, dryRun = false, expirationOffset = constants_1.Constants.defaultExpirationOffset) {
        return __awaiter(this, void 0, void 0, function* () {
            this.privateKey = privateKey;
            this.publicKey = publicKey;
            this.expirationOffset = expirationOffset;
            const rawTransaction = yield this.createRawTransaction({
                account: this.getAccount(),
                action: this.getAction(),
                authPermission: this.getAuthPermission(),
                data: this.getData(),
                signingAccount: this.getSigningAccount(),
            });
            const result = yield this.pushToServer(rawTransaction, this.getEndPoint(), dryRun);
            return this.prepareResponse(result);
        });
    }
    prepareResponse(result) {
        return SignedRequest.prepareResponse(result);
    }
    getAction() {
        return this.ACTION;
    }
    getAccount() {
        return this.ACCOUNT;
    }
    getAuthPermission() {
        return this.authPermission;
    }
    getSigningAccount() {
        return this.signingAccount;
    }
    getEndPoint() {
        return this.ENDPOINT;
    }
}
exports.SignedRequest = SignedRequest;
