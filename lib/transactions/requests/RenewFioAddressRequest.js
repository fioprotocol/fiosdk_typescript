"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioAddressRequest = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RenewFioAddressRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/renew_fio_address';
        this.ACTION = 'renewaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
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
exports.RenewFioAddressRequest = RenewFioAddressRequest;
