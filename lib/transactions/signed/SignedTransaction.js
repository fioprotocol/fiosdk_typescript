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
exports.SignedTransaction = void 0;
const Autorization_1 = require("../../entities/Autorization");
const RawAction_1 = require("../../entities/RawAction");
const RawTransaction_1 = require("../../entities/RawTransaction");
const Transactions_1 = require("../Transactions");
class SignedTransaction extends Transactions_1.Transactions {
    execute(privateKey, publicKey, dryRun = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.privateKey = privateKey;
            this.publicKey = publicKey;
            const rawTransaction = new RawTransaction_1.RawTransaction();
            const rawaction = new RawAction_1.RawAction();
            rawaction.account = this.getAccount();
            const actor = yield this.getActor();
            rawaction.authorization.push(new Autorization_1.Autorization(actor));
            rawaction.account = this.getAccount();
            rawaction.name = this.getAction();
            rawaction.data = this.getData();
            rawTransaction.actions.push(rawaction);
            const result = yield this.pushToServer(rawTransaction, this.getEndPoint(), dryRun);
            return this.prepareResponse(result);
        });
    }
    prepareResponse(result) {
        if (result.processed)
            return this.parseProcessedResult(result.processed);
        return result;
    }
    parseProcessedResult(processed) {
        return JSON.parse(processed.action_traces[0].receipt.response);
    }
    getAction() {
        return this.ACTION;
    }
    getAccount() {
        return this.ACCOUNT;
    }
    getEndPoint() {
        return this.ENDPOINT;
    }
}
exports.SignedTransaction = SignedTransaction;
