export interface ErrObj {
    field: string;
    message: string;
}
export declare class ValidationError extends Error {
    list: ErrObj[];
    constructor(list: ErrObj[], ...params: any);
}
//# sourceMappingURL=ValidationError.d.ts.map