"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioError = void 0;
class FioError extends Error {
    constructor(message, code, labelCode, json) {
        super(message);
        this.list = [];
        this.labelCode = '';
        this.errorCode = 0;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FioError);
        }
        this.name = 'FioError';
        if (code) {
            this.errorCode = code;
        }
        if (labelCode) {
            this.labelCode = labelCode;
        }
        if (json) {
            this.json = json;
        }
    }
}
exports.FioError = FioError;
