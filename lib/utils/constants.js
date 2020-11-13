"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.endPoints = {
    AddPublicAddress: 'add_pub_address',
    SetFioDomainVisibility: 'set_fio_domain_public',
    RecordObtData: 'record_obt_data',
    RegisterFioAddress: 'register_fio_address',
    RegisterFioDomain: 'register_fio_domain',
    RejectFundsRequest: 'reject_funds_request',
    RequestNewFunds: 'new_funds_request',
    TransferTokensKey: 'transfer_tokens_pub_key',
    TransferTokensFioAddress: 'transfer_tokens_fio_address',
    AvailabilityCheck: 'avail_check',
    CancelledFioRequests: 'get_cancelled_fio_requests',
    GetAbi: 'get_raw_abi',
    GetAddresses: 'get_fio_addresses',
    GetDomains: 'get_fio_domains',
    GetFee: 'get_fee',
    GetFioBalance: 'get_fio_balance',
    GetNames: 'get_fio_names',
    GetObtData: 'get_obt_data',
    GetPublicAddress: 'get_pub_address',
    PendingFioRequests: 'get_pending_fio_requests',
    SentFioRequests: 'get_sent_fio_requests',
};
Constants.feeNoAddressOperation = [
    Constants.endPoints.RegisterFioDomain,
    Constants.endPoints.RegisterFioAddress,
    Constants.endPoints.TransferTokensKey,
    Constants.endPoints.TransferTokensFioAddress,
];
Constants.actionNames = {
    regaddress: 'regaddress',
    renewaddress: 'renewaddress',
    regdomain: 'regdomain',
    renewdomain: 'renewdomain',
    setdomainpub: 'setdomainpub',
    xferaddress: 'xferaddress',
    xferdomain: 'xferdomain',
    addaddress: 'addaddress',
    remaddress: 'remaddress',
    remalladdr: 'remalladdr',
    newfundsreq: 'newfundsreq',
    recordobt: 'recordobt',
    cancelfndreq: 'cancelfndreq',
    rejectfndreq: 'rejectfndreq',
    trnsfiopubky: 'trnsfiopubky',
    burnaddress: 'burnaddress',
};
Constants.abiAccounts = {
    fio_address: 'fio.address',
    fio_reqobt: 'fio.reqobt',
    fio_token: 'fio.token',
    eosio: 'eosio',
    fio_fee: 'fio.fee',
    eosio_msig: 'eosio.msig',
};
Constants.rawAbiAccountName = [
    Constants.abiAccounts.fio_address,
    Constants.abiAccounts.fio_reqobt,
    Constants.abiAccounts.fio_token,
    Constants.abiAccounts.eosio,
    Constants.abiAccounts.fio_fee,
    Constants.abiAccounts.eosio_msig,
];
Constants.multiplier = 1000000000;
Constants.defaultAccount = Constants.abiAccounts.fio_address;
Constants.CipherContentTypes = {
    new_funds_content: 'new_funds_content',
    record_obt_data_content: 'record_obt_data_content',
};
Constants.TrxStatuses = {
    sent_to_blockchain: 'sent_to_blockchain',
};
