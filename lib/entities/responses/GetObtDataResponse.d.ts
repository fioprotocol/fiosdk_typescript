import { FioItem } from '../types/FioItem';
import { FioSentItem } from '../types/FioSentItem';
export type GetObtDataResponse = {
    obt_data_records: FioItem[];
    more: number;
};
export type GetObtDataDecryptedResponse = {
    obt_data_records: Array<FioItem | FioSentItem>;
    more: number;
};
//# sourceMappingURL=GetObtDataResponse.d.ts.map