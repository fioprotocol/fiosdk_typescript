"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundsRequestRequest = void 0;
const validation_1 = require("../../utils/validation");
const SignedRequest_1 = require("./SignedRequest");
class FundsRequestRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = 'chain/new_funds_request';
        this.ACTION = 'newfundsreq';
        this.ACCOUNT = 'fio.reqobt';
        this.getData = () => ({
            actor: this.getActor(),
            content: this.getCipherContent('new_funds_content', this.content, this.props.encryptPrivateKey || this.privateKey, this.props.payerFioPublicKey),
            max_fee: this.props.maxFee,
            payee_fio_address: this.props.payeeFioAddress,
            payer_fio_address: this.props.payerFioAddress,
            tpid: this.props.technologyProviderId,
        });
        this.getResolvedProps = (props) => {
            var _a, _b, _c, _d, _e;
            return (Object.assign(Object.assign({}, props), { encryptPrivateKey: (_a = props.encryptPrivateKey) !== null && _a !== void 0 ? _a : null, hash: (_b = props.hash) !== null && _b !== void 0 ? _b : null, memo: (_c = props.memo) !== null && _c !== void 0 ? _c : null, offlineUrl: (_d = props.offlineUrl) !== null && _d !== void 0 ? _d : null, payerFioPublicKey: (_e = props.payerFioPublicKey) !== null && _e !== void 0 ? _e : '' }));
        };
        this.getResolvedContent = () => ({
            amount: `${this.props.amount}`,
            chain_code: this.props.chainCode,
            hash: this.props.hash,
            memo: this.props.memo,
            offline_url: this.props.offlineUrl,
            payee_public_address: this.props.payeeTokenPublicAddress,
            token_code: this.props.tokenCode,
        });
        this.props = this.getResolvedProps(props);
        this.content = this.getResolvedContent();
        this.validationData = {
            payeeFioAddress: this.props.payeeFioAddress,
            payerFioAddress: this.props.payerFioAddress,
            tokenCode: this.props.tokenCode,
            tpid: this.props.technologyProviderId,
        };
        this.validationRules = validation_1.validationRules.newFundsRequest;
    }
}
exports.FundsRequestRequest = FundsRequestRequest;
