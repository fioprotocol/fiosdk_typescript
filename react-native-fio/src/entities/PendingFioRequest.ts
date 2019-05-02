export interface PendingFioRequest{
    "fio_request_id": string,
    "payer_fio_address": string,
    "payee_fio_address": string,
    "payee_public_address": string,
    "amount": string,
    "token_code": string,
    "metadata": string,
    "time_stamp": number
}