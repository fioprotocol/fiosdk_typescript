"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioDomainAddress = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioDomainAddress extends SignedTransaction_1.SignedTransaction {
    constructor(options) {
        super();
        this.options = options;
        this.ENDPOINT = 'chain/register_fio_domain_address';
        this.ACTION = 'regdomadd';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.validationData = { fioAddress: options.fioAddress, tpid: options.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioDomainAddress;
    }
    getData() {
        const actor = this.getActor();
        return {
            fio_address: this.options.fioAddress,
            max_fee: this.options.maxFee,
            is_public: this.options.isPublic ? 1 : 0,
            owner_fio_public_key: this.options.ownerPublicKey || this.publicKey || null,
            tpid: this.options.technologyProviderId || null,
            actor,
        };
    }
}
exports.RegisterFioDomainAddress = RegisterFioDomainAddress;
