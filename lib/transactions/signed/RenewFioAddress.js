"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioAddress = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RenewFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/renew_fio_address';
        this.ACTION = 'renewaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioAddress, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.renewFioAddress;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            max_fee: this.maxFee,
            tpid: this.technologyProviderId,
            actor,
        };
        return data;
    }
}
exports.RenewFioAddress = RenewFioAddress;
