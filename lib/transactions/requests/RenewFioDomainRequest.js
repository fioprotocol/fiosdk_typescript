"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioDomainRequest = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RenewFioDomainRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/renew_fio_domain';
        this.ACTION = 'renewdomain';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.getData = () => ({
            actor: this.getActor(),
            fio_domain: this.props.fioDomain,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioDomain: props.fioDomain, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.renewFioDomain;
    }
}
exports.RenewFioDomainRequest = RenewFioDomainRequest;
