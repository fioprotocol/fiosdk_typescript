"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteCallError = void 0;
class ExecuteCallError extends Error {
    constructor(message, errorCode = '', requestParams, json) {
        super(message);
        this.errorCode = errorCode;
        this.requestParams = requestParams;
        this.json = json;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExecuteCallError);
        }
        this.name = 'ExecuteCallError';
    }
}
exports.ExecuteCallError = ExecuteCallError;
//# sourceMappingURL=ExecuteCallError.js.map