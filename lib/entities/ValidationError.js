"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(list, ...params) {
        super(...params);
        this.list = [];
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
        this.name = 'ValidationError';
        this.list = list;
    }
}
exports.ValidationError = ValidationError;
