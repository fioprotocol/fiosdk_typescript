"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetFioDomainVisibility = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class SetFioDomainVisibility extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.setFioDomainPublic}`;
        this.ACTION = entities_1.Action.setDomainPublic;
        this.ACCOUNT = entities_1.Account.address;
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
exports.SetFioDomainVisibility = SetFioDomainVisibility;
//# sourceMappingURL=SetFioDomainVisibility.js.map