"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePublicAddressesRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RemovePublicAddressesRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.removePublicAddress}`;
        this.ACTION = entities_1.Action.removeAddress;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            fio_address: this.props.fioAddress,
            max_fee: this.props.maxFee,
            public_addresses: this.props.publicAddresses,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.addPublicAddressRules;
    }
}
exports.RemovePublicAddressesRequest = RemovePublicAddressesRequest;
//# sourceMappingURL=RemovePublicAddressesRequest.js.map