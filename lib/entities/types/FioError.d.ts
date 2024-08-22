export declare class FioError extends Error {
    list: Array<{
        field: string;
        message: string;
    }>;
    labelCode: string;
    errorCode: number;
    json: any;
    constructor(message: string, code?: number, labelCode?: string, json?: any);
}
//# sourceMappingURL=FioError.d.ts.map