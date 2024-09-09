"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFioAddressRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class TransferFioAddressRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.transferFioAddress}`;
        this.ACTION = entities_1.Action.transferAddress;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            fio_address: this.props.fioAddress,
            max_fee: this.props.maxFee,
            new_owner_fio_public_key: this.props.newOwnerKey,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
}
exports.TransferFioAddressRequest = TransferFioAddressRequest;
//# sourceMappingURL=TransferFioAddressRequest.js.map