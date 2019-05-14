export class Constants{
    static endPoints:{
        AddPublicAddress:"add_pub_address",
        RecordSend:"record_send",
        RegisterFioAddress:"register_fio_address",
        RegisterFioDomain:"register_fio_domain",
        RejectFundsRequest:"reject_funds_request",
        RequestNewFunds:"new_funds_request",
        TransferTokensKey:"transfer_tokens_pub_key"
    }

    static feeNoAddressOperation:Array<string> = [
        Constants.endPoints.RegisterFioDomain,
        Constants.endPoints.RegisterFioAddress,
        Constants.endPoints.TransferTokensKey,]

    static multiplier = 1000000000;

}