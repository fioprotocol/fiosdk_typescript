"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioDomain = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(fioDomain, ownerPublicKey, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/register_fio_domain';
        this.ACTION = 'regdomain';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioDomain = fioDomain;
        this.ownerPublicKey = ownerPublicKey || '';
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioDomain, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.registerFioDomain;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_domain: this.fioDomain,
            owner_fio_public_key: this.ownerPublicKey || this.publicKey,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor,
        };
        return data;
    }
}
exports.RegisterFioDomain = RegisterFioDomain;
