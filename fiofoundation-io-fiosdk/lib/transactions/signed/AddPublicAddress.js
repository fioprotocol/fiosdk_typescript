"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
class AddPublicAddress extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, tokenCode, publicAddress, maxFee, walletFioAddress = '') {
        super();
        this.ENDPOINT = 'chain/add_pub_address';
        this.ACTION = 'addaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
        this.validationData = { fioAddress, tokenCode, publicAddress, tpid: walletFioAddress };
        this.validationRules = validation_1.validationRules.addPublicAddressRules;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            token_code: this.tokenCode,
            public_address: this.publicAddress,
            actor,
            tpid: this.walletFioAddress,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.AddPublicAddress = AddPublicAddress;
