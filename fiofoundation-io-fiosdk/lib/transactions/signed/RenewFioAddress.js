"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
class RenewFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, maxFee, walletFioAddress = "") {
        super();
        this.ENDPOINT = "chain/renew_fio_address";
        this.ACTION = "renewaddress";
        this.ACCOUNT = "fio.system";
        this.fioAddress = fioAddress;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_address: this.fioAddress,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor: actor
        };
        return data;
    }
}
exports.RenewFioAddress = RenewFioAddress;
