"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFioDomainAddress = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RegisterFioDomainAddress extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.registerFioDomainAddress}`;
        this.ACTION = entities_1.Action.regDomainAddress;
        this.ACCOUNT = entities_1.Account.address;
        this.getData = () => ({
            actor: this.getActor(),
            fio_address: this.props.fioAddress,
            is_public: this.props.isPublic ? 1 : 0,
            max_fee: this.props.maxFee,
            owner_fio_public_key: this.props.ownerPublicKey || this.publicKey,
            tpid: this.props.technologyProviderId,
        });
        this.validationData = { fioAddress: props.fioAddress, tpid: props.technologyProviderId };
        this.validationRules = validation_1.validationRules.registerFioDomainAddress;
    }
}
exports.RegisterFioDomainAddress = RegisterFioDomainAddress;
//# sourceMappingURL=RegisterFioDomainAddress.js.map