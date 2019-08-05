"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, maxFee) {
        super();
        this.ENDPOINT = "chain/register_fio_address";
        this.ACTION = "regaddress";
        this.ACOUNT = "fio.system";
        this.fioAddress = fioAddress;
        this.maxFee = maxFee;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_address: this.fioAddress,
            owner_fio_public_key: this.publicKey,
            max_fee: this.maxFee,
            actor: actor
        };
        return data;
    }
}
exports.RegisterFioAddress = RegisterFioAddress;
