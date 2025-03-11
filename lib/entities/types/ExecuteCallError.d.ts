interface ExecuteCallErrorJson {
    fields?: Array<{
        error: string;
    }>;
}
interface ExecuteCallErrorRequestParams {
    fields?: Array<{
        error: string;
    }>;
}
export declare class ExecuteCallError extends Error {
    errorCode: string;
    requestParams?: ExecuteCallErrorRequestParams | undefined;
    json?: ExecuteCallErrorJson | undefined;
    constructor(message: string, errorCode?: string, requestParams?: ExecuteCallErrorRequestParams | undefined, json?: ExecuteCallErrorJson | undefined);
}
export {};
//# sourceMappingURL=ExecuteCallError.d.ts.map