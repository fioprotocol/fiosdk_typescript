"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordObtData = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const validation_1 = require("../../utils/validation");
class RecordObtData extends SignedTransaction_1.SignedTransaction {
    constructor(fioRequestId, payerFioAddress, payeeFioAddress, payerPublicAddress, payeePublicAddress, amount, chainCode, tokenCode, obtID, maxFee, status, technologyProviderId = '', payeeFioPublicKey, memo = null, hash = null, offLineUrl = null) {
        super();
        this.ENDPOINT = 'chain/record_obt_data';
        this.ACTION = 'recordobt';
        this.ACCOUNT = 'fio.reqobt';
        this.fioRequestId = null;
        this.technologyProviderId = '';
        this.defaultStatus = 'sent_to_blockchain';
        this.fioRequestId = fioRequestId;
        this.payerFioAddress = payerFioAddress;
        this.payeeFioPublicKey = payeeFioPublicKey;
        this.payeeFioAddress = payeeFioAddress;
        this.payerPublicAddress = payerPublicAddress;
        this.payeePublicAddress = payeePublicAddress;
        if (technologyProviderId) {
            this.technologyProviderId = technologyProviderId;
        }
        else {
            this.technologyProviderId = '';
        }
        this.maxFee = maxFee;
        this.content = {
            payer_public_address: this.payerPublicAddress,
            payee_public_address: this.payeePublicAddress,
            amount: `${amount}`,
            chain_code: chainCode,
            token_code: tokenCode,
            status: status || this.defaultStatus,
            obt_id: obtID,
            memo: memo,
            hash: hash,
            offline_url: offLineUrl
        };
        this.validationData = { payerFioAddress: payerFioAddress, payeeFioAddress: payeeFioAddress, tpid: technologyProviderId || null, tokenCode };
        this.validationRules = validation_1.validationRules.recordObtData;
    }
    getData() {
        let actor = this.getActor();
        const cipherContent = this.getCipherContent('record_obt_data_content', this.content, this.privateKey, this.payeeFioPublicKey);
        let data = {
            payer_fio_address: this.payerFioAddress,
            payee_fio_address: this.payeeFioAddress,
            content: cipherContent,
            fio_request_id: this.fioRequestId || '',
            max_fee: this.maxFee,
            actor: actor,
            tpid: this.technologyProviderId
        };
        return data;
    }
}
exports.RecordObtData = RecordObtData;
