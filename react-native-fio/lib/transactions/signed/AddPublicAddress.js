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
const SignedTransaction_1 = require("react-native-fio/transactions/signed/SignedTransaction");
class AddPublicAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, tokenCode, publicAddress) {
        super();
        this.ENDPOINT = "chain/add_pub_address";
        this.ACTION = "addaddress";
        this.ACOUNT = "fio.system";
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let actor = yield this.getActor();
            let data = {
                fio_address: this.fioAddress,
                token_code: this.tokenCode,
                public_address: this.publicAddress,
                actor: actor
            };
            return data;
        });
    }
}
exports.AddPublicAddress = AddPublicAddress;
