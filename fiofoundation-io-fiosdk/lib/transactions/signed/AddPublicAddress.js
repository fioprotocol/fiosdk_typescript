"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class AddPublicAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, tokenCode, publicAddress, maxFee) {
        super();
        this.ENDPOINT = "chain/add_pub_address";
        this.ACTION = "addaddress";
        this.ACOUNT = "fio.system";
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
        this.maxFee = maxFee;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_address: this.fioAddress,
            token_code: this.tokenCode,
            public_address: this.publicAddress,
            actor: actor,
            max_fee: this.maxFee
        };
        return data;
    }
}
exports.AddPublicAddress = AddPublicAddress;
