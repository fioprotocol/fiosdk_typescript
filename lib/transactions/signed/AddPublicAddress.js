"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPublicAddress = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
class AddPublicAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, publicAddresses, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/add_pub_address';
        this.ACTION = 'addaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.publicAddresses = publicAddresses;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioAddress, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.addPublicAddressRules;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            public_addresses: this.publicAddresses,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.AddPublicAddress = AddPublicAddress;

