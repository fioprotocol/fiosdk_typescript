"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class TransferTokens extends SignedTransaction_1.SignedTransaction {
    constructor(payeePublicKey, amount) {
        super();
        this.ENDPOINT = "chain/transfer_tokens_pub_key";
        this.ACTION = "transferfio";
        this.ACOUNT = "fio.token";
        this.payeePublicKey = payeePublicKey;
        this.amount = amount;
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let actor = yield this.getActor();
            let payee = yield TransferTokens.ReactNativeFio.getActor(this.payeePublicKey);
            let data = {
                payee_public_key: payee,
                amount: this.amount,
                max_fee: 0,
                actor: actor
            };
            return data;
        });
    }
}
exports.TransferTokens = TransferTokens;
