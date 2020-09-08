"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioDomain = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
class RenewFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/renew_fio_domain';
        this.ACTION = 'renewdomain';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioDomain = fioDomain;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioDomain: fioDomain, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.renewFioDomain;
    }
    getData() {
        let actor = this.getActor();
        let data = {
            fio_domain: this.fioDomain,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor: actor
        };
        return data;
    }
}
exports.RenewFioDomain = RenewFioDomain;
