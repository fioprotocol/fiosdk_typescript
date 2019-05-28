"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const Transactions_1 = require("../Transactions");
class RegisterFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain) {
        super();
        this.ENDPOINT = "chain/register_fio_domain";
        this.ACTION = "regdomain";
        this.ACOUNT = "fio.system";
        this.fioDomain = fioDomain;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_domain: this.fioDomain,
            owner_fio_public_key: Transactions_1.Transactions.publicKey,
            max_fee: 0,
            actor: actor
        };
        return data;
    }
}
exports.RegisterFioDomain = RegisterFioDomain;
