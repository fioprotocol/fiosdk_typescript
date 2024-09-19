"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordObtDataRequest = void 0;
const entities_1 = require("../../entities");
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class RecordObtDataRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.recordObtData}`;
        this.ACTION = entities_1.Action.recordObt;
        this.ACCOUNT = entities_1.Account.reqObt;
        this.getData = () => ({
            actor: this.getActor(),
            content: this.getCipherContent(entities_1.ContentType.recordObtDataContent, this.content, this.props.encryptPrivateKey || this.privateKey, this.props.payeeFioPublicKey),
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
            var _a, _b, _c, _d, _e, _f, _g;
            return (Object.assign(Object.assign({}, props), { encryptPrivateKey: (_a = props.encryptPrivateKey) !== null && _a !== void 0 ? _a : null, fioRequestId: (_b = props.fioRequestId) !== null && _b !== void 0 ? _b : 0, hash: (_c = props.hash) !== null && _c !== void 0 ? _c : null, memo: (_d = props.memo) !== null && _d !== void 0 ? _d : null, offLineUrl: (_e = props.offLineUrl) !== null && _e !== void 0 ? _e : null, payeeFioPublicKey: (_f = props.payeeFioPublicKey) !== null && _f !== void 0 ? _f : '', status: (_g = props.status) !== null && _g !== void 0 ? _g : entities_1.RequestStatus.paid }));
        };
        this.props = this.getResolvedProps(props);
        this.content = this.getResolvedContent();
        this.validationData = {
            payeeFioAddress: this.props.payeeFioAddress,
            payerFioAddress: this.props.payerFioAddress,
            tokenCode: this.props.tokenCode,
            tpid: this.props.technologyProviderId,
        };
        this.validationRules = validation_1.validationRules.recordObtData;
    }
}
exports.RecordObtDataRequest = RecordObtDataRequest;
//# sourceMappingURL=RecordObtDataRequest.js.map