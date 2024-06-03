"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioDomainAddress = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioDomainAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, maxFee, isPublic = false, ownerPublicKey = null, technologyProviderId = null) {
        super();
        this.fioAddress = fioAddress;
        this.maxFee = maxFee;
        this.isPublic = isPublic;
        this.ownerPublicKey = ownerPublicKey;
        this.technologyProviderId = technologyProviderId;
        this.ENDPOINT = 'chain/register_fio_domain_address';
        this.ACTION = 'regdomadd';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.validationData = { fioAddress, tpid: technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioDomainAddress;
    }
    getData() {
        const actor = this.getActor();
        return {
            fio_address: this.fioAddress,
            is_public: this.isPublic ? 1 : 0,
            owner_fio_public_key: this.ownerPublicKey || this.publicKey,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor,
        };
    }
}
exports.RegisterFioDomainAddress = RegisterFioDomainAddress;
