"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioAddress = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RenewFioAddress extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.renewFioAddress}`;
        this.ACTION = entities_1.Action.renewAddress;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            fio_address: this.props.fioAddress,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.renewFioAddress;
    }
}
exports.RenewFioAddress = RenewFioAddress;
//# sourceMappingURL=RenewFioAddress.js.map