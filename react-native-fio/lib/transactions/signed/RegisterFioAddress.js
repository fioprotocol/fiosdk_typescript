"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const Transactions_1 = require("../Transactions");
class RegisterFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress) {
        super();
        this.ENDPOINT = "chain/register_fio_address";
        this.ACTION = "regaddress";
        this.ACOUNT = "fio.system";
        this.fioAddress = fioAddress;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_address: this.fioAddress,
            owner_fio_public_key: Transactions_1.Transactions.publicKey,
            max_fee: 0,
            actor: actor
        };
        return data;
    }
}
exports.RegisterFioAddress = RegisterFioAddress;
