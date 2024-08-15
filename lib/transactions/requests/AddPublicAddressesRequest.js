"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPublicAddressesRequest = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class AddPublicAddressesRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/add_pub_address';
        this.ACTION = 'addaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
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
exports.AddPublicAddressesRequest = AddPublicAddressesRequest;
