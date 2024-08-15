"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetFioDomainVisibilityRequest = void 0;
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class SetFioDomainVisibilityRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/set_fio_domain_public';
        this.ACTION = 'setdomainpub';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.getData = () => ({
            actor: this.getActor(),
            fio_domain: this.props.fioDomain,
            is_public: this.props.isPublic ? 1 : 0,
            max_fee: this.props.maxFee,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioDomain: props.fioDomain, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioDomain;
    }
}
exports.SetFioDomainVisibilityRequest = SetFioDomainVisibilityRequest;
