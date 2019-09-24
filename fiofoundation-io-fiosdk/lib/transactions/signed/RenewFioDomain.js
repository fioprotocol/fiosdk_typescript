"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RenewFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain, maxFee, walletFioAddress = "") {
        super();
        this.ENDPOINT = "chain/renew_fio_domain";
        this.ACTION = "renewdomain";
        this.ACOUNT = "fio.system";
        this.fioDomain = fioDomain;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_domain: this.fioDomain,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor: actor
        };
        return data;
    }
}
exports.RenewFioDomain = RenewFioDomain;
