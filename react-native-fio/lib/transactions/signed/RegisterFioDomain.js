"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
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
            owner_fio_public_key: this.publicKey,
            max_fee: 0,
            actor: actor
        };
        return data;
    }
}
exports.RegisterFioDomain = RegisterFioDomain;
