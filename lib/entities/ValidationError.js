"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(list, ...params) {
        super(...params);
        this.list = [];
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
        this.name = 'ValidationError';
        this.list = Object.keys(list).map(key => ({ field: key, message: list[key] }));
    }
}
exports.ValidationError = ValidationError;
