"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFioAddress = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class TransferFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, newOwnerKey, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/transfer_fio_address';
        this.ACTION = 'xferaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.newOwnerKey = newOwnerKey;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioAddress, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            new_owner_fio_public_key: this.newOwnerKey,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.TransferFioAddress = TransferFioAddress;
