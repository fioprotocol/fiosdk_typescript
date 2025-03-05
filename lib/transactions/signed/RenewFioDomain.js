"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewFioDomain = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RenewFioDomain extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.renewFioDomain}`;
        this.ACTION = entities_1.Action.renewDomain;
        this.ACCOUNT = entities_1.Account.address;
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
exports.RenewFioDomain = RenewFioDomain;
//# sourceMappingURL=RenewFioDomain.js.map