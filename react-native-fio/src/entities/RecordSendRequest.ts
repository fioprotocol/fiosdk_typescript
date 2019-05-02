export interface RecordSendRequest{
        payer_fio_address:string,
        payee_fio_address:string,
        payer_public_address:string,
        payee_public_address:string,
        amount:string,
        token_code:string,
        chaincode:string,
        status:string,
        obt_id:string,
        metadata:string,
        fio_request_id:string,
        actor:string
}