"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
class TransferFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain, newOwnerKey, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/transfer_fio_domain';
        this.ACTION = 'xferdomain';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioDomain = fioDomain;
        this.newOwnerKey = newOwnerKey;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioDomain, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.registerFioDomain;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_domain: this.fioDomain,
            new_owner_fio_public_key: this.newOwnerKey,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.TransferFioDomain = TransferFioDomain;
