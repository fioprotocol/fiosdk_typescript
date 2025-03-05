"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBundledTransactions = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class AddBundledTransactions extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.addBundledTransactions}`;
        this.ACTION = entities_1.Action.addBundledTransactions;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            bundle_sets: this.props.bundleSets,
            fio_address: this.props.fioAddress,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
}
exports.AddBundledTransactions = AddBundledTransactions;
//# sourceMappingURL=AddBundledTransactions.js.map