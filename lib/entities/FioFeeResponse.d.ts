export interface FioFeeResponse {
    fee: number;
}
export interface FioOracleFeesResponse {
    oracle_fees: [
        {
            fee_name: 'wrap_fio_domain';
            fee_amount: number;
        },
        {
            fee_name: 'wrap_fio_tokens';
            fee_amount: number;
        }
    ];
}
//# sourceMappingURL=FioFeeResponse.d.ts.map