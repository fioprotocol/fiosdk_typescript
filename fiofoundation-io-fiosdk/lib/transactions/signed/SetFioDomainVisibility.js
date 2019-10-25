"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
const constants_1 = require("../../utils/constants");
class SetFioDomainVisibility extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain, isPublic, maxFee, walletFioAddress = '') {
        super();
        this.ENDPOINT = 'chain/set_fio_domain_public';
        this.ACTION = 'addaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioDomain = fioDomain;
        this.isPublic = isPublic ? 1 : 0;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
    }
    getData() {
        this.validationData = { fioDomain: this.fioDomain, tpid: this.walletFioAddress };
        this.validationRules = validation_1.validationRules.registerFioAddress;
        const actor = this.getActor();
        const data = {
            fio_domain: this.fioDomain,
            is_public: this.isPublic,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor,
        };
        return data;
    }
}
exports.SetFioDomainVisibility = SetFioDomainVisibility;
