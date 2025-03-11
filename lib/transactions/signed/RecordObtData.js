"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordObtData = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedTransaction_1 = require("./SignedTransaction");
class RecordObtData extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.recordObtData}`;
        this.ACTION = entities_1.Action.recordObt;
        this.ACCOUNT = entities_1.Account.reqObt;
        this.getData = () => ({
            actor: this.getActor(),
            content: this.getCipherContent(entities_1.ContentType.recordObtDataContent, this.getResolvedContent(), this.props.encryptPrivateKey || this.privateKey, this.props.payeeFioPublicKey),
            fio_request_id: this.props.fioRequestId,
            max_fee: this.props.maxFee,
            payee_fio_address: this.props.payeeFioAddress,
            payer_fio_address: this.props.payerFioAddress,
            tpid: this.props.technologyProviderId,
        });
        this.getResolvedContent = () => ({
            amount: `${this.props.amount}`,
            chain_code: this.props.chainCode,
            hash: this.props.hash,
            memo: this.props.memo,
            obt_id: this.props.obtId,
            offline_url: this.props.offLineUrl,
            payee_public_address: this.props.payeeTokenPublicAddress,
            payer_public_address: this.props.payerTokenPublicAddress,
            status: this.props.status,
            token_code: this.props.tokenCode,
        });
        this.getResolvedProps = (props) => {
            var _a, _b, _c, _d, _e, _f;
            return (Object.assign(Object.assign({}, props), { encryptPrivateKey: (_a = props.encryptPrivateKey) !== null && _a !== void 0 ? _a : null, hash: (_b = props.hash) !== null && _b !== void 0 ? _b : null, memo: (_c = props.memo) !== null && _c !== void 0 ? _c : null, offLineUrl: (_d = props.offLineUrl) !== null && _d !== void 0 ? _d : null, payeeFioPublicKey: (_e = props.payeeFioPublicKey) !== null && _e !== void 0 ? _e : '', status: (_f = props.status) !== null && _f !== void 0 ? _f : entities_1.FioRequestStatus.sentToBlockchain }));
        };
        this.props = this.getResolvedProps(props);
        this.validationData = {
            payeeFioAddress: this.props.payeeFioAddress,
            payerFioAddress: this.props.payerFioAddress,
            tokenCode: this.props.tokenCode,
            tpid: this.props.technologyProviderId,
        };
        this.validationRules = validation_1.validationRules.recordObtData;
    }
}
exports.RecordObtData = RecordObtData;
//# sourceMappingURL=RecordObtData.js.map