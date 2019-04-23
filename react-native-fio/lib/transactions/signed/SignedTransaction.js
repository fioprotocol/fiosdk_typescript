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
const Transactions_1 = require("../Transactions");
class SignedTransaction extends Transactions_1.Transactions {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getData().then((res) => { return this.serializeJson(res, this.getAction()); })
                .then((jsonData) => { return jsonData.serialized_json; })
                .then((serializedData) => { return this.pushToServer(serializedData, this.getAcount(), this.getAction(), this.getEndPoint()); });
        });
    }
    getAction() {
        return this.ACTION;
    }
    getAcount() {
        return this.ACOUNT;
    }
    getEndPoint() {
        return this.ENDPOINT;
    }
}
exports.SignedTransaction = SignedTransaction;
