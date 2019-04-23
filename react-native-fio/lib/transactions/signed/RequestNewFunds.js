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
class RequestNewFunds extends SignedTransaction_1.SignedTransaction {
    constructor(payerFioAddress, payeeFioAddress, payeePublicAddress, tokenCode, amount, metaData) {
        super();
        this.ENDPOINT = "chain/new_funds_request";
        this.ACTION = "newfundsreq";
        this.ACOUNT = "fio.reqobt";
        this.payerFioAddress = payerFioAddress;
        this.payeeFioAddress = payeeFioAddress;
        this.payeePublicAddress = payeePublicAddress;
        this.tokenCode = tokenCode;
        this.amount = amount;
        this.metaData = metaData;
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let actor = yield this.getActor();
            let data = {
                payer_fio_address: this.payerFioAddress,
                payee_fio_address: this.payeeFioAddress,
                payee_public_address: this.payeePublicAddress,
                amount: this.amount,
                token_code: this.tokenCode,
                metadata: this.metaData,
                actor: actor
            };
            return data;
        });
    }
}
exports.RequestNewFunds = RequestNewFunds;
