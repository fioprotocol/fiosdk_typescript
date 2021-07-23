"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioAddress = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
const constants_1 = require("../../utils/constants");
class RegisterFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, ownerPublicKey, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/register_fio_address';
        this.ACTION = 'regaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.ownerPublicKey = ownerPublicKey || '';
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioAddress: fioAddress, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            owner_fio_public_key: this.ownerPublicKey || this.publicKey,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor,
        };
        return data;
    }
}
exports.RegisterFioAddress = RegisterFioAddress;
