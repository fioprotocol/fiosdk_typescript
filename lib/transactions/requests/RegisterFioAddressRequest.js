"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioAddressRequest = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RegisterFioAddressRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/register_fio_address';
        this.ACTION = 'regaddress';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
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
exports.RegisterFioAddressRequest = RegisterFioAddressRequest;
