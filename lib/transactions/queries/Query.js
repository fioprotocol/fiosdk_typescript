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
exports.Query = void 0;
const Transactions_1 = require("../Transactions");
class Query extends Transactions_1.Transactions {
    constructor() {
        super(...arguments);
        this.isEncrypted = false;
    }
    decrypt(result) {
    }
    execute(publicKey, privateKey = '') {
        return __awaiter(this, void 0, void 0, function* () {
            this.publicKey = publicKey;
            this.privateKey = privateKey;
            if (!this.isEncrypted) {
                return this.executeCall(this.getEndPoint(), JSON.stringify(this.getData()));
            }
            else {
                try {
                    const result = yield this.executeCall(this.getEndPoint(), JSON.stringify(this.getData()));
                    return this.decrypt(result);
                }
                catch (error) {
                    throw error;
                }
            }
        });
    }
    getEndPoint() {
        return this.ENDPOINT;
    }
}
exports.Query = Query;
