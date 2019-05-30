"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
}
Constants.endPoints = {
    AddPublicAddress: "add_pub_address",
    RecordSend: "record_send",
    RegisterFioAddress: "register_fio_address",
    RegisterFioDomain: "register_fio_domain",
    RejectFundsRequest: "reject_funds_request",
    RequestNewFunds: "new_funds_request",
    TransferTokensKey: "transfer_tokens_pub_key"
};
Constants.feeNoAddressOperation = [
    Constants.endPoints.RegisterFioDomain,
    Constants.endPoints.RegisterFioAddress,
    Constants.endPoints.TransferTokensKey,
    'transfer_tokens_by_pub_key',
];
Constants.rawAbiAccountName = [
    "fio.system",
    "fio.reqobt",
    "fio.token"
];
Constants.multiplier = 1000000000;
exports.Constants = Constants;
