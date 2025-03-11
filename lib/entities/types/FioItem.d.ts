import { RequestStatus } from '../RequestStatus';
export type FioItem = {
    fio_request_id: number;
    payer_fio_address: string;
    payee_fio_address: string;
    payee_fio_public_key: string;
    payer_fio_public_key: string;
    status: RequestStatus;
    time_stamp: string;
    content: string;
};
//# sourceMappingURL=FioItem.d.ts.map