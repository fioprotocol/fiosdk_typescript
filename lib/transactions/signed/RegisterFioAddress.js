"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioAddress = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.registerFioAddress}`;
        this.ACTION = entities_1.Action.regAddress;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            fio_address: this.props.fioAddress,
            max_fee: this.props.maxFee,
            owner_fio_public_key: this.props.ownerPublicKey || this.publicKey,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
}
exports.RegisterFioAddress = RegisterFioAddress;
//# sourceMappingURL=RegisterFioAddress.js.map