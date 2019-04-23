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
class RejectFundsRequest extends SignedTransaction_1.SignedTransaction {
    constructor(fioreqid) {
        super();
        this.ENDPOINT = "chain/reject_funds_request";
        this.ACTION = "rejectfndreq";
        this.ACOUNT = "fio.reqobt";
        this.fioreqid = fioreqid;
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let actor = yield this.getActor();
            let data = {
                fio_request_id: this.fioreqid,
                actor: actor
            };
            return data;
        });
    }
}
exports.RejectFundsRequest = RejectFundsRequest;
